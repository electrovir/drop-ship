// cspell:word brickwall lufs
import {createArray, type PartialWithUndefined} from '@augment-vir/common';
import {type StereoBuffer} from './synth-effects.js';
import {dbToGain, gainToDb} from './synth-math.js';

type Biquad = Readonly<{
    b0: number;
    b1: number;
    b2: number;
    a1: number;
    a2: number;
}>;

/**
 * The two ITU-R BS.1770 K-weighting filters (a high shelf and a highpass) designed for any sample
 * rate from their analog prototypes.
 */
function createKWeighting(sampleRate: number): ReadonlyArray<Biquad> {
    const shelfGain = 10 ** (3.999843853973347 / 40);
    const shelfOmega = (2 * Math.PI * 1681.9744509555319) / sampleRate;
    const shelfAlpha = Math.sin(shelfOmega) / (2 * 0.7071752369554193);
    const shelfCos = Math.cos(shelfOmega);
    const shelfRoot = 2 * Math.sqrt(shelfGain) * shelfAlpha;
    const shelfA0 = shelfGain + 1 - (shelfGain - 1) * shelfCos + shelfRoot;
    const passOmega = (2 * Math.PI * 38.13547087613982) / sampleRate;
    const passAlpha = Math.sin(passOmega) / (2 * 0.5003270373253953);
    const passCos = Math.cos(passOmega);
    const passA0 = 1 + passAlpha;

    return [
        {
            b0: (shelfGain * (shelfGain + 1 + (shelfGain - 1) * shelfCos + shelfRoot)) / shelfA0,
            b1: (-2 * shelfGain * (shelfGain - 1 + (shelfGain + 1) * shelfCos)) / shelfA0,
            b2: (shelfGain * (shelfGain + 1 + (shelfGain - 1) * shelfCos - shelfRoot)) / shelfA0,
            a1: (2 * (shelfGain - 1 - (shelfGain + 1) * shelfCos)) / shelfA0,
            a2: (shelfGain + 1 - (shelfGain - 1) * shelfCos - shelfRoot) / shelfA0,
        },
        {
            b0: (1 + passCos) / 2 / passA0,
            b1: -(1 + passCos) / passA0,
            b2: (1 + passCos) / 2 / passA0,
            a1: (-2 * passCos) / passA0,
            a2: (1 - passAlpha) / passA0,
        },
    ];
}

/**
 * Integrated loudness in LUFS per ITU-R BS.1770, with its absolute and relative gates. `gain`
 * scales each sample before measuring, so a gain curve can be measured without being applied. Audio
 * shorter than one 400 ms block is measured as a single block.
 */
export function measureLoudness({
    buffer,
    gain,
    sampleRate,
}: Readonly<
    {
        buffer: Readonly<StereoBuffer>;
        sampleRate: number;
    } & PartialWithUndefined<{
        gain: number | Float32Array;
    }>
>) {
    const filters = createKWeighting(sampleRate);
    const hopSamples = Math.round(sampleRate * 0.1);
    const hopEnergies = new Float64Array(Math.ceil(buffer.left.length / hopSamples));

    [
        buffer.left,
        buffer.right,
    ].forEach((channel) => {
        const states = new Float64Array(filters.length * 4);

        channel.forEach((element, index) => {
            const sampleGain =
                gain == undefined ? 1 : typeof gain === 'number' ? gain : (gain[index] ?? 0);
            const weighted = filters.reduce((input, filter, filterIndex) => {
                const offset = filterIndex * 4;
                const input1 = states[offset] ?? 0;
                const input2 = states[offset + 1] ?? 0;
                const output1 = states[offset + 2] ?? 0;
                const output2 = states[offset + 3] ?? 0;
                const output =
                    filter.b0 * input +
                    filter.b1 * input1 +
                    filter.b2 * input2 -
                    filter.a1 * output1 -
                    filter.a2 * output2;

                states[offset] = input;
                states[offset + 1] = input1;
                states[offset + 2] = output;
                states[offset + 3] = output1;

                return output;
            }, element * sampleGain);
            const hopIndex = Math.floor(index / hopSamples);

            hopEnergies[hopIndex] = (hopEnergies[hopIndex] ?? 0) + weighted * weighted;
        });
    });

    const blockEnergies =
        hopEnergies.length < 4
            ? [
                  hopEnergies.reduce((sum, energy) => sum + energy, 0) / buffer.left.length,
              ]
            : Array.from(hopEnergies.subarray(0, hopEnergies.length - 3), (energy, hopIndex) => {
                  return (
                      (energy +
                          (hopEnergies[hopIndex + 1] ?? 0) +
                          (hopEnergies[hopIndex + 2] ?? 0) +
                          (hopEnergies[hopIndex + 3] ?? 0)) /
                      (hopSamples * 4)
                  );
              });

    function energyToLufs(energy: number) {
        return -0.691 + 10 * Math.log10(Math.max(energy, 1e-12));
    }

    function gatedMean(blocks: ReadonlyArray<number>, thresholdLufs: number) {
        const passing = blocks.filter((energy) => energyToLufs(energy) > thresholdLufs);

        return passing.length
            ? passing.reduce((sum, energy) => sum + energy, 0) / passing.length
            : 0;
    }

    const absoluteGated = gatedMean(blockEnergies, -70);

    return energyToLufs(gatedMean(blockEnergies, energyToLufs(absoluteGated) - 10));
}

export type SynthLimiter = Readonly<
    PartialWithUndefined<{
        /** Defaults to -1 dBFS. */
        ceilingDb: number;
        /** How far ahead gain reduction starts ramping in. Defaults to 3 ms. */
        attackSeconds: number;
        /** Time constant for gain to recover after a peak. Defaults to 120 ms. */
        releaseSeconds: number;
    }>
>;

/**
 * Computes a brickwall limiter's gain for every sample without applying it. Because the whole
 * signal is known up front, gain ramps down _before_ each peak with no added latency, and no sample
 * times its gain exceeds the ceiling.
 *
 * With `isLooped`, the end of the audio is treated as running into its start, so the gain is
 * continuous across the loop point.
 */
export function computeLimiterGain({
    buffer,
    inputGain,
    isLooped,
    limiter,
    sampleRate,
}: Readonly<{
    buffer: Readonly<StereoBuffer>;
    inputGain: number;
    isLooped: boolean;
    limiter: SynthLimiter;
    sampleRate: number;
}>) {
    const length = buffer.left.length;
    const ceiling = dbToGain(limiter.ceilingDb ?? -1);
    const attackCoefficient = Math.exp(-1 / ((limiter.attackSeconds ?? 0.003) * sampleRate));
    const releaseCoefficient = Math.exp(-1 / ((limiter.releaseSeconds ?? 0.12) * sampleRate));
    const gains = new Float32Array(length);

    gains.forEach((_gain, index) => {
        const peak =
            Math.max(Math.abs(buffer.left[index] ?? 0), Math.abs(buffer.right[index] ?? 0)) *
            inputGain;

        gains[index] = peak > ceiling ? ceiling / peak : 1;
    });

    /** A loop runs each pass twice so the state carried across the loop point has settled. */
    const laps = isLooped ? 2 : 1;
    let reduction = 0;

    for (let step = 0; step < length * laps; step++) {
        const index = length - 1 - (step % length);
        reduction = Math.max(1 - (gains[index] ?? 1), reduction * attackCoefficient);
        gains[index] = 1 - reduction;
    }

    reduction = 0;

    for (let step = 0; step < length * laps; step++) {
        const index = step % length;
        reduction = Math.max(1 - (gains[index] ?? 1), reduction * releaseCoefficient);
        gains[index] = 1 - reduction;
    }

    return gains;
}

export type SynthMaster = Readonly<
    PartialWithUndefined<{
        /**
         * Integrated loudness to aim for after limiting, in LUFS. Without it, the mix is only
         * limited.
         */
        targetLufs: number;
        /**
         * A fixed gain into the limiter, in dB, used when `targetLufs` is unset. Live playback
         * always uses this, since it can't measure loudness before the audio plays.
         */
        gainDb: number;
        /** Removes everything below this, in Hz. Defaults to 20 Hz. */
        highpassHz: number;
        limiter: SynthLimiter;
    }>
>;

/**
 * Applies a gain that brings the mix to `master.targetLufs` and the limiter that keeps it under the
 * ceiling, in place. Limiting lowers loudness, so the gain is refined over a few passes until the
 * limited result lands on target.
 */
export function applyMasterGain({
    buffer,
    isLooped,
    master,
    sampleRate,
}: Readonly<{
    buffer: StereoBuffer;
    isLooped: boolean;
    master: SynthMaster;
    sampleRate: number;
}>) {
    const limiter = master.limiter || {};
    const targetLufs = master.targetLufs;
    const initialGain =
        targetLufs == undefined
            ? dbToGain(master.gainDb ?? 0)
            : dbToGain(
                  targetLufs -
                      measureLoudness({
                          buffer,
                          sampleRate,
                      }),
              );
    const refinementPasses = targetLufs == undefined ? 0 : 3;
    const {gains, inputGain} = createArray(refinementPasses, (pass) => pass).reduce<{
        gains: Float32Array;
        inputGain: number;
    }>(
        (previous) => {
            const loudness = measureLoudness({
                buffer,
                gain: previous.gains.map((gain) => gain * previous.inputGain),
                sampleRate,
            });
            const nextInputGain =
                previous.inputGain * dbToGain((targetLufs ?? loudness) - loudness);

            return {
                gains: computeLimiterGain({
                    buffer,
                    inputGain: nextInputGain,
                    isLooped,
                    limiter,
                    sampleRate,
                }),
                inputGain: nextInputGain,
            };
        },
        {
            gains: computeLimiterGain({
                buffer,
                inputGain: initialGain,
                isLooped,
                limiter,
                sampleRate,
            }),
            inputGain: initialGain,
        },
    );

    [
        buffer.left,
        buffer.right,
    ].forEach((channel) => {
        channel.forEach((sample, index) => {
            channel[index] = sample * inputGain * (gains[index] ?? 1);
        });
    });

    return {
        gainDb: gainToDb(inputGain),
    };
}
