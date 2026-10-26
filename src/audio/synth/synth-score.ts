// cspell:word sidechain
import {removeDuplicates, type PartialWithUndefined} from '@augment-vir/common';
import {getNoteLengthSeconds, renderNote} from './render-note.js';
import {
    applyDrive,
    applyHighpass,
    applyPingPongDelay,
    applyReverb,
    createStereoBuffer,
    mixInto,
    type StereoBuffer,
    type SynthDelay,
    type SynthReverb,
} from './synth-effects.js';
import {applyMasterGain, type SynthMaster} from './synth-master.js';
import {hashSeed} from './synth-math.js';
import {type SynthNote, type SynthPatch} from './synth-patch.js';

/** Every note on one patch, and how the track sits in the mix. */
export type SynthTrack = Readonly<
    {
        patch: SynthPatch;
        notes: ReadonlyArray<SynthNote>;
    } & PartialWithUndefined<{
        /** Defaults to `1`. */
        gain: number;
        /** A key of the score's `buses`. Tracks without one go straight to the master. */
        bus: string;
        reverbSend: number;
        delaySend: number;
        /** How deep the score's pump ducks this track, from `0` to `1`. */
        pumpDepth: number;
    }>
>;

/** Processing shared by every track sent to it. */
export type SynthBus = Readonly<
    PartialWithUndefined<{
        /** See `normalizedTanh`. Clipping a drum bus is what makes it dense and loud. */
        drive: number;
        /** Defaults to `1`. Applied after `drive`. */
        gain: number;
    }>
>;

/**
 * A sidechain-style duck triggered at fixed times, usually the kick's. The duck is instant, holds,
 * then recovers exponentially.
 */
export type SynthPump = Readonly<
    {
        triggerSeconds: ReadonlyArray<number>;
        holdSeconds: number;
        /** Time constant for the recovery. */
        releaseSeconds: number;
    } & PartialWithUndefined<{
        /** Ramp into the duck, to keep it click free. Defaults to 4 ms. */
        attackSeconds: number;
    }>
>;

/** Everything needed to render a piece of audio: a song, a song layer, or a sound effect. */
export type SynthScore = Readonly<
    {
        durationSeconds: number;
        tracks: ReadonlyArray<SynthTrack>;
        /**
         * A looped score's notes and effect tails that run past the end wrap around to the start,
         * so playing the result on repeat has no seam. A score that isn't looped keeps its tails
         * and ends once they're silent.
         */
        isLooped: boolean;
    } & PartialWithUndefined<{
        buses: Readonly<Record<string, SynthBus>>;
        pump: SynthPump;
        reverb: SynthReverb;
        delay: SynthDelay;
        master: SynthMaster;
        /** Keeps notes from sounding the same as another score's. */
        seed: string;
        /** Extra time to render effect tails, in seconds. Defaults to 4. */
        tailSeconds: number;
    }>
>;

export type RenderedAudio = {
    sampleRate: number;
    channels: [
        Float32Array<ArrayBuffer>,
        Float32Array<ArrayBuffer>,
    ];
};

/**
 * How far the pump is ducking at each sample, from `0` (not at all) to `1` (fully). With
 * `loopSeconds`, every trigger repeats once a loop later, for audio that runs past the loop's end.
 */
function renderPumpLevels({
    length,
    loopSeconds,
    pump,
    sampleRate,
}: Readonly<{
    length: number;
    loopSeconds: number | undefined;
    pump: SynthPump;
    sampleRate: number;
}>) {
    const levels = new Float32Array(length);
    const triggers = [
        ...pump.triggerSeconds,
        ...(loopSeconds == undefined
            ? []
            : pump.triggerSeconds.map((seconds) => seconds + loopSeconds)),
    ]
        .map((seconds) => Math.round(seconds * sampleRate))
        .toSorted((first, second) => first - second);
    const attackSamples = Math.max(1, Math.round((pump.attackSeconds ?? 0.004) * sampleRate));
    const holdSamples = Math.round(pump.holdSeconds * sampleRate);
    const releaseCoefficient = Math.exp(-1 / (pump.releaseSeconds * sampleRate));
    let triggerIndex = 0;
    let lastTrigger = -Infinity;
    let level = 0;

    for (let index = 0; index < length; index++) {
        while ((triggers[triggerIndex] ?? Infinity) <= index) {
            lastTrigger = triggers[triggerIndex] ?? lastTrigger;
            triggerIndex++;
        }

        const sinceTrigger = index - lastTrigger;

        if (sinceTrigger < attackSamples) {
            level = Math.max(level, sinceTrigger / attackSamples);
        } else if (sinceTrigger >= attackSamples + holdSamples) {
            level *= releaseCoefficient;
        } else {
            level = 1;
        }

        levels[index] = level;
    }

    return levels;
}

/** Folds everything after `loopLength` back onto the start, then drops it. */
function foldLoop({buffer, loopLength}: Readonly<{buffer: StereoBuffer; loopLength: number}>) {
    const folded = createStereoBuffer(loopLength);

    mixInto({
        gain: 1,
        offset: 0,
        source: buffer,
        target: folded,
        wrapLength: loopLength,
    });

    return folded;
}

function trimSilence(buffer: StereoBuffer) {
    const threshold = 1e-4;
    const lastAudible = buffer.left.findLastIndex((sample, index) => {
        return Math.abs(sample) > threshold || Math.abs(buffer.right[index] ?? 0) > threshold;
    });
    const length = Math.max(1, lastAudible + 1);

    return {
        left: buffer.left.slice(0, length),
        right: buffer.right.slice(0, length),
    };
}

/**
 * Renders a score to stereo audio. Tracks are rendered a bus at a time and folded into the master
 * so memory stays at a few buffers no matter how many tracks there are.
 */
export function renderScore({
    sampleRate,
    score,
}: Readonly<{
    sampleRate: number;
    score: SynthScore;
}>): RenderedAudio {
    const loopLength = Math.round(score.durationSeconds * sampleRate);
    const lastNoteEndSeconds = Math.max(
        score.durationSeconds,
        ...score.tracks.flatMap((track) => {
            return track.notes.map((note) => {
                return (
                    note.startSeconds +
                    getNoteLengthSeconds({
                        note,
                        patch: track.patch,
                    })
                );
            });
        }),
    );
    const workLength = Math.ceil((lastNoteEndSeconds + (score.tailSeconds ?? 4)) * sampleRate) + 1;
    const outputLength = score.isLooped ? loopLength : workLength;
    const master = createStereoBuffer(outputLength);
    const hasReverb = !!score.reverb && score.tracks.some((track) => track.reverbSend);
    const hasDelay = !!score.delay && score.tracks.some((track) => track.delaySend);
    const reverbSend = hasReverb ? createStereoBuffer(workLength) : undefined;
    const delaySend = hasDelay ? createStereoBuffer(workLength) : undefined;
    const pumpLevels = score.pump
        ? renderPumpLevels({
              length: workLength,
              loopSeconds: score.isLooped ? score.durationSeconds : undefined,
              pump: score.pump,
              sampleRate,
          })
        : undefined;
    /**
     * Dedupes tracks rather than bus keys: `removeDuplicates` treats a falsy entry as unseen, so a
     * list of keys would keep every `undefined` and mix each track without a bus once per such
     * track.
     */
    const busKeys = removeDuplicates(score.tracks, (track) => track.bus).map((track) => track.bus);

    function finishInto(buffer: StereoBuffer, process?: (folded: StereoBuffer) => void) {
        const finished = score.isLooped
            ? foldLoop({
                  buffer,
                  loopLength,
              })
            : buffer;

        process?.(finished);
        mixInto({
            gain: 1,
            offset: 0,
            source: finished,
            target: master,
        });
    }

    busKeys.forEach((busKey) => {
        const busBuffer = createStereoBuffer(workLength);
        const bus = busKey == undefined ? undefined : score.buses?.[busKey];

        score.tracks.forEach((track, trackIndex) => {
            if (track.bus !== busKey) {
                return;
            }

            track.notes.forEach((note, noteIndex) => {
                const offset = Math.round(note.startSeconds * sampleRate);
                const rendered = renderNote({
                    note,
                    patch: track.patch,
                    sampleRate,
                    seed: hashSeed(score.seed || '', trackIndex, noteIndex),
                });
                const pumpDepth = track.pumpDepth ?? 0;
                const trackGain = track.gain ?? 1;

                if (pumpLevels && pumpDepth) {
                    for (let index = 0; index < rendered.left.length; index++) {
                        const gain = 1 - pumpDepth * (pumpLevels[offset + index] ?? 0);

                        rendered.left[index] = (rendered.left[index] ?? 0) * gain;
                        rendered.right[index] = (rendered.right[index] ?? 0) * gain;
                    }
                }

                const sends = [
                    {
                        amount: 1,
                        target: busBuffer,
                    },
                    {
                        amount: track.reverbSend ?? 0,
                        target: reverbSend,
                    },
                    {
                        amount: track.delaySend ?? 0,
                        target: delaySend,
                    },
                ];

                sends.forEach(({amount, target}) => {
                    if (!target || !amount) {
                        return;
                    }

                    mixInto({
                        gain: trackGain * amount,
                        offset,
                        source: rendered,
                        target,
                    });
                });
            });
        });

        finishInto(busBuffer, (folded) => {
            if (bus?.drive) {
                applyDrive({
                    buffer: folded,
                    drive: bus.drive,
                });
            }

            const busGain = bus?.gain ?? 1;

            if (busGain !== 1) {
                [
                    folded.left,
                    folded.right,
                ].forEach((channel) => {
                    channel.forEach((sample, index) => {
                        channel[index] = sample * busGain;
                    });
                });
            }
        });
    });

    if (delaySend && score.delay) {
        applyPingPongDelay({
            buffer: delaySend,
            delay: score.delay,
            sampleRate,
        });

        if (reverbSend) {
            /** Repeats get a little room too, so they sit behind the dry signal. */
            mixInto({
                gain: 0.3,
                offset: 0,
                source: delaySend,
                target: reverbSend,
            });
        }

        finishInto(delaySend);
    }

    if (reverbSend && score.reverb) {
        applyReverb({
            buffer: reverbSend,
            reverb: score.reverb,
            sampleRate,
        });
        finishInto(reverbSend);
    }

    applyHighpass({
        buffer: master,
        hz: score.master?.highpassHz ?? 20,
        isLooped: score.isLooped,
        sampleRate,
    });
    applyMasterGain({
        buffer: master,
        isLooped: score.isLooped,
        master: score.master || {},
        sampleRate,
    });

    const output = score.isLooped ? master : trimSilence(master);

    return {
        channels: [
            output.left,
            output.right,
        ],
        sampleRate,
    };
}
