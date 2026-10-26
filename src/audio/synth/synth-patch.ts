// cspell:word adsr butterworth
import {type PartialWithUndefined} from '@augment-vir/common';

export enum Waveform {
    Sine = 'sine',
    Triangle = 'triangle',
    Saw = 'saw',
    /** A pulse wave. Its width is set by `pulseWidth`. */
    Square = 'square',
    Noise = 'noise',
}

export enum StageKind {
    Lowpass = 'lowpass',
    Highpass = 'highpass',
    /** Normalized so the center frequency passes at unity gain whatever the `q`. */
    Bandpass = 'bandpass',
    Drive = 'drive',
    Gain = 'gain',
}

/**
 * An ADSR envelope. Attack is a linear ramp in seconds. Decay and release are exponential, and
 * their values are time constants rather than total lengths: after `decay` seconds the level has
 * fallen about 63% of the way to `sustain`. A note's gate (its duration) decides when release
 * starts.
 */
export type SynthEnvelope = {
    attack: number;
    decay: number;
    /** Level from `0` to `1` held while the gate is open. */
    sustain: number;
    release: number;
};

/**
 * A number, or a number moved per sample by an envelope, by the note's velocity, or (for
 * frequencies) by the note's pitch.
 *
 * The result is `base * keyTrackRatio + envelopeAmount * envelopeLevel + velocityAmount *
 * velocity`, where `keyTrackRatio` is `(noteHz / 261.63) ** keyTrack`.
 */
export type ModulatedValue =
    | number
    | Readonly<
          {
              base: number;
          } & PartialWithUndefined<{
              /** A key of the patch's `envelopes`. */
              envelope: string;
              envelopeAmount: number;
              /** Squares the envelope level first, for sweeps that fall fast and then linger. */
              isSquared: boolean;
              velocityAmount: number;
              keyTrack: number;
          }>
      >;

export type SynthOscillator = Readonly<
    {
        wave: Waveform;
    } & PartialWithUndefined<{
        /** Defaults to `1`. */
        gain: number;
        /** A frequency multiplier on the note's pitch. `2` is an octave up. */
        ratio: number;
        detuneCents: number;
        /** Ignores the note's pitch entirely. Kicks and tuned drum shells use this. */
        fixedHz: ModulatedValue;
        /** `-1` is hard left. Any non-zero pan in a layer renders the layer in stereo. */
        pan: number;
        /** Only for {@link Waveform.Square}. Defaults to `0.5`. */
        pulseWidth: number;
        /** Frequency modulation by a sine at `ratio` times this oscillator's frequency. */
        fm: Readonly<{
            ratio: number;
            /** How far the modulator swings the frequency, in Hz. */
            depthHz: ModulatedValue;
        }>;
        /**
         * Start phase from `0` to `1`. Defaults to `0` for sines, so kicks start without a click,
         * and to a seeded random phase for everything else, so stacked oscillators don't phase
         * align on every note.
         */
        phase: number;
    }>
>;

export type SynthStage = Readonly<
    | {
          kind: StageKind.Lowpass | StageKind.Highpass | StageKind.Bandpass;
          frequency: ModulatedValue;
          /** Defaults to `0.707`, a flat Butterworth response. */
          q?: ModulatedValue | undefined;
          /** Cascades two filters for a steeper 24 dB per octave slope. */
          isFourPole?: boolean | undefined;
      }
    | {
          kind: StageKind.Drive;
          /** See `normalizedTanh`. */
          amount: number;
      }
    | {
          kind: StageKind.Gain;
          amount: ModulatedValue;
      }
>;

/** Oscillators summed and then run through `stages` in order. */
export type SynthLayer = Readonly<
    {
        oscillators: ReadonlyArray<SynthOscillator>;
    } & PartialWithUndefined<{
        stages: ReadonlyArray<SynthStage>;
        /** Defaults to `1`. */
        gain: number;
        /**
         * A key of the patch's `envelopes` to use as this layer's amplitude envelope instead of the
         * patch's `amp`.
         */
        ampEnvelope: string;
    }>
>;

/** A sound: everything needed to render any note on it. */
export type SynthPatch = Readonly<
    {
        layers: ReadonlyArray<SynthLayer>;
        amp: SynthEnvelope;
    } & PartialWithUndefined<{
        /** Extra envelopes that layers and modulated values refer to by key. */
        envelopes: Readonly<Record<string, SynthEnvelope>>;
        /**
         * How much a note's velocity scales its level, from `0` (not at all) to `1` (velocity is
         * the gain). Defaults to `1`.
         */
        velocityToGain: number;
        /**
         * Time constant in seconds for gliding between pitches inside one note. `0` (the default)
         * jumps.
         */
        glideSeconds: number;
        /** Bends the pitch by `semitones` times the envelope's level. */
        pitchEnvelope: Readonly<{
            envelope: string;
            semitones: number;
        }>;
        vibrato: Readonly<{
            rateHz: number;
            cents: number;
        }>;
    }>
>;

/** One note on a patch. Times are in seconds. */
export type SynthNote = Readonly<
    {
        startSeconds: number;
        /** How long the gate stays open. The note keeps sounding through its release. */
        durationSeconds: number;
        midi: number;
    } & PartialWithUndefined<{
        /** From `0` to `1`. Defaults to `1`. */
        velocity: number;
        pan: number;
        /**
         * Pitch changes within the note without retriggering envelopes: an acid slide, or a bend.
         * `atSeconds` is relative to the note's start.
         */
        pitchSteps: ReadonlyArray<
            Readonly<{
                atSeconds: number;
                midi: number;
            }>
        >;
    }>
>;
