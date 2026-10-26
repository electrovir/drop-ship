// cspell:word lufs predelay
import {type PartialWithUndefined} from '@augment-vir/common';
import {SoundEffect} from './sound-effect.js';
import {type SynthReverb} from './synth/synth-effects.js';
import {StageKind, Waveform, type SynthNote, type SynthPatch} from './synth/synth-patch.js';
import {type SynthScore, type SynthTrack} from './synth/synth-score.js';

/** Each variant of an effect is shifted by these semitones so repeats don't sound identical. */
const variantSemitones = [
    0,
    1,
    -1,
    2,
];

function getVariantOffset(variant: number) {
    return variantSemitones[variant % variantSemitones.length] ?? 0;
}

function createNote({
    durationSeconds,
    midi,
    startSeconds = 0,
    ...rest
}: Readonly<
    {
        midi: number;
        durationSeconds: number;
    } & PartialWithUndefined<Omit<SynthNote, 'midi' | 'durationSeconds'>>
>): SynthNote {
    return {
        ...rest,
        durationSeconds,
        midi,
        startSeconds,
    };
}

function createOneShot({
    reverb,
    seed,
    targetLufs,
    tracks,
}: Readonly<{
    seed: string;
    targetLufs: number;
    tracks: ReadonlyArray<SynthTrack>;
    reverb?: SynthReverb | undefined;
}>): SynthScore {
    return {
        durationSeconds: 0,
        isLooped: false,
        master: {
            highpassHz: 30,
            targetLufs,
        },
        reverb,
        seed,
        tailSeconds: reverb ? reverb.seconds : 0.05,
        tracks,
    };
}

function createLaserPatch({
    decay,
    pulseWidth,
    sweepSemitones,
}: Readonly<{
    decay: number;
    pulseWidth: number;
    sweepSemitones: number;
}>): SynthPatch {
    return {
        amp: {
            attack: 0.0005,
            decay,
            sustain: 0,
            release: 0.02,
        },
        envelopes: {
            pitch: {
                attack: 0,
                decay: decay * 0.55,
                sustain: 0,
                release: 0.01,
            },
            click: {
                attack: 0.0003,
                decay: 0.006,
                sustain: 0,
                release: 0.004,
            },
        },
        pitchEnvelope: {
            envelope: 'pitch',
            semitones: sweepSemitones,
        },
        layers: [
            {
                oscillators: [
                    {
                        wave: Waveform.Square,
                        pulseWidth,
                    },
                    {
                        wave: Waveform.Saw,
                        detuneCents: 9,
                        gain: 0.6,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Highpass,
                        frequency: 300,
                    },
                    {
                        kind: StageKind.Lowpass,
                        frequency: {
                            base: 1500,
                            envelope: 'pitch',
                            envelopeAmount: 6000,
                        },
                    },
                ],
            },
            {
                ampEnvelope: 'click',
                gain: 0.3,
                oscillators: [
                    {
                        wave: Waveform.Noise,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Highpass,
                        frequency: 4000,
                    },
                ],
            },
        ],
    };
}

/**
 * Filtered noise for the blast, a falling sine for the thump, and a short crackle on top. `scale`
 * stretches every stage, so bigger explosions ring longer and lower.
 */
function createExplosionPatch(scale: number): SynthPatch {
    return {
        amp: {
            attack: 0.001,
            decay: 0.16 * scale,
            sustain: 0,
            release: 0.1 * scale,
        },
        envelopes: {
            sweep: {
                attack: 0,
                decay: 0.09 * scale,
                sustain: 0,
                release: 0.05,
            },
            thump: {
                attack: 0,
                decay: 0.05 * scale,
                sustain: 0,
                release: 0.03,
            },
            thumpAmp: {
                attack: 0.001,
                decay: 0.09 * scale,
                sustain: 0,
                release: 0.05,
            },
            crackle: {
                attack: 0.001,
                decay: 0.04 * scale,
                sustain: 0,
                release: 0.02,
            },
        },
        layers: [
            {
                oscillators: [
                    {
                        wave: Waveform.Noise,
                        pan: -0.35,
                    },
                    {
                        wave: Waveform.Noise,
                        pan: 0.35,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Lowpass,
                        frequency: {
                            base: 250 / scale,
                            envelope: 'sweep',
                            envelopeAmount: 5000,
                            isSquared: true,
                            keyTrack: 1,
                        },
                        q: 0.9,
                    },
                    {
                        kind: StageKind.Drive,
                        amount: 2.2,
                    },
                ],
            },
            {
                ampEnvelope: 'thumpAmp',
                gain: 0.9,
                oscillators: [
                    {
                        wave: Waveform.Sine,
                        fixedHz: {
                            base: 48 / Math.sqrt(scale),
                            envelope: 'thump',
                            envelopeAmount: 150,
                            keyTrack: 1,
                        },
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Drive,
                        amount: 1.6,
                    },
                ],
            },
            {
                ampEnvelope: 'crackle',
                gain: 0.25,
                oscillators: [
                    {
                        wave: Waveform.Noise,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Highpass,
                        frequency: 3000,
                    },
                    {
                        kind: StageKind.Drive,
                        amount: 4,
                    },
                ],
            },
        ],
    };
}

/** Short and bright, for UI blips and fanfare notes. */
const pluckPatch: SynthPatch = {
    amp: {
        attack: 0.001,
        decay: 0.12,
        sustain: 0,
        release: 0.08,
    },
    envelopes: {
        filter: {
            attack: 0.001,
            decay: 0.05,
            sustain: 0,
            release: 0.04,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Square,
                    pulseWidth: 0.3,
                    detuneCents: -5,
                    pan: -0.25,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: 5,
                    pan: 0.25,
                },
            ],
            stages: [
                {
                    kind: StageKind.Highpass,
                    frequency: 250,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 900,
                        envelope: 'filter',
                        envelopeAmount: 4500,
                        keyTrack: 0.5,
                    },
                    q: 1.3,
                },
            ],
        },
    ],
};

const blipPatch: SynthPatch = {
    amp: {
        attack: 0.0008,
        decay: 0.025,
        sustain: 0,
        release: 0.02,
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                },
                {
                    wave: Waveform.Triangle,
                    ratio: 2,
                    gain: 0.2,
                },
            ],
        },
    ],
};

/** A glassy FM bell. */
const bellPatch: SynthPatch = {
    amp: {
        attack: 0.001,
        decay: 0.35,
        sustain: 0,
        release: 0.25,
    },
    envelopes: {
        index: {
            attack: 0.001,
            decay: 0.06,
            sustain: 0.1,
            release: 0.1,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                    fm: {
                        ratio: 3.5,
                        depthHz: {
                            base: 60,
                            envelope: 'index',
                            envelopeAmount: 1200,
                        },
                    },
                },
            ],
            stages: [
                {
                    kind: StageKind.Highpass,
                    frequency: 600,
                },
            ],
        },
    ],
};

const softPadPatch: SynthPatch = {
    amp: {
        attack: 0.05,
        decay: 0.4,
        sustain: 0.6,
        release: 0.35,
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -10,
                    pan: -0.7,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: 10,
                    pan: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 700,
                        envelope: 'amp',
                        envelopeAmount: 1200,
                    },
                },
            ],
        },
    ],
};

const thumpPatch: SynthPatch = {
    amp: {
        attack: 0.0005,
        decay: 0.08,
        sustain: 0,
        release: 0.04,
    },
    envelopes: {
        pitch: {
            attack: 0,
            decay: 0.025,
            sustain: 0,
            release: 0.01,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                    fixedHz: {
                        base: 85,
                        envelope: 'pitch',
                        envelopeAmount: 170,
                        keyTrack: 1,
                    },
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.5,
                },
            ],
        },
    ],
};

/** Inharmonic square partials through a bandpass: hit metal. */
function createClangPatch({decay, hz}: Readonly<{decay: number; hz: number}>): SynthPatch {
    return {
        amp: {
            attack: 0.0005,
            decay,
            sustain: 0,
            release: decay / 2,
        },
        envelopes: {
            noise: {
                attack: 0.0005,
                decay: 0.02,
                sustain: 0,
                release: 0.01,
            },
        },
        layers: [
            {
                oscillators: [
                    1,
                    1.535,
                    2.457,
                ].map((ratio, index) => {
                    return {
                        wave: Waveform.Square,
                        fixedHz: {
                            base: hz * ratio,
                            keyTrack: 1,
                        },
                        gain: 1 / (index + 1),
                    };
                }),
                stages: [
                    {
                        kind: StageKind.Bandpass,
                        frequency: {
                            base: hz * 3,
                            keyTrack: 1,
                        },
                        q: 1.2,
                    },
                ],
            },
            {
                ampEnvelope: 'noise',
                gain: 0.5,
                oscillators: [
                    {
                        wave: Waveform.Noise,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Bandpass,
                        frequency: 2500,
                        q: 0.8,
                    },
                ],
            },
        ],
    };
}

/** White noise swept through a bandpass by an envelope that rises over `seconds`. */
function createWhooshPatch(seconds: number): SynthPatch {
    return {
        amp: {
            attack: seconds,
            decay: 0.04,
            sustain: 0,
            release: 0.03,
        },
        layers: [
            {
                oscillators: [
                    {
                        wave: Waveform.Noise,
                        pan: -0.4,
                    },
                    {
                        wave: Waveform.Noise,
                        pan: 0.4,
                    },
                ],
                stages: [
                    {
                        kind: StageKind.Bandpass,
                        frequency: {
                            base: 400,
                            envelope: 'amp',
                            envelopeAmount: 5000,
                            isSquared: true,
                        },
                        q: 2,
                    },
                ],
            },
        ],
    };
}

/** A saw that glides between the pitches of its note's `pitchSteps`. */
const sweepPatch: SynthPatch = {
    amp: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.7,
        release: 0.08,
    },
    glideSeconds: 0.2,
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -8,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: 8,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 300,
                        keyTrack: 1,
                    },
                    q: 2,
                },
            ],
        },
    ],
};

const shortRoom: SynthReverb = {
    seconds: 0.7,
    size: 0.6,
};
const hall: SynthReverb = {
    seconds: 2.2,
    predelaySeconds: 0.015,
};

/** Plays `pitches` one after another on `patch`, `stepSeconds` apart. */
function createRun({
    durationSeconds,
    patch,
    pitches,
    startSeconds = 0,
    stepSeconds,
    velocity,
}: Readonly<{
    patch: SynthPatch;
    pitches: ReadonlyArray<number>;
    stepSeconds: number;
    durationSeconds: number;
    startSeconds?: number | undefined;
    velocity?: number | undefined;
}>) {
    return {
        notes: pitches.map((midi, index) => {
            return createNote({
                durationSeconds,
                midi,
                startSeconds: startSeconds + index * stepSeconds,
                velocity,
            });
        }),
        patch,
    };
}

function createChord({
    durationSeconds,
    pitches,
    startSeconds,
}: Readonly<{
    pitches: ReadonlyArray<number>;
    startSeconds: number;
    durationSeconds: number;
}>) {
    return pitches.map((midi) => {
        return createNote({
            durationSeconds,
            midi,
            startSeconds,
        });
    });
}

/** Builds the score for one variant of each sound effect. */
export const soundEffectScores: Readonly<Record<SoundEffect, (variant: number) => SynthScore>> = {
    [SoundEffect.GunShot](variant) {
        return createOneShot({
            seed: `${SoundEffect.GunShot}${variant}`,
            targetLufs: -27,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.03,
                            midi: 79 + getVariantOffset(variant),
                        }),
                    ],
                    patch: createLaserPatch({
                        decay: 0.045,
                        pulseWidth: 0.3,
                        sweepSemitones: 19,
                    }),
                },
            ],
        });
    },
    [SoundEffect.RapidGunShot](variant) {
        return createOneShot({
            seed: `${SoundEffect.RapidGunShot}${variant}`,
            targetLufs: -29,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 86 + getVariantOffset(variant),
                        }),
                    ],
                    patch: createLaserPatch({
                        decay: 0.028,
                        pulseWidth: 0.2,
                        sweepSemitones: 12,
                    }),
                },
            ],
        });
    },
    [SoundEffect.SpreadGunShot](variant) {
        const offset = getVariantOffset(variant);

        return createOneShot({
            seed: `${SoundEffect.SpreadGunShot}${variant}`,
            targetLufs: -26,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.04,
                            midi: 62 + offset,
                        }),
                    ],
                    patch: createLaserPatch({
                        decay: 0.06,
                        pulseWidth: 0.45,
                        sweepSemitones: 24,
                    }),
                },
                {
                    gain: 0.5,
                    notes: [
                        createNote({
                            durationSeconds: 0.01,
                            midi: 72 + offset,
                        }),
                    ],
                    patch: createExplosionPatch(0.35),
                },
            ],
        });
    },
    [SoundEffect.EnemyShot](variant) {
        return createOneShot({
            seed: `${SoundEffect.EnemyShot}${variant}`,
            targetLufs: -27,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.05,
                            midi: 67 + getVariantOffset(variant),
                        }),
                    ],
                    patch: {
                        amp: {
                            attack: 0.002,
                            decay: 0.09,
                            sustain: 0,
                            release: 0.04,
                        },
                        envelopes: {
                            pitch: {
                                attack: 0,
                                decay: 0.07,
                                sustain: 0,
                                release: 0.02,
                            },
                        },
                        pitchEnvelope: {
                            envelope: 'pitch',
                            semitones: 12,
                        },
                        layers: [
                            {
                                oscillators: [
                                    {
                                        wave: Waveform.Triangle,
                                        fm: {
                                            ratio: 2,
                                            depthHz: {
                                                base: 40,
                                                envelope: 'pitch',
                                                envelopeAmount: 500,
                                            },
                                        },
                                    },
                                    {
                                        wave: Waveform.Square,
                                        ratio: 0.5,
                                        gain: 0.25,
                                    },
                                ],
                                stages: [
                                    {
                                        kind: StageKind.Lowpass,
                                        frequency: 3200,
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        });
    },
    [SoundEffect.EnemyHit](variant) {
        return createOneShot({
            seed: `${SoundEffect.EnemyHit}${variant}`,
            targetLufs: -29,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.01,
                            midi: 60 + getVariantOffset(variant),
                        }),
                    ],
                    patch: createClangPatch({
                        decay: 0.022,
                        hz: 1250,
                    }),
                },
            ],
        });
    },
    [SoundEffect.EnemyDestroyed](variant) {
        return createOneShot({
            reverb: shortRoom,
            seed: `${SoundEffect.EnemyDestroyed}${variant}`,
            targetLufs: -20,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 60 + getVariantOffset(variant) * 2,
                        }),
                    ],
                    patch: createExplosionPatch(1),
                    reverbSend: 0.15,
                },
            ],
        });
    },
    [SoundEffect.LargeEnemyDestroyed](variant) {
        const offset = getVariantOffset(variant);

        return createOneShot({
            reverb: hall,
            seed: `${SoundEffect.LargeEnemyDestroyed}${variant}`,
            targetLufs: -18,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.05,
                            midi: 55 + offset,
                        }),
                        createNote({
                            durationSeconds: 0.02,
                            midi: 62 + offset,
                            pan: 0.4,
                            startSeconds: 0.09,
                            velocity: 0.7,
                        }),
                    ],
                    patch: createExplosionPatch(2.2),
                    reverbSend: 0.2,
                },
            ],
        });
    },
    [SoundEffect.BossDestroyed]() {
        return createOneShot({
            reverb: {
                ...hall,
                seconds: 3,
            },
            seed: SoundEffect.BossDestroyed,
            targetLufs: -15,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.2,
                            midi: 50,
                        }),
                    ],
                    patch: createExplosionPatch(4),
                    reverbSend: 0.25,
                },
                {
                    gain: 0.8,
                    notes: [
                        0.16,
                        0.38,
                        0.55,
                        0.8,
                    ].map((startSeconds, index) => {
                        return createNote({
                            durationSeconds: 0.03,
                            midi: 58 + index * 2,
                            pan: index % 2 ? 0.5 : -0.5,
                            startSeconds,
                            velocity: 1 - index * 0.15,
                        });
                    }),
                    patch: createExplosionPatch(1.8),
                    reverbSend: 0.3,
                },
            ],
        });
    },
    [SoundEffect.BossWarning]() {
        const pulseSeconds = 0.17;

        return createOneShot({
            reverb: hall,
            seed: SoundEffect.BossWarning,
            targetLufs: -19,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: pulseSeconds * 0.85,
                        patch: {
                            amp: {
                                attack: 0.005,
                                decay: 0.2,
                                sustain: 0.8,
                                release: 0.03,
                            },
                            layers: [
                                {
                                    oscillators: [
                                        {
                                            wave: Waveform.Square,
                                        },
                                        {
                                            wave: Waveform.Saw,
                                            detuneCents: 12,
                                            gain: 0.5,
                                        },
                                    ],
                                    stages: [
                                        {
                                            kind: StageKind.Lowpass,
                                            frequency: 2400,
                                            q: 2,
                                        },
                                    ],
                                },
                            ],
                        },
                        pitches: [
                            76,
                            71,
                            76,
                            71,
                            76,
                            71,
                        ],
                        stepSeconds: pulseSeconds,
                    }),
                    reverbSend: 0.25,
                },
                {
                    gain: 0.6,
                    notes: [
                        createNote({
                            durationSeconds: pulseSeconds * 6,
                            midi: 35,
                        }),
                    ],
                    patch: sweepPatch,
                },
            ],
        });
    },
    [SoundEffect.ShipHit](variant) {
        return createOneShot({
            reverb: shortRoom,
            seed: `${SoundEffect.ShipHit}${variant}`,
            targetLufs: -22,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 60 + getVariantOffset(variant),
                        }),
                    ],
                    patch: createClangPatch({
                        decay: 0.12,
                        hz: 330,
                    }),
                    reverbSend: 0.15,
                },
            ],
        });
    },
    [SoundEffect.ShipCellDestroyed](variant) {
        const offset = getVariantOffset(variant);

        return createOneShot({
            reverb: shortRoom,
            seed: `${SoundEffect.ShipCellDestroyed}${variant}`,
            targetLufs: -21,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 64 + offset,
                        }),
                    ],
                    patch: createExplosionPatch(0.7),
                    reverbSend: 0.1,
                },
                {
                    gain: 0.5,
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 55 + offset,
                        }),
                    ],
                    patch: createClangPatch({
                        decay: 0.08,
                        hz: 210,
                    }),
                },
            ],
        });
    },
    [SoundEffect.ShipWrecked]() {
        return createOneShot({
            reverb: hall,
            seed: SoundEffect.ShipWrecked,
            targetLufs: -17,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.1,
                            midi: 52,
                        }),
                    ],
                    patch: createExplosionPatch(2.8),
                    reverbSend: 0.25,
                },
                {
                    gain: 0.35,
                    notes: [
                        createNote({
                            durationSeconds: 0.7,
                            midi: 64,
                            pitchSteps: [
                                {
                                    atSeconds: 0.02,
                                    midi: 33,
                                },
                            ],
                        }),
                    ],
                    patch: sweepPatch,
                    reverbSend: 0.2,
                },
            ],
        });
    },
    [SoundEffect.PieceMove](variant) {
        return createOneShot({
            seed: `${SoundEffect.PieceMove}${variant}`,
            targetLufs: -28,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.01,
                            midi: 93 + getVariantOffset(variant) * 2,
                        }),
                    ],
                    patch: blipPatch,
                },
            ],
        });
    },
    [SoundEffect.PieceRotate]() {
        return createOneShot({
            seed: SoundEffect.PieceRotate,
            targetLufs: -26,
            tracks: [
                createRun({
                    durationSeconds: 0.02,
                    patch: pluckPatch,
                    pitches: [
                        81,
                        88,
                    ],
                    stepSeconds: 0.035,
                }),
            ],
        });
    },
    [SoundEffect.PieceSwap]() {
        return createOneShot({
            seed: SoundEffect.PieceSwap,
            targetLufs: -26,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.07,
                            midi: 60,
                        }),
                    ],
                    patch: createWhooshPatch(0.07),
                },
                {
                    gain: 0.6,
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 85,
                            startSeconds: 0.06,
                        }),
                    ],
                    patch: pluckPatch,
                },
            ],
        });
    },
    [SoundEffect.PiecePlace](variant) {
        return createOneShot({
            reverb: shortRoom,
            seed: `${SoundEffect.PiecePlace}${variant}`,
            targetLufs: -22,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.02,
                            midi: 60,
                        }),
                    ],
                    patch: thumpPatch,
                },
                {
                    gain: 0.7,
                    notes: [
                        createNote({
                            durationSeconds: 0.05,
                            midi: variant % 2 ? 73 : 66,
                        }),
                    ],
                    patch: pluckPatch,
                    reverbSend: 0.2,
                },
            ],
        });
    },
    [SoundEffect.Denied]() {
        return createOneShot({
            seed: SoundEffect.Denied,
            targetLufs: -25,
            tracks: [
                createRun({
                    durationSeconds: 0.06,
                    patch: {
                        amp: {
                            attack: 0.002,
                            decay: 0.06,
                            sustain: 0.6,
                            release: 0.02,
                        },
                        layers: [
                            {
                                /** A minor second apart, so the two beat against each other. */
                                oscillators: [
                                    {
                                        wave: Waveform.Square,
                                    },
                                    {
                                        wave: Waveform.Saw,
                                        ratio: 1.06,
                                        gain: 0.7,
                                    },
                                ],
                                stages: [
                                    {
                                        kind: StageKind.Lowpass,
                                        frequency: 1400,
                                    },
                                ],
                            },
                        ],
                    },
                    pitches: [
                        46,
                        46,
                    ],
                    stepSeconds: 0.09,
                }),
            ],
        });
    },
    [SoundEffect.HyperspaceJump]() {
        return createOneShot({
            reverb: hall,
            seed: SoundEffect.HyperspaceJump,
            targetLufs: -18,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.95,
                            midi: 60,
                        }),
                    ],
                    patch: createWhooshPatch(0.95),
                    reverbSend: 0.3,
                },
                {
                    gain: 0.35,
                    notes: [
                        createNote({
                            durationSeconds: 1,
                            midi: 36,
                            pitchSteps: [
                                {
                                    atSeconds: 0.3,
                                    midi: 48,
                                },
                                {
                                    atSeconds: 0.65,
                                    midi: 64,
                                },
                                {
                                    atSeconds: 0.85,
                                    midi: 76,
                                },
                            ],
                        }),
                    ],
                    patch: sweepPatch,
                    reverbSend: 0.25,
                },
            ],
        });
    },
    [SoundEffect.WaveCleared]() {
        const stepSeconds = 0.08;

        return createOneShot({
            reverb: hall,
            seed: SoundEffect.WaveCleared,
            targetLufs: -18,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: 0.06,
                        patch: pluckPatch,
                        pitches: [
                            69,
                            73,
                            76,
                            81,
                            85,
                        ],
                        stepSeconds,
                    }),
                    reverbSend: 0.3,
                },
                {
                    gain: 0.6,
                    ...createRun({
                        durationSeconds: 0.06,
                        patch: bellPatch,
                        pitches: [
                            81,
                            85,
                            88,
                            93,
                            97,
                        ],
                        stepSeconds,
                    }),
                    reverbSend: 0.35,
                },
                {
                    gain: 0.5,
                    notes: createChord({
                        durationSeconds: 0.6,
                        pitches: [
                            57,
                            61,
                            64,
                            69,
                        ],
                        startSeconds: stepSeconds * 4,
                    }),
                    patch: softPadPatch,
                    reverbSend: 0.4,
                },
            ],
        });
    },
    [SoundEffect.LifeLost]() {
        const stepSeconds = 0.17;

        return createOneShot({
            reverb: hall,
            seed: SoundEffect.LifeLost,
            targetLufs: -19,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: stepSeconds * 0.9,
                        patch: pluckPatch,
                        pitches: [
                            78,
                            74,
                            71,
                            66,
                        ],
                        stepSeconds,
                    }),
                    reverbSend: 0.35,
                },
                {
                    gain: 0.5,
                    notes: createChord({
                        durationSeconds: stepSeconds * 4,
                        pitches: [
                            50,
                            54,
                            59,
                        ],
                        startSeconds: 0,
                    }),
                    patch: softPadPatch,
                    reverbSend: 0.4,
                },
            ],
        });
    },
    [SoundEffect.GameOver]() {
        const stepSeconds = 0.3;

        return createOneShot({
            reverb: {
                ...hall,
                seconds: 3,
            },
            seed: SoundEffect.GameOver,
            targetLufs: -18,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: stepSeconds * 0.9,
                        patch: pluckPatch,
                        pitches: [
                            73,
                            71,
                            69,
                            68,
                            66,
                        ],
                        stepSeconds,
                    }),
                    reverbSend: 0.4,
                },
                {
                    gain: 0.6,
                    notes: [
                        ...createChord({
                            durationSeconds: stepSeconds * 2,
                            pitches: [
                                50,
                                57,
                                62,
                            ],
                            startSeconds: 0,
                        }),
                        ...createChord({
                            durationSeconds: stepSeconds * 2,
                            pitches: [
                                49,
                                56,
                                61,
                            ],
                            startSeconds: stepSeconds * 2,
                        }),
                        ...createChord({
                            durationSeconds: stepSeconds * 3,
                            pitches: [
                                42,
                                54,
                                57,
                                61,
                            ],
                            startSeconds: stepSeconds * 4,
                        }),
                    ],
                    patch: softPadPatch,
                    reverbSend: 0.45,
                },
            ],
        });
    },
    [SoundEffect.MenuMove]() {
        return createOneShot({
            seed: SoundEffect.MenuMove,
            targetLufs: -27,
            tracks: [
                {
                    notes: [
                        createNote({
                            durationSeconds: 0.01,
                            midi: 88,
                        }),
                    ],
                    patch: blipPatch,
                },
            ],
        });
    },
    [SoundEffect.MenuSelect]() {
        return createOneShot({
            reverb: shortRoom,
            seed: SoundEffect.MenuSelect,
            targetLufs: -23,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: 0.04,
                        patch: pluckPatch,
                        pitches: [
                            81,
                            88,
                        ],
                        stepSeconds: 0.05,
                    }),
                    reverbSend: 0.15,
                },
            ],
        });
    },
    [SoundEffect.MenuBack]() {
        return createOneShot({
            reverb: shortRoom,
            seed: SoundEffect.MenuBack,
            targetLufs: -24,
            tracks: [
                {
                    ...createRun({
                        durationSeconds: 0.04,
                        patch: pluckPatch,
                        pitches: [
                            88,
                            81,
                        ],
                        stepSeconds: 0.05,
                    }),
                    reverbSend: 0.15,
                },
            ],
        });
    },
};
