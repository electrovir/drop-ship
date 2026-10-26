// cspell:word xorshift
/** Frequency in Hz of a MIDI note number, with A4 (69) at 440 Hz. Fractional notes are allowed. */
export function midiToHz(midi: number) {
    return 440 * 2 ** ((midi - 69) / 12);
}

export function dbToGain(db: number) {
    return 10 ** (db / 20);
}

export function gainToDb(gain: number) {
    return 20 * Math.log10(Math.max(gain, 1e-12));
}

/**
 * Same as `Math.tanh(drive * sample)` but scaled so that a full-scale input still comes out at full
 * scale: drive adds harmonics and density without changing the peak level. A drive near zero is a
 * clean pass-through.
 */
export function normalizedTanh({sample, drive}: Readonly<{sample: number; drive: number}>) {
    return drive < 0.01 ? sample : Math.tanh(drive * sample) / Math.tanh(drive);
}

/** Hashes strings and numbers into a non-zero 32-bit seed for {@link createSeededNoise}. */
export function hashSeed(...parts: ReadonlyArray<string | number>) {
    const hash = parts
        .join('\u0000')
        .split('')
        .reduce((accumulator, character) => {
            return Math.imul(accumulator ^ (character.codePointAt(0) ?? 0), 16_777_619) >>> 0;
        }, 2_166_136_261);

    return hash || 1;
}

/**
 * A fast deterministic white noise source (xorshift32) that returns values in `[-1, 1)`. The same
 * seed always produces the same sequence, which keeps every render identical across runs.
 */
export function createSeededNoise(seed: number) {
    let state = seed >>> 0 || 1;

    return () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        state >>>= 0;

        return state / 2_147_483_648 - 1;
    };
}

/** Gains for a constant-power pan where center (`0`) leaves both channels at unity. */
export function panGains(pan: number) {
    const angle = ((Math.min(Math.max(pan, -1), 1) + 1) * Math.PI) / 4;

    return {
        left: Math.cos(angle) * Math.SQRT2,
        right: Math.sin(angle) * Math.SQRT2,
    };
}
