// cspell:word adsr blep blepsaw blepsquare bleptriangle hadamard phasor predelay sparseq worklets
import {assertWrap, check} from '@augment-vir/assert';
import {getObjectTypedEntries, removeDuplicates} from '@augment-vir/common';
import {el, type ElemNode} from '@elemaudio/core';
import {dbToGain, hashSeed, midiToHz, panGains} from '../synth/synth-math.js';
import {
    StageKind,
    Waveform,
    type ModulatedValue,
    type SynthEnvelope,
    type SynthNote,
    type SynthOscillator,
    type SynthPatch,
    type SynthStage,
} from '../synth/synth-patch.js';
import {type SynthPump, type SynthScore, type SynthTrack} from '../synth/synth-score.js';

/**
 * `el.tapIn` hears its `el.tapOut` one block late. Browsers run audio worklets in 128-sample
 * blocks, so feedback lines are shortened by this much to keep their lengths exact.
 */
const tapBlockSamples = 128;
/** A track never runs more voices than this. Past it, a new note takes the oldest voice. */
const maxSlotsPerTrack = 8;
/**
 * A slot is reused once its note has decayed this many time constants (about -26 dB), so long
 * releases don't each hold a voice that has to be computed every sample.
 */
const audibleTimeConstants = 3;
/** Gates close at least this long before a slot's next note, so its envelopes retrigger. */
const retriggerGapSeconds = 0.002;
/** `el.adsr` takes the time to fall 60 dB, which is this many time constants. */
const timeConstantsPer60Db = Math.log(1000);

/** Drop-ship's reverb, in the same proportions as `applyReverb`. */
const reverbLineMs = [
    29.7,
    37.1,
    41.1,
    43.7,
    53.3,
    59.9,
    67.7,
    73.1,
];
const diffuserMs = [
    4.77,
    3.59,
    12.73,
    9.3,
];
const diffuserGain = 0.62;

type SequenceEntry = {
    time: number;
    value: number;
};

type Voice = Readonly<{
    envelopes: Readonly<Record<string, ElemNode>>;
    midi: ElemNode;
    velocity: ElemNode;
}>;

function sum(nodes: ReadonlyArray<ElemNode>) {
    return check.isLengthAtLeast(nodes, 2) ? el.add(...nodes) : (nodes[0] ?? 0);
}

function onePolePole({hz, sampleRate}: Readonly<{hz: number; sampleRate: number}>) {
    return Math.exp((-2 * Math.PI * hz) / sampleRate);
}

function highpassOnePole({
    hz,
    input,
    sampleRate,
}: Readonly<{hz: number; input: ElemNode; sampleRate: number}>) {
    return el.sub(
        input,
        el.smooth(
            onePolePole({
                hz,
                sampleRate,
            }),
            input,
        ),
    );
}

function normalizedTanh({drive, input}: Readonly<{drive: number; input: ElemNode}>) {
    return drive < 0.01 ? input : el.mul(1 / Math.tanh(drive), el.tanh(el.mul(drive, input)));
}

/**
 * A lane of values read at the clock's time. A lane that never changes folds to a plain number.
 * `el.sparseq2` holds the last entry at or before the time it reads, so every lane starts at `0`
 * with the value it has at the loop's end, for the clock to land on when it wraps.
 */
function readLane({
    entries,
    time,
}: Readonly<{
    entries: ReadonlyArray<SequenceEntry>;
    time: ElemNode;
}>) {
    const sorted = entries
        .toSorted((first, second) => first.time - second.time)
        .reduce<SequenceEntry[]>((accumulated, entry) => {
            const previous = accumulated.at(-1);

            /** Equal times make `el.sparseq2` ambiguous, so a later entry replaces an earlier one. */
            return previous?.time === entry.time
                ? [
                      ...accumulated.slice(0, -1),
                      entry,
                  ]
                : [
                      ...accumulated,
                      entry,
                  ];
        }, []);
    const last = assertWrap.isDefined(sorted.at(-1));

    return sorted.every((entry) => entry.value === last.value)
        ? last.value
        : el.sparseq2(
              {
                  seq: sorted.some((entry) => entry.time === 0)
                      ? sorted
                      : [
                            {
                                time: 0,
                                value: last.value,
                            },
                            ...sorted,
                        ],
              },
              time,
          );
}

function getAudibleSeconds({note, patch}: Readonly<{note: SynthNote; patch: SynthPatch}>) {
    return Math.max(
        ...patch.layers.map((layer) => {
            const envelope = getEnvelope({
                key: layer.ampEnvelope,
                patch,
            });
            const releaseEnd =
                Math.max(note.durationSeconds, envelope.attack) +
                envelope.release * audibleTimeConstants;

            return envelope.sustain > 0
                ? releaseEnd
                : Math.min(releaseEnd, envelope.attack + envelope.decay * audibleTimeConstants);
        }),
    );
}

function getEnvelope({key, patch}: Readonly<{key: string | undefined; patch: SynthPatch}>) {
    const envelope = key == undefined || key === 'amp' ? patch.amp : patch.envelopes?.[key];

    if (!envelope) {
        throw new Error(`Synth patch has no envelope named '${key}'.`);
    }

    return envelope;
}

/**
 * Splits a track's notes across voices that each play one note at a time. A note takes a voice that
 * has gone quiet, or a new voice, or (past {@link maxSlotsPerTrack}) the voice whose note has been
 * sounding longest.
 */
function allocateSlots({track}: Readonly<{track: SynthTrack}>) {
    return track.notes
        .toSorted((first, second) => first.startSeconds - second.startSeconds)
        .reduce<{notes: SynthNote[]; quietAt: number}[]>((slots, note) => {
            const quietAt =
                note.startSeconds +
                getAudibleSeconds({
                    note,
                    patch: track.patch,
                });
            const freeIndex = slots.findIndex((slot) => slot.quietAt <= note.startSeconds);
            const oldestIndex = slots.reduce((oldest, slot, index) => {
                return slot.quietAt < assertWrap.isDefined(slots[oldest]).quietAt ? index : oldest;
            }, 0);
            const index =
                freeIndex >= 0
                    ? freeIndex
                    : slots.length < maxSlotsPerTrack
                      ? slots.length
                      : oldestIndex;

            return slots.toSpliced(index, 1, {
                notes: [
                    ...(slots[index]?.notes || []),
                    note,
                ],
                quietAt,
            });
        }, [])
        .map((slot) => slot.notes);
}

/**
 * A slot's gate opens at each note's start and closes at its end, or just before the slot's next
 * note (wrapping around the loop) so every note retriggers.
 */
function createGateEntries({
    loopSeconds,
    notes,
}: Readonly<{
    loopSeconds: number;
    notes: ReadonlyArray<SynthNote>;
}>) {
    return notes.flatMap((note, index) => {
        const nextStart =
            notes[index + 1]?.startSeconds ?? loopSeconds + (notes[0]?.startSeconds ?? 0);
        const closeSeconds = Math.max(
            note.startSeconds,
            Math.min(
                note.startSeconds + note.durationSeconds,
                nextStart - retriggerGapSeconds,
                loopSeconds - retriggerGapSeconds,
            ),
        );

        return [
            {
                time: note.startSeconds,
                value: 1,
            },
            {
                time: closeSeconds,
                value: 0,
            },
        ];
    });
}

function createEnvelope({envelope, gate}: Readonly<{envelope: SynthEnvelope; gate: ElemNode}>) {
    return el.adsr(
        envelope.attack,
        envelope.decay * timeConstantsPer60Db,
        envelope.sustain,
        envelope.release * timeConstantsPer60Db,
        gate,
    );
}

function resolveValue({value, voice}: Readonly<{value: ModulatedValue; voice: Voice}>) {
    if (check.isNumber(value)) {
        return value;
    }

    const keyTracked = value.keyTrack
        ? el.mul(value.base, el.pow(2, el.mul(value.keyTrack / 12, el.sub(voice.midi, 60))))
        : value.base;
    const base = value.velocityAmount
        ? el.add(keyTracked, el.mul(value.velocityAmount, voice.velocity))
        : keyTracked;

    if (value.envelope == undefined || !value.envelopeAmount) {
        return base;
    }

    const level = voice.envelopes[value.envelope];

    if (level == undefined) {
        throw new Error(`Synth patch has no envelope named '${value.envelope}'.`);
    }

    return el.add(
        base,
        el.mul(value.envelopeAmount, value.isSquared ? el.mul(level, level) : level),
    );
}

/** The PolyBLEP correction for a step at phase `0`, read at `phase`. */
function polyBlep({phase, phaseStep}: Readonly<{phase: ElemNode; phaseStep: ElemNode}>) {
    const rising = el.div(phase, phaseStep);
    const falling = el.div(el.sub(phase, 1), phaseStep);

    return el.select(
        el.le(phase, phaseStep),
        el.sub(el.mul(2, rising), el.add(el.mul(rising, rising), 1)),
        el.select(
            el.ge(phase, el.sub(1, phaseStep)),
            el.add(el.mul(falling, falling), el.mul(2, falling), 1),
            0,
        ),
    );
}

/** `el.blepsquare` is fixed at half width, so other widths are built from a phasor. */
function createPulse({hz, pulseWidth}: Readonly<{hz: ElemNode; pulseWidth: number}>) {
    const phase = el.phasor(hz);
    const phaseStep = el.min(0.5, el.div(el.abs(hz), el.sr()));
    const shifted = el.sub(phase, pulseWidth);
    const fallingPhase = el.sub(shifted, el.floor(shifted));

    return el.add(
        el.select(el.le(phase, pulseWidth), 1, -1),
        polyBlep({
            phase,
            phaseStep,
        }),
        el.mul(
            -1,
            polyBlep({
                phase: fallingPhase,
                phaseStep,
            }),
        ),
    );
}

function createOscillator({
    noiseSeed,
    noteHz,
    oscillator,
    voice,
}: Readonly<{
    noiseSeed: number;
    noteHz: ElemNode;
    oscillator: SynthOscillator;
    voice: Voice;
}>) {
    const hz =
        oscillator.fixedHz == undefined
            ? el.mul(noteHz, (oscillator.ratio ?? 1) * 2 ** ((oscillator.detuneCents ?? 0) / 1200))
            : resolveValue({
                  value: oscillator.fixedHz,
                  voice,
              });
    const carrier = oscillator.fm
        ? el.add(
              hz,
              el.mul(
                  resolveValue({
                      value: oscillator.fm.depthHz,
                      voice,
                  }),
                  el.cycle(el.mul(hz, oscillator.fm.ratio)),
              ),
          )
        : hz;
    const waves: Record<Waveform, () => ElemNode> = {
        [Waveform.Sine]() {
            return el.cycle(carrier);
        },
        [Waveform.Triangle]() {
            return el.bleptriangle(carrier);
        },
        [Waveform.Saw]() {
            return el.blepsaw(carrier);
        },
        [Waveform.Square]() {
            const pulseWidth = oscillator.pulseWidth ?? 0.5;

            return pulseWidth === 0.5
                ? el.blepsquare(carrier)
                : createPulse({
                      hz: carrier,
                      pulseWidth,
                  });
        },
        [Waveform.Noise]() {
            return el.noise({
                seed: noiseSeed,
            });
        },
    };

    return el.mul(oscillator.gain ?? 1, waves[oscillator.wave]());
}

function createFilter({
    input,
    mode,
    stage,
    voice,
}: Readonly<{
    input: ElemNode;
    mode: 'lowpass' | 'highpass' | 'bandpass';
    stage: Extract<SynthStage, {kind: StageKind.Lowpass | StageKind.Highpass | StageKind.Bandpass}>;
    voice: Voice;
}>) {
    const hz = el.min(
        el.mul(0.45, el.sr()),
        el.max(
            10,
            resolveValue({
                value: stage.frequency,
                voice,
            }),
        ),
    );
    const q = el.max(
        0.3,
        resolveValue({
            value: stage.q ?? Math.SQRT1_2,
            voice,
        }),
    );

    function filter(filterInput: ElemNode) {
        const filtered = el.svf(
            {
                mode,
            },
            hz,
            q,
            filterInput,
        );

        /** Elementary's bandpass peaks at `q`, so it's scaled back to unity at the center. */
        return mode === 'bandpass' ? el.div(filtered, q) : filtered;
    }

    return stage.isFourPole ? filter(filter(input)) : filter(input);
}

const stageBuilders: Readonly<{
    [Kind in StageKind]: (
        params: Readonly<{
            input: ElemNode;
            stage: Extract<SynthStage, {kind: Kind}>;
            voice: Voice;
        }>,
    ) => ElemNode;
}> = {
    [StageKind.Lowpass](params) {
        return createFilter({
            ...params,
            mode: 'lowpass',
        });
    },
    [StageKind.Highpass](params) {
        return createFilter({
            ...params,
            mode: 'highpass',
        });
    },
    [StageKind.Bandpass](params) {
        return createFilter({
            ...params,
            mode: 'bandpass',
        });
    },
    [StageKind.Drive]({input, stage}) {
        return normalizedTanh({
            drive: stage.amount,
            input,
        });
    },
    [StageKind.Gain]({input, stage, voice}) {
        return el.mul(
            resolveValue({
                value: stage.amount,
                voice,
            }),
            input,
        );
    },
};

function applyStage(
    params: Readonly<{
        input: ElemNode;
        stage: SynthStage;
        voice: Voice;
    }>,
) {
    return (
        stageBuilders[params.stage.kind] satisfies (input: never) => ElemNode as (
            input: typeof params,
        ) => ElemNode
    )(params);
}

/** One voice of a track: the whole patch, playing whichever of the track's notes it's given. */
function createSlot({
    loopSeconds,
    notes,
    patch,
    seed,
    time,
}: Readonly<{
    loopSeconds: number;
    notes: ReadonlyArray<SynthNote>;
    patch: SynthPatch;
    seed: string;
    time: ElemNode;
}>) {
    const gate = readLane({
        entries: createGateEntries({
            loopSeconds,
            notes,
        }),
        time,
    });
    const midi = readLane({
        entries: notes.flatMap((note) => {
            return [
                {
                    time: note.startSeconds,
                    value: note.midi,
                },
                ...(note.pitchSteps || []).map((step) => {
                    return {
                        time: note.startSeconds + step.atSeconds,
                        value: step.midi,
                    };
                }),
            ];
        }),
        time,
    });
    const velocity = readLane({
        entries: notes.map((note) => {
            return {
                time: note.startSeconds,
                value: note.velocity ?? 1,
            };
        }),
        time,
    });
    const pan = readLane({
        entries: notes.map((note) => {
            return {
                time: note.startSeconds,
                value: note.pan ?? 0,
            };
        }),
        time,
    });
    const voice: Voice = {
        envelopes: getObjectTypedEntries({
            ...patch.envelopes,
            amp: patch.amp,
        }).reduce<Record<string, ElemNode>>(
            (
                envelopes,
                [
                    key,
                    envelope,
                ],
            ) => {
                return {
                    ...envelopes,
                    [key]: createEnvelope({
                        envelope,
                        gate,
                    }),
                };
            },
            {},
        ),
        midi,
        velocity,
    };
    const pitchEnvelope = patch.pitchEnvelope;
    const pitchEnvelopeLevel = pitchEnvelope ? voice.envelopes[pitchEnvelope.envelope] : 0;

    if (pitchEnvelopeLevel == undefined) {
        throw new Error(`Synth patch has no envelope named '${pitchEnvelope?.envelope}'.`);
    }

    const glidedMidi = patch.glideSeconds ? el.smooth(el.tau2pole(patch.glideSeconds), midi) : midi;
    const playedMidi = el.add(
        glidedMidi,
        el.mul(pitchEnvelope?.semitones ?? 0, pitchEnvelopeLevel),
        patch.vibrato ? el.mul(patch.vibrato.cents / 100, el.cycle(patch.vibrato.rateHz)) : 0,
    );
    const noteHz = el.mul(midiToHz(0), el.pow(2, el.div(playedMidi, 12)));
    const velocityGain = el.sub(1, el.mul(patch.velocityToGain ?? 1, el.sub(1, velocity)));
    const notePan = check.isNumber(pan)
        ? panGains(pan)
        : {
              left: el.mul(Math.SQRT2, el.cos(el.mul(Math.PI / 4, el.add(1, pan)))),
              right: el.mul(Math.SQRT2, el.sin(el.mul(Math.PI / 4, el.add(1, pan)))),
          };
    const layers = patch.layers.map((layer, layerIndex) => {
        const isStereo = layer.oscillators.some((oscillator) => !!oscillator.pan);
        const oscillators = layer.oscillators.map((oscillator, oscillatorIndex) => {
            return {
                node: createOscillator({
                    noiseSeed: (hashSeed(seed, layerIndex, oscillatorIndex) % 2_147_483_646) + 1,
                    noteHz,
                    oscillator,
                    voice,
                }),
                pan: panGains(oscillator.pan ?? 0),
            };
        });
        const channels = isStereo
            ? [
                  sum(oscillators.map(({node, pan}) => el.mul(pan.left, node))),
                  sum(oscillators.map(({node, pan}) => el.mul(pan.right, node))),
              ]
            : [
                  sum(oscillators.map(({node}) => node)),
              ];
        const [
            left = 0,
            right = left,
        ] = channels.map((channel) => {
            const processed = (layer.stages || []).reduce<ElemNode>((input, stage) => {
                return applyStage({
                    input,
                    stage,
                    voice,
                });
            }, channel);

            return el.mul(
                processed,
                assertWrap.isDefined(voice.envelopes[layer.ampEnvelope || 'amp']),
                velocityGain,
                layer.gain ?? 1,
            );
        });

        return {
            left: el.mul(notePan.left, left),
            right: el.mul(notePan.right, right),
        };
    });

    return {
        left: sum(layers.map((layer) => layer.left)),
        right: sum(layers.map((layer) => layer.right)),
    };
}

type Stereo = Readonly<{
    left: ElemNode;
    right: ElemNode;
}>;

function mapStereo(stereo: Stereo, map: (side: ElemNode) => ElemNode): Stereo {
    return {
        left: map(stereo.left),
        right: map(stereo.right),
    };
}

function sumStereo(parts: ReadonlyArray<Stereo>): Stereo {
    return {
        left: sum(parts.map((part) => part.left)),
        right: sum(parts.map((part) => part.right)),
    };
}

/** Same as `applyPingPongDelay`, run live. */
function createPingPongDelay({
    delay,
    input,
    name,
    sampleRate,
}: Readonly<{
    delay: NonNullable<SynthScore['delay']>;
    input: Stereo;
    name: string;
    sampleRate: number;
}>) {
    const delaySamples = Math.max(tapBlockSamples + 1, Math.round(delay.seconds * sampleRate));
    const lowpassPole = onePolePole({
        hz: delay.lowpassHz ?? 20_000,
        sampleRate,
    });

    function feedback(output: ElemNode) {
        return el.mul(
            delay.feedback,
            highpassOnePole({
                hz: delay.highpassHz ?? 10,
                input: el.smooth(lowpassPole, output),
                sampleRate,
            }),
        );
    }

    function line(side: string, lineInput: ElemNode) {
        return el.tapOut(
            {
                name: `${name}:${side}`,
            },
            el.delay(
                {
                    size: 2 ** Math.ceil(Math.log2(delaySamples)),
                },
                delaySamples - tapBlockSamples,
                0,
                lineInput,
            ),
        );
    }

    return {
        left: line(
            'left',
            el.add(
                el.mul(0.5, el.add(input.left, input.right)),
                feedback(
                    el.tapIn({
                        name: `${name}:right`,
                    }),
                ),
            ),
        ),
        right: line(
            'right',
            feedback(
                el.tapIn({
                    name: `${name}:left`,
                }),
            ),
        ),
    };
}

/**
 * Mixes values with a normalized Hadamard matrix, which keeps their total energy. The return type
 * is explicit because the function is recursive.
 */
function hadamard(values: ReadonlyArray<ElemNode>): ElemNode[] {
    if (values.length < 2) {
        return [...values];
    }

    const first = hadamard(values.slice(0, values.length / 2));
    const second = hadamard(values.slice(values.length / 2));

    return [
        ...first.map((value, index) => el.mul(Math.SQRT1_2, el.add(value, second[index] ?? 0))),
        ...first.map((value, index) => el.mul(Math.SQRT1_2, el.sub(value, second[index] ?? 0))),
    ];
}

/** Same as `applyReverb`, run live. */
function createReverb({
    input,
    name,
    reverb,
    sampleRate,
}: Readonly<{
    input: Stereo;
    name: string;
    reverb: NonNullable<SynthScore['reverb']>;
    sampleRate: number;
}>) {
    const size = reverb.size ?? 1;
    const predelaySamples = Math.max(1, Math.round((reverb.predelaySeconds ?? 0) * sampleRate));
    const diffused = [
        input.left,
        input.right,
    ].map((side, sideIndex) => {
        const delayed = el.delay(
            {
                size: 2 ** Math.ceil(Math.log2(predelaySamples + 1)),
            },
            predelaySamples,
            0,
            side,
        );
        const withoutLows = highpassOnePole({
            hz: reverb.highpassHz ?? 200,
            input: delayed,
            sampleRate,
        });

        return diffuserMs.reduce<ElemNode>((diffuserInput, ms) => {
            const length = Math.round((ms * (sideIndex ? 1.13 : 1) * sampleRate) / 1000);

            return el.sub(
                el.mul(
                    1 - diffuserGain * diffuserGain,
                    el.delay(
                        {
                            size: 2 ** Math.ceil(Math.log2(length + 1)),
                        },
                        length,
                        diffuserGain,
                        diffuserInput,
                    ),
                ),
                el.mul(diffuserGain, diffuserInput),
            );
        }, withoutLows);
    });
    const lineLengths = reverbLineMs.map((ms) => Math.round((ms * size * sampleRate) / 1000));
    const dampingPole = onePolePole({
        hz: reverb.dampingHz ?? 6000,
        sampleRate,
    });
    const mixed = hadamard(
        lineLengths.map((length, index) => {
            const lineGain = 10 ** ((-3 * length) / (reverb.seconds * sampleRate));

            return el.mul(
                lineGain,
                el.smooth(
                    dampingPole,
                    el.tapIn({
                        name: `${name}:${index}`,
                    }),
                ),
            );
        }),
    );
    const outputs = lineLengths.map((length, index) => {
        return el.tapOut(
            {
                name: `${name}:${index}`,
            },
            el.delay(
                {
                    size: 2 ** Math.ceil(Math.log2(length)),
                },
                length - tapBlockSamples,
                0,
                el.add(
                    assertWrap.isDefined(mixed[index]),
                    assertWrap.isDefined(diffused[index % 2]),
                ),
            ),
        );
    });

    /** Alternating signs keep the two sides' sums from correlating. */
    function sideSum(side: number) {
        return el.mul(
            0.5,
            sum(
                outputs
                    .filter((_output, index) => index % 2 === side)
                    .map((output, index) => (index % 2 ? el.mul(-1, output) : output)),
            ),
        );
    }

    return {
        left: sideSum(0),
        right: sideSum(1),
    };
}

/**
 * A look-ahead peak limiter: the audio is delayed while the gain is computed from the signal before
 * the delay, so the gain is already down when a peak arrives.
 */
function createLimiter({
    input,
    master,
    sampleRate,
}: Readonly<{
    input: Stereo;
    master: NonNullable<SynthScore['master']>;
    sampleRate: number;
}>) {
    const ceiling = dbToGain(master.limiter?.ceilingDb ?? -1);
    const lookaheadSamples = Math.max(
        1,
        Math.round((master.limiter?.attackSeconds ?? 0.003) * sampleRate),
    );
    function getPeak(stereo: Stereo) {
        return el.max(el.abs(stereo.left), el.abs(stereo.right));
    }

    const delayed = mapStereo(input, (side) => {
        return el.delay(
            {
                size: 2 ** Math.ceil(Math.log2(lookaheadSamples + 1)),
            },
            lookaheadSamples,
            0,
            side,
        );
    });
    /** Rises instantly and falls slowly, so the gain stays down until the delayed peak has passed. */
    const held = el.env(0, el.tau2pole(master.limiter?.releaseSeconds ?? 0.12), getPeak(input));
    const gain = el.min(
        el.smooth(el.tau2pole(0.0006), el.div(ceiling, el.max(ceiling, held))),
        /** `held` has already released a little by the time its peak comes out of the delay. */
        el.div(ceiling, el.max(ceiling, getPeak(delayed))),
    );

    return mapStereo(delayed, (side) => el.mul(gain, side));
}

function createPumpLevel({pump, time}: Readonly<{pump: SynthPump; time: ElemNode}>) {
    const attackSeconds = pump.attackSeconds ?? 0.004;

    return createEnvelope({
        envelope: {
            attack: attackSeconds,
            decay: 1,
            sustain: 1,
            release: pump.releaseSeconds,
        },
        gate: readLane({
            entries: pump.triggerSeconds.flatMap((seconds) => {
                return [
                    {
                        time: seconds,
                        value: 1,
                    },
                    {
                        time: seconds + attackSeconds + pump.holdSeconds,
                        value: 0,
                    },
                ];
            }),
            time,
        }),
    });
}

/**
 * Builds a graph that plays `score` on repeat, live, from the start of the score. It sounds like
 * `renderScore`'s output except that the master gain is always `score.master.gainDb`, and the
 * limiter only looks a few milliseconds ahead.
 *
 * `name` keeps the graph's feedback lines apart from any other score's in the same renderer.
 */
export function buildScoreGraph({
    name,
    sampleRate,
    score,
}: Readonly<{
    name: string;
    sampleRate: number;
    score: SynthScore;
}>) {
    const loopSeconds = score.durationSeconds;
    const time = el.mul(loopSeconds, el.phasor(1 / loopSeconds));
    const pumpLevel = score.pump?.triggerSeconds.length
        ? createPumpLevel({
              pump: score.pump,
              time,
          })
        : 0;
    const tracks = score.tracks.map((track, trackIndex) => {
        const slots = allocateSlots({
            track,
        }).map((notes, slotIndex) => {
            return createSlot({
                loopSeconds,
                notes,
                patch: track.patch,
                seed: [
                    score.seed || '',
                    trackIndex,
                    slotIndex,
                ].join(':'),
                time,
            });
        });
        const trackGain = el.mul(
            track.gain ?? 1,
            el.sub(1, el.mul(track.pumpDepth ?? 0, pumpLevel)),
        );

        return {
            output: mapStereo(sumStereo(slots), (side) => el.mul(trackGain, side)),
            track,
        };
    });
    /** Dedupes tracks rather than bus keys: `removeDuplicates` treats a falsy entry as unseen. */
    const buses = removeDuplicates(score.tracks, (track) => track.bus).map(({bus: busKey}) => {
        const bus = busKey == undefined ? undefined : score.buses?.[busKey];
        const summed = sumStereo(
            tracks.filter(({track}) => track.bus === busKey).map(({output}) => output),
        );

        return mapStereo(summed, (side) => {
            return el.mul(
                bus?.gain ?? 1,
                normalizedTanh({
                    drive: bus?.drive ?? 0,
                    input: side,
                }),
            );
        });
    });

    function sendTo(getAmount: (track: SynthTrack) => number | undefined) {
        return sumStereo(
            tracks.flatMap(({output, track}) => {
                const amount = getAmount(track);

                return amount
                    ? [
                          mapStereo(output, (side) => el.mul(amount, side)),
                      ]
                    : [];
            }),
        );
    }

    const delayed = score.delay
        ? createPingPongDelay({
              delay: score.delay,
              input: sendTo((track) => track.delaySend),
              name: `${name}:delay`,
              sampleRate,
          })
        : undefined;
    const reverbInput = sendTo((track) => track.reverbSend);
    const reverberated = score.reverb
        ? createReverb({
              /** Repeats get a little room too, so they sit behind the dry signal. */
              input: delayed
                  ? sumStereo([
                        reverbInput,
                        mapStereo(delayed, (side) => el.mul(0.3, side)),
                    ])
                  : reverbInput,
              name: `${name}:reverb`,
              reverb: score.reverb,
              sampleRate,
          })
        : undefined;
    const master = score.master || {};
    const mixed = mapStereo(
        sumStereo([
            ...buses,
            ...(delayed
                ? [
                      delayed,
                  ]
                : []),
            ...(reverberated
                ? [
                      reverberated,
                  ]
                : []),
        ]),
        (side) => {
            return el.mul(
                dbToGain(master.gainDb ?? 0),
                highpassOnePole({
                    hz: master.highpassHz ?? 20,
                    input: side,
                    sampleRate,
                }),
            );
        },
    );
    const limited = createLimiter({
        input: mixed,
        master,
        sampleRate,
    });

    return [
        limited.left,
        limited.right,
    ] as const;
}
