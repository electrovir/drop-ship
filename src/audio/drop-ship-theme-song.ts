// cspell:word bandpassed detuned oxoxoxoxoxoxoxox predelay xoxoxoxoxoxoxoxo
import {assertWrap} from '@augment-vir/assert';
import {createArray} from '@augment-vir/common';
import {
    getBarSeconds,
    getStepSeconds,
    sequenceSteps,
    type SongGrid,
} from './synth/step-sequence.js';
import {StageKind, Waveform, type SynthNote, type SynthPatch} from './synth/synth-patch.js';
import {type SynthScore, type SynthTrack} from './synth/synth-score.js';

/**
 * The game's adaptive music has one layer per mood, all on the same timeline so the player can
 * crossfade between them at any bar.
 */
export enum MusicLayer {
    /** Calm, for building the ship: drone, pulse, and sub, no drums. */
    Build = 'build',
    /** The full track, for flying. */
    Fly = 'fly',
}

const grid: SongGrid = {
    bpm: 144,
};
const stepsPerBar = 16;

enum Chord {
    FSharpMinor = 'f-sharp-minor',
    D = 'd',
    A = 'a',
    E = 'e',
    BMinor = 'b-minor',
}

/** MIDI notes for each chord, one register per part. */
const chordNotes: Readonly<
    Record<
        Chord,
        Readonly<{
            /** The root around F#1. */
            sub: number;
            /** The root around F#2, which the bass plays. */
            bass: number;
            /** The chord's third, in semitones above the root. */
            third: number;
            /** Four voices with added 7ths and 9ths. */
            open: ReadonlyArray<number>;
        }>
    >
> = {
    [Chord.FSharpMinor]: {
        sub: 30,
        bass: 42,
        third: 3,
        open: [
            54,
            61,
            64,
            68,
        ],
    },
    [Chord.D]: {
        sub: 26,
        bass: 38,
        third: 4,
        open: [
            50,
            57,
            61,
            64,
        ],
    },
    [Chord.A]: {
        sub: 33,
        bass: 45,
        third: 4,
        open: [
            57,
            64,
            68,
            71,
        ],
    },
    [Chord.E]: {
        sub: 28,
        bass: 40,
        third: 4,
        open: [
            52,
            59,
            66,
            68,
        ],
    },
    [Chord.BMinor]: {
        sub: 23,
        bass: 35,
        third: 3,
        open: [
            47,
            54,
            57,
            61,
        ],
    },
};

const mainProgression = [
    Chord.FSharpMinor,
    Chord.D,
    Chord.A,
    Chord.E,
];

const darkProgression = [
    Chord.BMinor,
    Chord.D,
    Chord.FSharpMinor,
    Chord.E,
];

/** Each section is a lineup change: voices arrive and leave at every boundary. */
enum Section {
    /** Half-time kick, hats, and an off-beat bass, with the drone under them. */
    Intro = 'intro',
    /** The full kit, with the arp entering halfway through. */
    Groove = 'groove',
    /** The arp opens up over the full kit. */
    Hook = 'hook',
    /** A darker progression: off-beat bass, eighth hats, and the drone back under the arp. */
    Dark = 'dark',
    /** No drums or bass: the arp over the drone. Two bars per chord. */
    Breakdown = 'breakdown',
    /** The arp, with the acid line and then the countermelody joining. */
    Drive = 'drive',
    /**
     * The arp at its brightest with bells over the main progression, then the dark progression with
     * the countermelody, toms, and drone joining.
     */
    Climax = 'climax',
    /** A dark F#m pedal: the acid line under the drone, leading back into the intro. */
    Chase = 'chase',
}

/** One entry per bar. The last bar of the loop is on E so it leads back into the first. */
const sectionChords: Readonly<Record<Section, ReadonlyArray<Chord>>> = {
    [Section.Intro]: mainProgression.flatMap((chord) => {
        return [
            chord,
            chord,
        ];
    }),
    [Section.Groove]: createArray(4, () => mainProgression).flat(),
    [Section.Hook]: createArray(3, () => mainProgression).flat(),
    [Section.Dark]: createArray(3, () => darkProgression).flat(),
    [Section.Breakdown]: [
        Chord.BMinor,
        Chord.D,
        Chord.FSharpMinor,
        Chord.E,
    ].flatMap((chord) => {
        return [
            chord,
            chord,
        ];
    }),
    [Section.Drive]: createArray(3, () => {
        return [
            Chord.D,
            Chord.A,
            Chord.BMinor,
            Chord.E,
        ];
    }).flat(),
    [Section.Climax]: [
        ...mainProgression,
        ...mainProgression,
        ...darkProgression,
        ...darkProgression,
    ],
    [Section.Chase]: [
        Chord.FSharpMinor,
        Chord.FSharpMinor,
        Chord.FSharpMinor,
        Chord.FSharpMinor,
        Chord.D,
        Chord.D,
        Chord.E,
        Chord.E,
        Chord.FSharpMinor,
        Chord.FSharpMinor,
        Chord.E,
        Chord.E,
    ],
};

const sectionOrder = [
    Section.Intro,
    Section.Groove,
    Section.Hook,
    Section.Dark,
    Section.Breakdown,
    Section.Drive,
    Section.Climax,
    Section.Chase,
];

/** Every bar of the loop, with its section and where it sits within that section. */
const bars = sectionOrder.flatMap((section) => {
    return sectionChords[section].map((chord, barInSection, chords) => {
        return {
            barInSection,
            chord,
            isSectionEnd: barInSection === chords.length - 1,
            /** From 0 on the section's first bar to 1 on its last. */
            progress: barInSection / (chords.length - 1),
            section,
        };
    });
});
const barCount = bars.length;

function getBar(bar: number) {
    return assertWrap.isDefined(bars[bar]);
}

function getChord(bar: number) {
    return chordNotes[getBar(bar).chord];
}

/** The bars of the given sections, in loop order. */
function barsIn(...sections: ReadonlyArray<Section>) {
    return bars.flatMap((entry, bar) => {
        return sections.includes(entry.section) ? [bar] : [];
    });
}

/**
 * Talon Drive's kick: a sine body with a long pitch drop, a triangle punch under it, and a short
 * noise click on top.
 */
const kickPatch: SynthPatch = {
    amp: {
        attack: 0.0005,
        decay: 0.3,
        sustain: 0,
        release: 0.05,
    },
    envelopes: {
        pitch: {
            attack: 0,
            decay: 0.05,
            sustain: 0,
            release: 0.02,
        },
        punch: {
            attack: 0,
            decay: 0.12,
            sustain: 0,
            release: 0.02,
        },
        click: {
            attack: 0.0005,
            decay: 0.01,
            sustain: 0,
            release: 0.005,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                    fixedHz: {
                        base: 52,
                        envelope: 'pitch',
                        envelopeAmount: 450,
                    },
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2.5,
                },
            ],
        },
        {
            ampEnvelope: 'punch',
            gain: 0.35,
            oscillators: [
                {
                    wave: Waveform.Triangle,
                    fixedHz: {
                        base: 110,
                        envelope: 'punch',
                        envelopeAmount: 700,
                    },
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2,
                },
            ],
        },
        {
            ampEnvelope: 'click',
            gain: 0.2,
            oscillators: [
                {
                    wave: Waveform.Noise,
                },
            ],
            stages: [
                {
                    kind: StageKind.Highpass,
                    frequency: 1800,
                },
            ],
        },
    ],
};

/** A bright noise snare over a short pitched body, clipped so it cracks. */
const snarePatch: SynthPatch = {
    amp: {
        attack: 0.0008,
        decay: 0.14,
        sustain: 0,
        release: 0.05,
    },
    envelopes: {
        body: {
            attack: 0,
            decay: 0.05,
            sustain: 0,
            release: 0.02,
        },
    },
    velocityToGain: 0.9,
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Noise,
                    pan: -0.15,
                },
                {
                    wave: Waveform.Noise,
                    pan: 0.15,
                },
            ],
            stages: [
                {
                    kind: StageKind.Bandpass,
                    frequency: 2600,
                    q: 0.8,
                },
                {
                    kind: StageKind.Highpass,
                    frequency: 1000,
                },
                {
                    kind: StageKind.Drive,
                    amount: 1.8,
                },
            ],
        },
        {
            ampEnvelope: 'body',
            gain: 0.6,
            oscillators: [
                {
                    wave: Waveform.Triangle,
                    fixedHz: {
                        base: 180,
                        envelope: 'body',
                        envelopeAmount: 120,
                    },
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2,
                },
            ],
        },
    ],
};

/**
 * Every cymbal is one source, noise over four detuned squares, so the kit sounds like one machine.
 * They differ only in highpass and decay.
 */
function createCymbalPatch({
    decay,
    highpassHz,
}: Readonly<{decay: number; highpassHz: number}>): SynthPatch {
    return {
        amp: {
            attack: 0.0005,
            decay,
            sustain: 0,
            release: decay / 2,
        },
        velocityToGain: 0.85,
        layers: [
            {
                oscillators: [
                    {
                        wave: Waveform.Noise,
                        gain: 0.9,
                    },
                    ...[
                        2311,
                        3187,
                        4421,
                        6143,
                    ].map((fixedHz) => {
                        return {
                            wave: Waveform.Square,
                            fixedHz,
                            gain: 0.12,
                        };
                    }),
                ],
                stages: [
                    {
                        kind: StageKind.Highpass,
                        frequency: highpassHz,
                    },
                    {
                        kind: StageKind.Lowpass,
                        frequency: 12_000,
                    },
                ],
            },
        ],
    };
}

const closedHatPatch = createCymbalPatch({
    decay: 0.04,
    highpassHz: 5000,
});
const crashPatch = createCymbalPatch({
    decay: 0.9,
    highpassHz: 3400,
});

/** A plain sine sub, for the build layer. */
const softSubPatch: SynthPatch = {
    amp: {
        attack: 0.02,
        decay: 0.6,
        sustain: 0.7,
        release: 0.2,
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.2,
                },
            ],
        },
    ],
};

/**
 * The bass: a saw on each side, each clipped before its own closed four-pole lowpass that snaps
 * open on each note at a different cutoff and speed, over a centred sine for weight.
 *
 * Don't stack a square on a saw at the same pitch: the live score graph starts both in phase, and a
 * saw plus a half-level square in phase is a saw an octave up.
 */
const bassPatch: SynthPatch = {
    amp: {
        attack: 0.002,
        decay: 0.25,
        sustain: 0.6,
        release: 0.04,
    },
    envelopes: {
        left: {
            attack: 0.001,
            decay: 0.06,
            sustain: 0,
            release: 0.03,
        },
        right: {
            attack: 0.001,
            decay: 0.11,
            sustain: 0,
            release: 0.03,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -5,
                    pan: -0.5,
                    gain: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 230,
                        envelope: 'left',
                        envelopeAmount: 1100,
                        velocityAmount: 500,
                    },
                    isFourPole: true,
                    q: 2.4,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: 5,
                    pan: 0.5,
                    gain: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 300,
                        envelope: 'right',
                        envelopeAmount: 1100,
                        velocityAmount: 500,
                    },
                    isFourPole: true,
                    q: 2.4,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                    gain: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 2,
                },
            ],
        },
    ],
};

/**
 * A dark drone for the build layer: a root and its fifth on saws under a low filter that breathes
 * open over each bar. Each side has its own detune, cutoff, and filter timing, so the sound drifts
 * between them while the sub and fifth hold the centre.
 */
const dronePatch: SynthPatch = {
    amp: {
        attack: 0.6,
        decay: 1,
        sustain: 1,
        release: 1.5,
    },
    envelopes: {
        left: {
            attack: getBarSeconds(grid) * 0.45,
            decay: getBarSeconds(grid) * 0.5,
            sustain: 0.3,
            release: 1,
        },
        right: {
            attack: getBarSeconds(grid) * 0.85,
            decay: getBarSeconds(grid) * 0.3,
            sustain: 0.4,
            release: 1,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -9,
                    pan: -0.95,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: 3.6,
                    pan: -0.67,
                    gain: 0.6,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 155,
                        envelope: 'left',
                        envelopeAmount: 450,
                    },
                    isFourPole: true,
                    q: 2.2,
                },
                {
                    kind: StageKind.Drive,
                    amount: 1.6,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: 9,
                    pan: 0.95,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: -3.6,
                    pan: 0.67,
                    gain: 0.6,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 215,
                        envelope: 'right',
                        envelopeAmount: 450,
                    },
                    isFourPole: true,
                    q: 2.2,
                },
                {
                    kind: StageKind.Drive,
                    amount: 1.6,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    ratio: 1.5,
                    gain: 0.5,
                },
                {
                    wave: Waveform.Sine,
                    ratio: 0.5,
                    gain: 0.6,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: 400,
                    q: 0.7,
                },
            ],
        },
    ],
};

/** A dark sixteenth-note pulse: short saws through a closed resonant filter that accents open. */
const pulsePatch: SynthPatch = {
    amp: {
        attack: 0.002,
        decay: 0.12,
        sustain: 0,
        release: 0.05,
    },
    envelopes: {
        left: {
            attack: 0.001,
            decay: 0.07,
            sustain: 0,
            release: 0.05,
        },
        right: {
            attack: 0.001,
            decay: 0.13,
            sustain: 0,
            release: 0.05,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -9,
                    pan: -0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 170,
                        envelope: 'left',
                        envelopeAmount: 500,
                        velocityAmount: 900,
                    },
                    isFourPole: true,
                    q: 3,
                },
                {
                    kind: StageKind.Drive,
                    amount: 1.4,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: 9,
                    pan: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 260,
                        envelope: 'right',
                        envelopeAmount: 500,
                        velocityAmount: 900,
                    },
                    isFourPole: true,
                    q: 2.6,
                },
                {
                    kind: StageKind.Drive,
                    amount: 1.4,
                },
            ],
        },
    ],
};

/**
 * A sixteenth-note arp: a short bright saw on each side, with its own cutoff and filter snap, whose
 * filters velocity pushes open.
 */
const arpPatch: SynthPatch = {
    amp: {
        attack: 0.003,
        decay: 0.11,
        sustain: 0,
        release: 0.05,
    },
    envelopes: {
        left: {
            attack: 0.001,
            decay: 0.05,
            sustain: 0,
            release: 0.05,
        },
        right: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0,
            release: 0.05,
        },
    },
    velocityToGain: 0.5,
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: -10,
                    pan: -0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.5,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 550,
                        envelope: 'left',
                        envelopeAmount: 1200,
                        velocityAmount: 2600,
                        keyTrack: 0.5,
                    },
                    q: 1.6,
                },
                {
                    kind: StageKind.Highpass,
                    frequency: 250,
                },
            ],
        },
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    detuneCents: 10,
                    pan: 0.7,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.5,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 850,
                        envelope: 'right',
                        envelopeAmount: 1200,
                        velocityAmount: 2600,
                        keyTrack: 0.5,
                    },
                    q: 1.6,
                },
                {
                    kind: StageKind.Highpass,
                    frequency: 250,
                },
            ],
        },
    ],
};

const openHatPatch = createCymbalPatch({
    decay: 0.22,
    highpassHz: 6000,
});

/** Bandpassed noise with a soft attack, so it sits behind the hats rather than doubling them. */
const shakerPatch: SynthPatch = {
    amp: {
        attack: 0.006,
        decay: 0.05,
        sustain: 0,
        release: 0.03,
    },
    velocityToGain: 0.9,
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
                    kind: StageKind.Bandpass,
                    frequency: 7000,
                    q: 1.4,
                },
                {
                    kind: StageKind.Highpass,
                    frequency: 4000,
                },
            ],
        },
    ],
};

/** A tuned tom: a driven sine that drops into its pitch. */
const tomPatch: SynthPatch = {
    amp: {
        attack: 0.001,
        decay: 0.28,
        sustain: 0,
        release: 0.08,
    },
    envelopes: {
        pitch: {
            attack: 0,
            decay: 0.09,
            sustain: 0,
            release: 0.02,
        },
    },
    pitchEnvelope: {
        envelope: 'pitch',
        semitones: 9,
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Sine,
                },
                {
                    wave: Waveform.Triangle,
                    ratio: 1.5,
                    gain: 0.2,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.8,
                },
            ],
        },
    ],
};

/** A 303-style line: one saw, clipped into a resonant four-pole lowpass, with glide for slides. */
const acidPatch: SynthPatch = {
    amp: {
        attack: 0.002,
        decay: 0.2,
        sustain: 0.45,
        release: 0.04,
    },
    envelopes: {
        filter: {
            attack: 0.001,
            decay: 0.16,
            sustain: 0,
            release: 0.04,
        },
    },
    glideSeconds: 0.035,
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Saw,
                    pan: -0.15,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.8,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 320,
                        envelope: 'filter',
                        envelopeAmount: 1000,
                        velocityAmount: 500,
                    },
                    isFourPole: true,
                    q: 3.2,
                },
            ],
        },
    ],
};

/** A pulse-and-saw pluck panned right, for the countermelody. */
const counterPatch: SynthPatch = {
    amp: {
        attack: 0.002,
        decay: 0.22,
        sustain: 0.15,
        release: 0.1,
    },
    envelopes: {
        filter: {
            attack: 0.001,
            decay: 0.12,
            sustain: 0,
            release: 0.05,
        },
    },
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Square,
                    pulseWidth: 0.3,
                    pan: 0.4,
                },
                {
                    wave: Waveform.Saw,
                    detuneCents: 7,
                    pan: 0.2,
                    gain: 0.5,
                },
            ],
            stages: [
                {
                    kind: StageKind.Drive,
                    amount: 1.6,
                },
                {
                    kind: StageKind.Lowpass,
                    frequency: {
                        base: 700,
                        envelope: 'filter',
                        envelopeAmount: 2200,
                        keyTrack: 0.4,
                    },
                    q: 1.2,
                },
            ],
        },
    ],
};

/** An FM bell whose inharmonic strike fades into a pure sine. */
const bellPatch: SynthPatch = {
    amp: {
        attack: 0.002,
        decay: 1.4,
        sustain: 0,
        release: 0.8,
    },
    envelopes: {
        strike: {
            attack: 0,
            decay: 0.3,
            sustain: 0,
            release: 0.2,
        },
    },
    velocityToGain: 0.7,
    layers: [
        {
            oscillators: [
                {
                    pan: -0.3,
                    detuneCents: -4,
                },
                {
                    pan: 0.3,
                    detuneCents: 4,
                },
            ].map((side) => {
                return {
                    ...side,
                    wave: Waveform.Sine,
                    fm: {
                        ratio: 3.5,
                        depthHz: {
                            base: 40,
                            envelope: 'strike',
                            envelopeAmount: 900,
                        },
                    },
                };
            }),
            stages: [
                {
                    kind: StageKind.Highpass,
                    frequency: 300,
                },
            ],
        },
    ],
};

/** Clock ticks: very short, bright noise. */
const tickPatch: SynthPatch = {
    amp: {
        attack: 0.001,
        decay: 0.012,
        sustain: 0,
        release: 0.01,
    },
    velocityToGain: 0.9,
    layers: [
        {
            oscillators: [
                {
                    wave: Waveform.Noise,
                },
            ],
            stages: [
                {
                    kind: StageKind.Highpass,
                    frequency: 8000,
                },
            ],
        },
    ],
};

/**
 * Sequences the same step pattern in every bar of `bars`, with pitches chosen from each bar's
 * chord.
 */
function sequenceBars({
    bars,
    gateFraction,
    gateSteps,
    getPitches,
    getPattern,
    getVelocityScale,
}: Readonly<{
    bars: ReadonlyArray<number>;
    getPattern: (bar: number) => string;
    getPitches: (chord: (typeof chordNotes)[Chord], bar: number) => number | ReadonlyArray<number>;
    gateFraction?: number | undefined;
    gateSteps?: number | undefined;
    getVelocityScale?: ((bar: number) => number) | undefined;
}>): SynthNote[] {
    return bars.flatMap((bar) => {
        return sequenceSteps({
            gateFraction,
            gateSteps,
            grid,
            pattern: getPattern(bar),
            pitches: getPitches(getChord(bar), bar),
            startStep: bar * stepsPerBar,
            velocityScale: getVelocityScale?.(bar),
        });
    });
}

enum Drum {
    Kick = 'kick',
    Snare = 'snare',
    Hat = 'hat',
    OpenHat = 'open-hat',
    Shaker = 'shaker',
    Tom = 'tom',
}

/** One bar's drum patterns. A drum that is missing sits the bar out. */
type Kit = Readonly<Partial<Record<Drum, string | undefined>>>;

const fourOnTheFloor = 'X...X...X...X...';
const backbeat = '....X.......X...';
const eighthHats = 'x.x.x.x.x.x.x.x.';
const sixteenthHats = 'xoxoxoxoxoxoxoxo';

const driveKit: Kit = {
    [Drum.Kick]: fourOnTheFloor,
    [Drum.Snare]: backbeat,
    [Drum.Hat]: sixteenthHats,
};
const pushKit: Kit = {
    ...driveKit,
    [Drum.OpenHat]: '..o...o...o...o.',
};
const darkKit: Kit = {
    [Drum.Kick]: fourOnTheFloor,
    [Drum.Snare]: backbeat,
    [Drum.Hat]: eighthHats,
};

/** The kit for each bar of a section, by bar within the section. Section ends play a fill instead. */
const sectionKits: Readonly<Record<Section, (barInSection: number) => Kit>> = {
    [Section.Intro](barInSection) {
        return barInSection < 2
            ? {
                  [Drum.Hat]: eighthHats,
              }
            : {
                  [Drum.Kick]: barInSection < 4 ? 'X.......X.......' : fourOnTheFloor,
                  [Drum.Hat]: eighthHats,
                  [Drum.Shaker]: barInSection < 4 ? undefined : 'oxoxoxoxoxoxoxox',
              };
    },
    [Section.Groove](barInSection) {
        return barInSection < 12 ? driveKit : pushKit;
    },
    [Section.Hook](barInSection) {
        return {
            [Drum.Tom]: barInSection % 4 === 3 ? '.......x......x.' : undefined,
            [Drum.Kick]: fourOnTheFloor,
            [Drum.Snare]: backbeat,
            [Drum.Hat]: eighthHats,
            [Drum.OpenHat]: '..o...o...o...o.',
            [Drum.Shaker]: 'oxoxoxoxoxoxoxox',
        };
    },
    [Section.Dark](barInSection) {
        return barInSection % 2
            ? {
                  ...darkKit,
                  [Drum.Tom]: '.......x......x.',
              }
            : darkKit;
    },
    [Section.Breakdown](barInSection) {
        return barInSection < 4
            ? {}
            : {
                  [Drum.Shaker]: 'o.o.o.o.o.o.o.o.',
              };
    },
    [Section.Drive]() {
        return {
            ...driveKit,
            [Drum.Hat]: eighthHats,
            [Drum.Shaker]: 'oxoxoxoxoxoxoxox',
        };
    },
    [Section.Climax](barInSection) {
        return barInSection < 8
            ? pushKit
            : {
                  ...pushKit,
                  [Drum.Shaker]: 'oxoxoxoxoxoxoxox',
                  [Drum.Tom]: barInSection % 2 ? '.......x......x.' : undefined,
              };
    },
    [Section.Chase](barInSection) {
        return barInSection % 2
            ? {
                  ...driveKit,
                  [Drum.Tom]: '...x..x....x..x.',
              }
            : driveKit;
    },
};

function getKit(bar: number): Kit {
    const {barInSection, isSectionEnd, section} = getBar(bar);

    if (!isSectionEnd) {
        return sectionKits[section](barInSection);
    } else if (section === Section.Breakdown) {
        return {
            [Drum.Snare]: 'o...o...o.o.oooo',
            [Drum.Shaker]: 'o.o.o.o.o.o.o.o.',
        };
    } else {
        return {
            [Drum.Kick]: 'X...X...X.......',
            [Drum.Snare]: '....X...........',
            [Drum.Hat]: 'x.x.x.x.',
            [Drum.Tom]: '........X.x.x.xx',
        };
    }
}

/** Toms take these in turn, so every tom figure falls from high to low. */
const tomPitches = [
    55,
    52,
    50,
    47,
    43,
];

function sequenceDrum(drum: Drum) {
    return sequenceBars({
        bars: barsIn(...sectionOrder).filter((bar) => getKit(bar)[drum] != undefined),
        gateSteps: 1,
        getPattern(bar) {
            return getKit(bar)[drum] ?? '';
        },
        getPitches() {
            return drum === Drum.Tom ? tomPitches : 60;
        },
    });
}

/** Bars that open a section with a crash, plus the climax's second half. */
const crashBars = bars.flatMap((entry, bar) => {
    return (entry.barInSection === 0 &&
        ![
            Section.Intro,
            Section.Breakdown,
        ].includes(entry.section)) ||
        (entry.section === Section.Climax && entry.barInSection === 8)
        ? [bar]
        : [];
});

/** Bars of `section` from `fromBar` up to but not including `toBar`, counted within the section. */
function barsBetween({
    fromBar,
    section,
    toBar,
}: Readonly<{fromBar: number; section: Section; toBar: number}>) {
    return barsIn(section).filter((bar) => {
        return getBar(bar).barInSection >= fromBar && getBar(bar).barInSection < toBar;
    });
}

/** Bars of the given sections from `fromBar` within each section onward. */
function barsFrom(fromBar: number, ...sections: ReadonlyArray<Section>) {
    return barsIn(...sections).filter((bar) => getBar(bar).barInSection >= fromBar);
}

/** A two-bar countermelody on the chord's upper voices, off the beat. */
const counterPatterns = [
    '..x...x...x.x...',
    '..x...x.x.......',
];

function getCounterPitches(chord: (typeof chordNotes)[Chord]) {
    const [
        ,
        second = 0,
        third = 0,
        top = 0,
    ] = chord.open;

    return [
        second,
        third,
        top,
        third,
    ];
}

const sparseBellFigure = [
    'X.....x.....x...',
    '..x.....X.......',
];

/**
 * Two-bar bell figures an octave above the chord, each section with its own, entering at `fromBar`
 * within the section.
 */
const bellFigures: Readonly<
    Record<Section, Readonly<{fromBar: number; patterns: ReadonlyArray<string>}> | undefined>
> = {
    [Section.Intro]: {
        fromBar: 4,
        patterns: sparseBellFigure,
    },
    [Section.Groove]: {
        fromBar: 12,
        patterns: [
            'x.......x.x.....',
            '....x.......x...',
        ],
    },
    [Section.Hook]: {
        fromBar: 0,
        patterns: [
            'X..x..x.........',
            'X..x..x...x.x...',
        ],
    },
    [Section.Dark]: {
        fromBar: 0,
        patterns: sparseBellFigure,
    },
    [Section.Breakdown]: {
        fromBar: 0,
        patterns: sparseBellFigure,
    },
    [Section.Drive]: {
        fromBar: 4,
        patterns: [
            '..x...x...x.....',
            'x.......X.......',
        ],
    },
    [Section.Climax]: {
        fromBar: 0,
        patterns: [
            'X..x..x...x.....',
            '..x..x..X...x...',
        ],
    },
    [Section.Chase]: undefined,
};

function getBellPattern(bar: number) {
    return bellFigures[getBar(bar).section]?.patterns[getBar(bar).barInSection % 2] ?? '';
}

function getBellPitches(chord: (typeof chordNotes)[Chord], bar: number) {
    const [
        ,
        second = 0,
        third = 0,
        top = 0,
    ] = chord.open;

    return getBar(bar).barInSection % 2
        ? [
              third + 12,
              top + 24,
          ]
        : [
              top + 12,
              third + 12,
              second + 12,
          ];
}

/** The bass's root, reaching up to the fifth on the last beat of every fourth bar. */
function getBassPitches(chord: (typeof chordNotes)[Chord], bar: number) {
    return getBar(bar).barInSection % 4 === 3
        ? [
              ...createArray(3, () => chord.bass),
              chord.bass + 7,
          ]
        : chord.bass;
}

/** The bass's only figure: off-beat eighths on the chord's root. */
const bassPattern = '..x...x...x...x.';

/**
 * How hard the arp plays per section. Harder notes open its filter, so it brightens toward the
 * climax.
 */
const arpVelocities: Readonly<Record<Section, number | undefined>> = {
    [Section.Intro]: undefined,
    [Section.Groove]: 0.45,
    [Section.Hook]: 0.55,
    [Section.Dark]: 0.5,
    [Section.Breakdown]: 0.5,
    [Section.Drive]: 0.6,
    [Section.Climax]: 0.8,
    [Section.Chase]: undefined,
};

/** A sixteenth arp that thins out over each four-bar block. */
const arpPatterns = [
    'xxXxxxXxxxXxxxXx',
    'xxXxxxXxxxXxx.Xx',
    'xxX.xxX.xxXxx.Xx',
    'x.X.xxX.x.Xxx.X.',
];

function getArpPitches(chord: (typeof chordNotes)[Chord]) {
    const [
        root = 0,
        second = 0,
        third = 0,
        top = 0,
    ] = chord.open;

    return [
        root,
        third,
        top,
        second,
        top + 12,
        third,
    ].map((midi) => midi + 12);
}

/** The pulse rolls on the root and jumps an octave on every beat's third sixteenth. */
function getPulsePitches(chord: (typeof chordNotes)[Chord]) {
    return [
        chord.sub + 12,
        chord.sub + 12,
        chord.sub + 24,
        chord.sub + 12,
    ];
}

const loopSeconds = getBarSeconds(grid) * barCount;
const stepSeconds = getStepSeconds(grid);

/** The build layer pumps on every beat, though it has no kick. */
const beatSeconds = createArray(barCount * 4, (beat) => beat * stepSeconds * 4);

const reverb = {
    seconds: 2.4,
    predelaySeconds: 0.02,
    size: 1.15,
    dampingHz: 5500,
    highpassHz: 300,
};
/** A dotted eighth, the classic trance delay that rolls against the sixteenths. */
const delay = {
    seconds: stepSeconds * 3,
    feedback: 0.42,
    lowpassHz: 3800,
    highpassHz: 400,
};

/** The build layer's tracks that the fly layer also plays, unchanged. */
const sharedTracks = {
    sub: {
        gain: 0.6,
        notes: sequenceBars({
            bars: barsIn(...sectionOrder),
            gateFraction: 0.95,
            getPattern(bar) {
                return getBar(bar).section === Section.Breakdown
                    ? 'X---------------'
                    : 'X-------x-------';
            },
            getPitches(chord) {
                return chord.sub;
            },
        }),
        patch: softSubPatch,
        pumpDepth: 0.3,
    },
    drone: {
        gain: 0.16,
        notes: sequenceBars({
            bars: barsIn(...sectionOrder),
            gateFraction: 1,
            getPattern() {
                return 'X---------------';
            },
            getPitches(chord) {
                return chord.sub + 12;
            },
        }),
        patch: dronePatch,
        pumpDepth: 0.1,
        reverbSend: 0.06,
    },
    pulse: {
        gain: 0.35,
        notes: sequenceBars({
            bars: barsIn(
                Section.Intro,
                Section.Groove,
                Section.Hook,
                Section.Dark,
                Section.Drive,
                Section.Climax,
                Section.Chase,
            ),
            gateSteps: 1,
            getPattern(bar) {
                return getBar(bar).section === Section.Dark
                    ? 'X.xxX.xxX.xxX.xx'
                    : 'XxxxXxxxXxxxXxxx';
            },
            getPitches: getPulsePitches,
            getVelocityScale(bar) {
                return [
                    Section.Intro,
                    Section.Chase,
                ].includes(getBar(bar).section)
                    ? 0.55
                    : 0.8;
            },
        }),
        patch: pulsePatch,
        pumpDepth: 0.4,
        reverbSend: 0.02,
        delaySend: 0.03,
    },
} satisfies Record<string, SynthTrack>;

/** The build layer's master gain. The fly layer sits a little above it so flying lands bigger. */
const masterGainDb = -9.5;

/**
 * A space chase: a kit that changes every few bars, an off-beat bass, and the arp, bells,
 * countermelody, acid line, and the build layer's pulse handing off around it. The build layer's
 * sub runs under all of it, and its drone only fills the sparse sections.
 */
function createFlyScore(): SynthScore {
    const tracks: ReadonlyArray<SynthTrack> = [
        {
            bus: 'drums',
            gain: 0.3,
            notes: sequenceDrum(Drum.Kick),
            patch: kickPatch,
        },
        {
            bus: 'drums',
            gain: 0.24,
            notes: sequenceDrum(Drum.Snare),
            patch: snarePatch,
            reverbSend: 0.1,
        },
        {
            bus: 'drums',
            gain: 0.22,
            notes: sequenceDrum(Drum.Hat),
            patch: closedHatPatch,
        },
        {
            bus: 'drums',
            gain: 0.05,
            notes: sequenceDrum(Drum.OpenHat),
            patch: openHatPatch,
        },
        {
            gain: 0.12,
            notes: sequenceDrum(Drum.Shaker),
            patch: shakerPatch,
        },
        {
            bus: 'drums',
            gain: 0.1,
            notes: sequenceDrum(Drum.Tom),
            patch: tomPatch,
            reverbSend: 0.06,
        },
        {
            gain: 0.1,
            notes: crashBars.flatMap((bar) => {
                return sequenceSteps({
                    gateSteps: 1,
                    grid,
                    pattern: 'x',
                    pitches: 60,
                    startStep: bar * stepsPerBar,
                });
            }),
            patch: crashPatch,
            reverbSend: 0.2,
        },
        /**
         * No `pump` in this score: ducking the bass and sub under every kick chopped them into a
         * rhythm.
         */
        sharedTracks.sub,
        {
            ...sharedTracks.drone,
            gain: 0.07,
            notes: sequenceBars({
                bars: [
                    ...barsIn(Section.Intro, Section.Dark, Section.Breakdown),
                    ...barsFrom(8, Section.Climax),
                    ...barsIn(Section.Chase),
                ].toSorted((first, second) => first - second),
                gateFraction: 1,
                getPattern() {
                    return 'X---------------';
                },
                getPitches(chord) {
                    return chord.sub + 12;
                },
            }),
        },
        {
            ...sharedTracks.pulse,
            gain: 0.2,
            notes: sharedTracks.pulse.notes.filter((note) => {
                const bar = Math.floor(Math.round(note.startSeconds / stepSeconds) / stepsPerBar);

                return [
                    ...barsIn(Section.Intro),
                    ...barsBetween({
                        section: Section.Groove,
                        fromBar: 0,
                        toBar: 4,
                    }),
                    ...barsBetween({
                        section: Section.Chase,
                        fromBar: 8,
                        toBar: 12,
                    }),
                ].includes(bar);
            }),
        },
        {
            bus: 'low',
            gain: 0.21,
            notes: sequenceBars({
                bars: [
                    ...barsFrom(4, Section.Intro),
                    ...barsIn(
                        ...sectionOrder.filter((section) => {
                            return section !== Section.Intro && section !== Section.Breakdown;
                        }),
                    ),
                ],
                gateFraction: 0.7,
                getPattern() {
                    return bassPattern;
                },
                getPitches: getBassPitches,
            }),
            patch: bassPatch,
        },
        {
            bus: 'low',
            gain: 0.08,
            notes: sequenceBars({
                bars: [
                    ...barsBetween({
                        section: Section.Groove,
                        fromBar: 12,
                        toBar: 16,
                    }),
                    ...barsBetween({
                        section: Section.Hook,
                        fromBar: 8,
                        toBar: 12,
                    }),
                    ...barsBetween({
                        section: Section.Dark,
                        fromBar: 4,
                        toBar: 8,
                    }),
                    ...barsFrom(4, Section.Drive),
                    ...barsBetween({
                        section: Section.Climax,
                        fromBar: 12,
                        toBar: 16,
                    }),
                    ...barsIn(Section.Chase),
                ],
                gateFraction: 0.9,
                getPattern() {
                    return 'x.x-s.x.x.x-s.x.';
                },
                getPitches(chord) {
                    return [
                        chord.bass,
                        chord.bass,
                        chord.bass + 7,
                        chord.bass,
                        chord.bass,
                        chord.bass,
                        chord.bass + 7,
                        chord.bass,
                    ].map((midi) => midi + 12);
                },
            }),
            patch: acidPatch,
            delaySend: 0.06,
        },
        {
            gain: 0.14,
            notes: sequenceBars({
                bars: bars.flatMap((entry, bar) => {
                    return arpVelocities[entry.section] == undefined ||
                        (entry.section === Section.Groove && entry.progress < 0.5)
                        ? []
                        : [bar];
                }),
                gateSteps: 1,
                getPattern(bar) {
                    return arpPatterns[getBar(bar).barInSection % arpPatterns.length] ?? '';
                },
                getPitches: getArpPitches,
                getVelocityScale(bar) {
                    return arpVelocities[getBar(bar).section] ?? 0;
                },
            }),
            patch: arpPatch,
            reverbSend: 0.12,
            delaySend: 0.2,
        },
        {
            gain: 0.11,
            notes: sequenceBars({
                bars: [
                    ...barsFrom(4, Section.Hook),
                    ...barsFrom(8, Section.Drive),
                    ...barsFrom(8, Section.Climax),
                    ...barsFrom(4, Section.Chase),
                ],
                gateSteps: 1.5,
                getPattern(bar) {
                    return counterPatterns[getBar(bar).barInSection % 2] ?? '';
                },
                getPitches: getCounterPitches,
            }),
            patch: counterPatch,
            reverbSend: 0.06,
            delaySend: 0.1,
        },
        {
            gain: 0.07,
            notes: sequenceBars({
                bars: bars.flatMap((entry, bar) => {
                    const figure = bellFigures[entry.section];

                    return figure && entry.barInSection >= figure.fromBar ? [bar] : [];
                }),
                gateSteps: 2,
                getPattern: getBellPattern,
                getPitches: getBellPitches,
            }),
            patch: bellPatch,
            reverbSend: 0.2,
            delaySend: 0.2,
        },
    ];

    return {
        buses: {
            drums: {
                drive: 1.5,
            },
            low: {
                drive: 1.3,
            },
        },
        delay,
        durationSeconds: loopSeconds,
        isLooped: true,
        master: {
            gainDb: masterGainDb + 1.5,
        },
        reverb,
        seed: 'drop-ship-theme',
        tracks,
    };
}

function createBuildScore(): SynthScore {
    const tracks: ReadonlyArray<SynthTrack> = [
        sharedTracks.sub,
        sharedTracks.drone,
        sharedTracks.pulse,
        {
            gain: 0.05,
            notes: sequenceBars({
                bars: barsIn(Section.Dark, Section.Breakdown, Section.Climax),
                gateSteps: 2,
                getPattern: getBellPattern,
                getPitches(chord, bar) {
                    return getBellPitches(chord, bar).map((midi) => midi - 12);
                },
            }),
            patch: bellPatch,
            reverbSend: 0.25,
            delaySend: 0.15,
        },
        {
            gain: 0.2,
            notes: sequenceBars({
                bars: barsIn(Section.Dark, Section.Drive, Section.Chase),
                gateSteps: 1,
                getPattern() {
                    return 'xxXxxxXxxxXxxxXx';
                },
                getPitches() {
                    return 60;
                },
                getVelocityScale() {
                    return 0.6;
                },
            }),
            patch: tickPatch,
            reverbSend: 0.02,
        },
        {
            gain: 0.12,
            notes: sequenceBars({
                bars: barsIn(Section.Drive, Section.Climax),
                gateSteps: 1,
                getPattern(bar) {
                    return arpPatterns[getBar(bar).barInSection % arpPatterns.length] ?? '';
                },
                getPitches: getArpPitches,
                getVelocityScale() {
                    return 0.3;
                },
            }),
            patch: arpPatch,
            pumpDepth: 0.4,
            reverbSend: 0.03,
            delaySend: 0.04,
        },
    ];

    return {
        delay,
        durationSeconds: loopSeconds,
        isLooped: true,
        master: {
            gainDb: masterGainDb,
        },
        pump: {
            holdSeconds: 0.02,
            releaseSeconds: 0.14,
            triggerSeconds: beatSeconds,
        },
        reverb: {
            ...reverb,
            seconds: 3.2,
        },
        seed: 'drop-ship-theme',
        tracks,
    };
}

/** Builds every layer's score. Building is cheap; rendering them is not. */
export function createDropShipTheme(): Record<MusicLayer, SynthScore> {
    return {
        [MusicLayer.Build]: createBuildScore(),
        [MusicLayer.Fly]: createFlyScore(),
    };
}

/** The theme's tempo grid, so music-synced effects can land on its beats. */
export const dropShipThemeGrid = grid;
