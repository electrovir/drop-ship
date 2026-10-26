// cspell:word lufs
import {assert} from '@augment-vir/assert';
import {awaitedForEach, createArray} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import OfflineRenderer from '@elemaudio/offline-renderer';
import {measureLoudness} from '../synth/synth-master.js';
import {StageKind, Waveform, type SynthPatch} from '../synth/synth-patch.js';
import {renderScore, type SynthScore} from '../synth/synth-score.js';
import {buildScoreGraph} from './score-graph.js';

const sampleRate = 22_050;
const blockSize = 128;

async function renderGraph({seconds, score}: Readonly<{seconds: number; score: SynthScore}>) {
    const renderer = new OfflineRenderer();

    await renderer.initialize({
        blockSize,
        numInputChannels: 0,
        numOutputChannels: 2,
        sampleRate,
    });
    await renderer.render(
        ...buildScoreGraph({
            name: 'test',
            sampleRate,
            score,
        }),
    );

    const blocks = createArray(Math.ceil((seconds * sampleRate) / blockSize), () => {
        const block = {
            left: new Float32Array(blockSize),
            right: new Float32Array(blockSize),
        };

        renderer.process(
            [],
            [
                block.left,
                block.right,
            ],
        );

        return block;
    });

    return {
        left: Float32Array.from(blocks.flatMap((block) => [...block.left])),
        right: Float32Array.from(blocks.flatMap((block) => [...block.right])),
    };
}

const basePatch: SynthPatch = {
    amp: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.7,
        release: 0.1,
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                },
            ],
        },
    ],
};

/** Exercises every patch and score feature the graph builds. */
const fullScore: SynthScore = {
    buses: {
        drums: {
            drive: 2,
            gain: 0.8,
        },
    },
    delay: {
        feedback: 0.4,
        seconds: 0.18,
    },
    durationSeconds: 2,
    isLooped: true,
    master: {
        gainDb: -6,
        limiter: {
            ceilingDb: -2,
        },
    },
    pump: {
        holdSeconds: 0.02,
        releaseSeconds: 0.1,
        triggerSeconds: [
            0,
            0.5,
            1,
            1.5,
        ],
    },
    reverb: {
        seconds: 1.2,
    },
    seed: 'test',
    tracks: [
        {
            bus: 'drums',
            notes: createArray(4, (index) => {
                return {
                    durationSeconds: 0.1,
                    midi: 36,
                    startSeconds: index * 0.5,
                    velocity: index % 2 ? 0.6 : 1,
                };
            }),
            patch: {
                amp: {
                    attack: 0.001,
                    decay: 0.15,
                    sustain: 0,
                    release: 0.05,
                },
                envelopes: {
                    pitch: {
                        attack: 0.001,
                        decay: 0.03,
                        sustain: 0,
                        release: 0.03,
                    },
                },
                layers: [
                    {
                        oscillators: [
                            {
                                fixedHz: {
                                    base: 50,
                                    envelope: 'pitch',
                                    envelopeAmount: 150,
                                    isSquared: true,
                                    keyTrack: 0.5,
                                    velocityAmount: 10,
                                },
                                wave: Waveform.Sine,
                            },
                        ],
                    },
                    {
                        ampEnvelope: 'pitch',
                        gain: 0.3,
                        oscillators: [
                            {
                                wave: Waveform.Noise,
                            },
                        ],
                        stages: [
                            {
                                frequency: 3000,
                                kind: StageKind.Bandpass,
                                q: 2,
                            },
                        ],
                    },
                ],
            },
            reverbSend: 0.1,
        },
        {
            delaySend: 0.3,
            gain: 0.5,
            notes: [
                {
                    durationSeconds: 0.6,
                    midi: 60,
                    pan: -0.5,
                    pitchSteps: [
                        {
                            atSeconds: 0.3,
                            midi: 62,
                        },
                    ],
                    startSeconds: 0,
                },
                {
                    durationSeconds: 0.6,
                    midi: 67,
                    pan: 0.5,
                    pitchSteps: [
                        {
                            atSeconds: 0,
                            midi: 66,
                        },
                    ],
                    startSeconds: 1,
                    velocity: 0.8,
                },
            ],
            patch: {
                ...basePatch,
                envelopes: {
                    filter: {
                        attack: 0.01,
                        decay: 0.2,
                        sustain: 0.2,
                        release: 0.1,
                    },
                },
                glideSeconds: 0.02,
                layers: [
                    {
                        oscillators: [
                            {
                                pan: -0.4,
                                wave: Waveform.Saw,
                            },
                            {
                                detuneCents: 7,
                                pan: 0.4,
                                pulseWidth: 0.3,
                                wave: Waveform.Square,
                            },
                            {
                                gain: 0.5,
                                ratio: 0.5,
                                wave: Waveform.Square,
                            },
                        ],
                        stages: [
                            {
                                frequency: {
                                    base: 800,
                                    envelope: 'filter',
                                    envelopeAmount: 2000,
                                },
                                isFourPole: true,
                                kind: StageKind.Lowpass,
                                q: 1.5,
                            },
                            {
                                frequency: 80,
                                kind: StageKind.Highpass,
                            },
                            {
                                amount: 1.5,
                                kind: StageKind.Drive,
                            },
                            {
                                amount: {
                                    base: 0.8,
                                    velocityAmount: 0.2,
                                },
                                kind: StageKind.Gain,
                            },
                        ],
                    },
                    {
                        gain: 0.4,
                        oscillators: [
                            {
                                fm: {
                                    depthHz: 200,
                                    ratio: 2,
                                },
                                wave: Waveform.Triangle,
                            },
                        ],
                        stages: [
                            {
                                amount: 0.5,
                                kind: StageKind.Gain,
                            },
                        ],
                    },
                ],
                pitchEnvelope: {
                    envelope: 'filter',
                    semitones: 0.5,
                },
                velocityToGain: 0.5,
                vibrato: {
                    cents: 20,
                    rateHz: 5,
                },
            },
            pumpDepth: 0.5,
            reverbSend: 0.3,
        },
        {
            gain: 0.2,
            /** More overlapping notes than a track has voices. */
            notes: createArray(12, (index) => {
                return {
                    durationSeconds: 1.5,
                    midi: 48 + index,
                    startSeconds: index * 0.1,
                };
            }),
            patch: basePatch,
        },
        {
            notes: [],
            patch: basePatch,
        },
    ],
};

/** A score with no effects or master settings. */
const bareScore: SynthScore = {
    durationSeconds: 1,
    isLooped: true,
    tracks: [
        {
            notes: [
                {
                    durationSeconds: 0.5,
                    midi: 57,
                    startSeconds: 0.25,
                    velocity: 0.5,
                },
            ],
            patch: basePatch,
        },
    ],
};

describe(buildScoreGraph.name, () => {
    it('plays as loud as the pre-rendered score once it has looped, under the ceiling', async () => {
        await awaitedForEach(
            [
                fullScore,
                bareScore,
                {
                    ...bareScore,
                    pump: {
                        holdSeconds: 0,
                        releaseSeconds: 0.1,
                        triggerSeconds: [],
                    },
                    reverb: {
                        seconds: 0.5,
                    },
                },
            ],
            async (score) => {
                const live = await renderGraph({
                    score,
                    seconds: score.durationSeconds * 2,
                });
                const [
                    left,
                    right,
                ] = renderScore({
                    sampleRate,
                    score,
                }).channels;
                const loopLength = score.durationSeconds * sampleRate;

                assert.isApproximately(
                    measureLoudness({
                        buffer: {
                            left: live.left.slice(loopLength, loopLength * 2),
                            right: live.right.slice(loopLength, loopLength * 2),
                        },
                        sampleRate,
                    }),
                    measureLoudness({
                        buffer: {
                            left,
                            right,
                        },
                        sampleRate,
                    }),
                    1.5,
                );
                assert.isBelow(
                    [
                        ...live.left,
                        ...live.right,
                    ].reduce((peak, sample) => Math.max(peak, Math.abs(sample)), 0),
                    0.8,
                );
            },
        );
    });

    it('rejects a patch that refers to a missing envelope', () => {
        [
            {
                ...basePatch,
                layers: [
                    {
                        ampEnvelope: 'missing',
                        oscillators: [],
                    },
                ],
            },
            {
                ...basePatch,
                pitchEnvelope: {
                    envelope: 'missing',
                    semitones: 1,
                },
            },
            {
                ...basePatch,
                layers: [
                    {
                        oscillators: [
                            {
                                fm: {
                                    depthHz: {
                                        base: 1,
                                        envelope: 'missing',
                                        envelopeAmount: 1,
                                    },
                                    ratio: 1,
                                },
                                wave: Waveform.Sine,
                            },
                        ],
                    },
                ],
            },
        ].forEach((patch) => {
            assert.throws(
                () => {
                    return buildScoreGraph({
                        name: 'test',
                        sampleRate,
                        score: {
                            durationSeconds: 1,
                            isLooped: true,
                            tracks: [
                                {
                                    notes: [
                                        {
                                            durationSeconds: 0.5,
                                            midi: 60,
                                            startSeconds: 0,
                                        },
                                    ],
                                    patch,
                                },
                            ],
                        },
                    });
                },
                {
                    matchMessage: 'missing',
                },
            );
        });
    });
});
