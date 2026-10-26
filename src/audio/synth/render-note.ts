// cspell:word blep
import {check} from '@augment-vir/assert';
import {createSeededNoise, midiToHz, normalizedTanh, panGains} from './synth-math.js';
import {
    StageKind,
    Waveform,
    type ModulatedValue,
    type SynthEnvelope,
    type SynthLayer,
    type SynthNote,
    type SynthOscillator,
    type SynthPatch,
    type SynthStage,
} from './synth-patch.js';

/** Envelope decay and release run this many time constants (about -69 dB) before a note ends. */
const timeConstantsUntilSilent = 8;
/** Filter coefficients are recomputed every this many samples instead of every sample. */
const controlBlockSamples = 8;
const middleCHz = midiToHz(60);

/** When an envelope with the given gate length becomes inaudible, in seconds from the note start. */
export function getEnvelopeEndSeconds({
    envelope,
    gateSeconds,
}: Readonly<{
    envelope: Readonly<SynthEnvelope>;
    gateSeconds: number;
}>) {
    const releaseEnd =
        Math.max(gateSeconds, envelope.attack) + envelope.release * timeConstantsUntilSilent;

    return envelope.sustain > 0
        ? releaseEnd
        : Math.min(releaseEnd, envelope.attack + envelope.decay * timeConstantsUntilSilent);
}

function getLayerEnvelope({layer, patch}: Readonly<{layer: SynthLayer; patch: SynthPatch}>) {
    return layer.ampEnvelope == undefined
        ? patch.amp
        : getPatchEnvelope({
              key: layer.ampEnvelope,
              patch,
          });
}

function getPatchEnvelope({key, patch}: Readonly<{key: string; patch: SynthPatch}>) {
    const envelope = patch.envelopes?.[key];

    if (!envelope) {
        throw new Error(`Synth patch has no envelope named '${key}'.`);
    }

    return envelope;
}

/** How long a note rings in seconds, from its start until every layer has gone silent. */
export function getNoteLengthSeconds({
    note,
    patch,
}: Readonly<{
    note: SynthNote;
    patch: SynthPatch;
}>) {
    return Math.max(
        ...patch.layers.map((layer) => {
            return getEnvelopeEndSeconds({
                envelope: getLayerEnvelope({
                    layer,
                    patch,
                }),
                gateSeconds: note.durationSeconds,
            });
        }),
    );
}

function renderEnvelope({
    envelope,
    gateSamples,
    length,
    sampleRate,
}: Readonly<{
    envelope: Readonly<SynthEnvelope>;
    gateSamples: number;
    length: number;
    sampleRate: number;
}>) {
    const levels = new Float32Array(length);
    const attackSamples = Math.round(envelope.attack * sampleRate);
    const decayCoefficient = envelope.decay > 0 ? Math.exp(-1 / (envelope.decay * sampleRate)) : 0;
    const releaseCoefficient =
        envelope.release > 0 ? Math.exp(-1 / (envelope.release * sampleRate)) : 0;
    let level = 0;

    for (let index = 0; index < length; index++) {
        if (index >= gateSamples) {
            level *= releaseCoefficient;
        } else if (index < attackSamples) {
            level = (index + 1) / attackSamples;
        } else {
            /** The attack ramp ends at full level, and a zero attack starts there. */
            const decayFrom = index === attackSamples ? 1 : level;

            level = envelope.sustain + (decayFrom - envelope.sustain) * decayCoefficient;
        }

        levels[index] = level;
    }

    return levels;
}

type NoteContext = Readonly<{
    envelopes: Readonly<Record<string, Float32Array>>;
    noteHz: number;
    velocity: number;
}>;

/** Turns a {@link ModulatedValue} into a per-sample reader. */
function createValueReader({
    context,
    value,
}: Readonly<{
    context: NoteContext;
    value: ModulatedValue;
}>): (index: number) => number {
    if (check.isNumber(value)) {
        return () => value;
    }

    const base =
        value.base * (value.keyTrack ? (context.noteHz / middleCHz) ** value.keyTrack : 1) +
        (value.velocityAmount ?? 0) * context.velocity;
    const envelopeLevels =
        value.envelope == undefined ? undefined : context.envelopes[value.envelope];

    if (value.envelope != undefined && !envelopeLevels) {
        throw new Error(`Synth patch has no envelope named '${value.envelope}'.`);
    } else if (!envelopeLevels || !value.envelopeAmount) {
        return () => base;
    }

    const envelopeAmount = value.envelopeAmount;

    return value.isSquared
        ? (index) => {
              const level = envelopeLevels[index] ?? 0;
              return base + envelopeAmount * level * level;
          }
        : (index) => base + envelopeAmount * (envelopeLevels[index] ?? 0);
}

/** Pitch in Hz for every sample of the note, including glides, pitch envelope, and vibrato. */
function renderNoteHz({
    context,
    length,
    note,
    patch,
    sampleRate,
}: Readonly<{
    context: NoteContext;
    length: number;
    note: SynthNote;
    patch: SynthPatch;
    sampleRate: number;
}>) {
    const hz = new Float32Array(length);
    const steps = (note.pitchSteps || []).map((step) => {
        return {
            atSample: Math.round(step.atSeconds * sampleRate),
            midi: step.midi,
        };
    });
    const glideCoefficient = patch.glideSeconds
        ? Math.exp(-1 / (patch.glideSeconds * sampleRate))
        : 0;
    const pitchEnvelopeLevels = patch.pitchEnvelope
        ? context.envelopes[patch.pitchEnvelope.envelope]
        : undefined;

    if (patch.pitchEnvelope && !pitchEnvelopeLevels) {
        throw new Error(`Synth patch has no envelope named '${patch.pitchEnvelope.envelope}'.`);
    } else if (!steps.length && !pitchEnvelopeLevels && !patch.vibrato) {
        return hz.fill(midiToHz(note.midi));
    }

    const pitchEnvelopeSemitones = patch.pitchEnvelope?.semitones ?? 0;
    const vibratoRadiansPerSample = ((patch.vibrato?.rateHz ?? 0) * 2 * Math.PI) / sampleRate;
    const vibratoSemitones = (patch.vibrato?.cents ?? 0) / 100;
    let targetMidi = note.midi;
    let currentMidi = note.midi;
    let stepIndex = 0;

    for (let index = 0; index < length; index++) {
        while (stepIndex < steps.length && (steps[stepIndex]?.atSample ?? Infinity) <= index) {
            targetMidi = steps[stepIndex]?.midi ?? targetMidi;
            stepIndex++;
        }

        currentMidi = targetMidi + (currentMidi - targetMidi) * glideCoefficient;

        const midi =
            currentMidi +
            pitchEnvelopeSemitones * (pitchEnvelopeLevels?.[index] ?? 0) +
            vibratoSemitones * Math.sin(index * vibratoRadiansPerSample);

        hz[index] = midiToHz(midi);
    }

    return hz;
}

function polyBlep({phase, phaseStep}: Readonly<{phase: number; phaseStep: number}>) {
    if (phase < phaseStep) {
        const position = phase / phaseStep;
        return position + position - position * position - 1;
    } else if (phase > 1 - phaseStep) {
        const position = (phase - 1) / phaseStep;
        return position * position + position + position + 1;
    } else {
        return 0;
    }
}

/** Adds one oscillator's output into `output`, band-limited with PolyBLEP. */
function addOscillator({
    context,
    noteHz,
    oscillator,
    output,
    random,
    sampleRate,
}: Readonly<{
    context: NoteContext;
    noteHz: Float32Array;
    oscillator: SynthOscillator;
    output: Float32Array;
    random: () => number;
    sampleRate: number;
}>) {
    const gain = oscillator.gain ?? 1;
    const multiplier = (oscillator.ratio ?? 1) * 2 ** ((oscillator.detuneCents ?? 0) / 1200);
    const readFixedHz =
        oscillator.fixedHz == undefined
            ? undefined
            : createValueReader({
                  context,
                  value: oscillator.fixedHz,
              });
    const readFmDepth = oscillator.fm
        ? createValueReader({
              context,
              value: oscillator.fm.depthHz,
          })
        : undefined;
    const fmRatio = oscillator.fm?.ratio ?? 0;
    const pulseWidth = oscillator.pulseWidth ?? 0.5;
    const wave = oscillator.wave;
    let phase = oscillator.phase ?? (wave === Waveform.Sine ? 0 : (random() + 1) / 2);
    let modulatorPhase = 0;

    for (let index = 0; index < output.length; index++) {
        if (wave === Waveform.Noise) {
            output[index] = (output[index] ?? 0) + random() * gain;
            continue;
        }

        let hz = readFixedHz ? readFixedHz(index) : (noteHz[index] ?? 0) * multiplier;

        if (readFmDepth) {
            modulatorPhase += (hz * fmRatio) / sampleRate;
            modulatorPhase -= Math.floor(modulatorPhase);
            hz += readFmDepth(index) * Math.sin(2 * Math.PI * modulatorPhase);
        }

        const phaseStep = Math.min(Math.abs(hz) / sampleRate, 0.5);
        let sample: number;

        if (wave === Waveform.Sine) {
            sample = Math.sin(2 * Math.PI * phase);
        } else if (wave === Waveform.Triangle) {
            sample = 4 * Math.abs(phase - 0.5) - 1;
        } else if (wave === Waveform.Saw) {
            sample =
                2 * phase -
                1 -
                polyBlep({
                    phase,
                    phaseStep,
                });
        } else {
            const fallingPhase = phase - pulseWidth + (phase < pulseWidth ? 1 : 0);
            sample =
                (phase < pulseWidth ? 1 : -1) +
                polyBlep({
                    phase,
                    phaseStep,
                }) -
                polyBlep({
                    phase: fallingPhase,
                    phaseStep,
                });
        }

        output[index] = (output[index] ?? 0) + sample * gain;
        phase += hz / sampleRate;
        phase -= Math.floor(phase);
    }
}

/** Runs a topology-preserving state variable filter over `samples` in place. */
function applyFilter({
    context,
    samples,
    sampleRate,
    stage,
}: Readonly<{
    context: NoteContext;
    samples: Float32Array;
    sampleRate: number;
    stage: Extract<SynthStage, {kind: StageKind.Lowpass | StageKind.Highpass | StageKind.Bandpass}>;
}>) {
    const readFrequency = createValueReader({
        context,
        value: stage.frequency,
    });
    const readQ = createValueReader({
        context,
        value: stage.q ?? Math.SQRT1_2,
    });
    const poleCount = stage.isFourPole ? 2 : 1;
    const states = new Float64Array(poleCount * 2);
    const maxHz = sampleRate * 0.45;
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    let damping = 0;

    for (let index = 0; index < samples.length; index++) {
        if (!(index % controlBlockSamples)) {
            const hz = Math.min(Math.max(readFrequency(index), 10), maxHz);
            const g = Math.tan((Math.PI * hz) / sampleRate);

            damping = 1 / Math.max(readQ(index), 0.3);
            a1 = 1 / (1 + g * (g + damping));
            a2 = g * a1;
            a3 = g * a2;
        }

        let sample = samples[index] ?? 0;

        for (let pole = 0; pole < poleCount; pole++) {
            const state1 = states[pole * 2] ?? 0;
            const state2 = states[pole * 2 + 1] ?? 0;
            const v3 = sample - state2;
            const v1 = a1 * state1 + a2 * v3;
            const v2 = state2 + a2 * state1 + a3 * v3;

            states[pole * 2] = 2 * v1 - state1;
            states[pole * 2 + 1] = 2 * v2 - state2;

            sample =
                stage.kind === StageKind.Lowpass
                    ? v2
                    : stage.kind === StageKind.Highpass
                      ? sample - damping * v1 - v2
                      : damping * v1;
        }

        samples[index] = sample;
    }
}

const stageAppliers: Readonly<{
    [Kind in StageKind]: (
        params: Readonly<{
            context: NoteContext;
            samples: Float32Array;
            sampleRate: number;
            stage: Extract<SynthStage, {kind: Kind}>;
        }>,
    ) => void;
}> = {
    [StageKind.Lowpass]: applyFilter,
    [StageKind.Highpass]: applyFilter,
    [StageKind.Bandpass]: applyFilter,
    [StageKind.Drive]({samples, stage}) {
        samples.forEach((sample, index) => {
            samples[index] = normalizedTanh({
                sample,
                drive: stage.amount,
            });
        });
    },
    [StageKind.Gain]({context, samples, stage}) {
        const readGain = createValueReader({
            context,
            value: stage.amount,
        });

        samples.forEach((sample, index) => {
            samples[index] = sample * readGain(index);
        });
    },
};

function applyStage(
    params: Readonly<{
        context: NoteContext;
        samples: Float32Array;
        sampleRate: number;
        stage: SynthStage;
    }>,
) {
    (stageAppliers[params.stage.kind] as (input: typeof params) => void)(params);
}

/**
 * Renders a single note into a stereo pair of buffers that start at the note's start. The buffers
 * run until every layer has gone silent, so they include the release.
 *
 * Rendering is deterministic: the same `seed` gives the same noise and oscillator phases.
 */
export function renderNote({
    note,
    patch,
    sampleRate,
    seed,
}: Readonly<{
    note: SynthNote;
    patch: SynthPatch;
    sampleRate: number;
    seed: number;
}>) {
    const length = Math.max(
        1,
        Math.ceil(
            getNoteLengthSeconds({
                note,
                patch,
            }) * sampleRate,
        ),
    );
    const gateSamples = Math.round(note.durationSeconds * sampleRate);
    const velocity = note.velocity ?? 1;
    const envelopes: Record<string, Float32Array> = {
        amp: renderEnvelope({
            envelope: patch.amp,
            gateSamples,
            length,
            sampleRate,
        }),
    };

    Object.entries(patch.envelopes || {}).forEach(
        ([
            key,
            envelope,
        ]) => {
            envelopes[key] = renderEnvelope({
                envelope,
                gateSamples,
                length,
                sampleRate,
            });
        },
    );

    const context: NoteContext = {
        envelopes,
        noteHz: midiToHz(note.midi),
        velocity,
    };
    const noteHz = renderNoteHz({
        context,
        length,
        note,
        patch,
        sampleRate,
    });
    const random = createSeededNoise(seed);
    const notePan = panGains(note.pan ?? 0);
    const velocityGain = 1 - (patch.velocityToGain ?? 1) * (1 - velocity);
    const left = new Float32Array(length);
    const right = new Float32Array(length);

    patch.layers.forEach((layer) => {
        const isStereo = layer.oscillators.some((oscillator) => !!oscillator.pan);
        const layerLeft = new Float32Array(length);
        const layerRight = isStereo ? new Float32Array(length) : undefined;

        layer.oscillators.forEach((oscillator) => {
            const oscillatorOutput = layerRight ? new Float32Array(length) : layerLeft;

            addOscillator({
                context,
                noteHz,
                oscillator,
                output: oscillatorOutput,
                random,
                sampleRate,
            });

            if (layerRight) {
                const oscillatorPan = panGains(oscillator.pan ?? 0);

                for (let index = 0; index < length; index++) {
                    const sample = oscillatorOutput[index] ?? 0;

                    layerLeft[index] = (layerLeft[index] ?? 0) + sample * oscillatorPan.left;
                    layerRight[index] = (layerRight[index] ?? 0) + sample * oscillatorPan.right;
                }
            }
        });

        const ampLevels =
            layer.ampEnvelope == undefined ? envelopes.amp : envelopes[layer.ampEnvelope];
        const layerGain = (layer.gain ?? 1) * velocityGain;
        const channelOutputs = layerRight
            ? [
                  {
                      samples: layerLeft,
                      targets: [
                          {
                              gain: notePan.left,
                              output: left,
                          },
                      ],
                  },
                  {
                      samples: layerRight,
                      targets: [
                          {
                              gain: notePan.right,
                              output: right,
                          },
                      ],
                  },
              ]
            : [
                  {
                      samples: layerLeft,
                      targets: [
                          {
                              gain: notePan.left,
                              output: left,
                          },
                          {
                              gain: notePan.right,
                              output: right,
                          },
                      ],
                  },
              ];

        channelOutputs.forEach(({samples, targets}) => {
            (layer.stages || []).forEach((stage) => {
                applyStage({
                    context,
                    samples,
                    sampleRate,
                    stage,
                });
            });

            targets.forEach(({gain, output}) => {
                const totalGain = gain * layerGain;

                for (let index = 0; index < length; index++) {
                    output[index] =
                        (output[index] ?? 0) +
                        (samples[index] ?? 0) * totalGain * (ampLevels?.[index] ?? 0);
                }
            });
        });
    });

    return {
        left,
        right,
    };
}
