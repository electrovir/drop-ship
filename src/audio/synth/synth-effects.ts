// cspell:word hadamard predelay
import {type PartialWithUndefined} from '@augment-vir/common';
import {normalizedTanh} from './synth-math.js';

/** Two equal-length channels of audio. */
export type StereoBuffer = {
    left: Float32Array<ArrayBuffer>;
    right: Float32Array<ArrayBuffer>;
};

export function createStereoBuffer(length: number): StereoBuffer {
    return {
        left: new Float32Array(length),
        right: new Float32Array(length),
    };
}

/**
 * Adds `source` into `target`, starting at `offset` in `target`. Samples past the end of `target`
 * wrap around to its start when `wrapLength` is set, which is how a looping track hears the tails
 * of its own last notes on its first beat. Otherwise they're dropped.
 */
export function mixInto({
    gain,
    offset,
    source,
    target,
    wrapLength,
}: Readonly<
    {
        gain: number;
        offset: number;
        source: Readonly<StereoBuffer>;
        target: StereoBuffer;
    } & PartialWithUndefined<{
        wrapLength: number;
    }>
>) {
    const targetLength = wrapLength ?? target.left.length;

    for (let index = 0; index < source.left.length; index++) {
        const unwrappedIndex = offset + index;

        if (!wrapLength && unwrappedIndex >= targetLength) {
            break;
        }

        const targetIndex = wrapLength ? unwrappedIndex % wrapLength : unwrappedIndex;

        target.left[targetIndex] =
            (target.left[targetIndex] ?? 0) + (source.left[index] ?? 0) * gain;
        target.right[targetIndex] =
            (target.right[targetIndex] ?? 0) + (source.right[index] ?? 0) * gain;
    }
}

export function applyDrive({buffer, drive}: Readonly<{buffer: StereoBuffer; drive: number}>) {
    [
        buffer.left,
        buffer.right,
    ].forEach((channel) => {
        channel.forEach((sample, index) => {
            channel[index] = normalizedTanh({
                sample,
                drive,
            });
        });
    });
}

/**
 * A one-pole highpass in place, mainly to remove DC and sub-sonic rumble. With `isLooped`, the
 * filter first runs once over the whole buffer so its state at the start matches the end.
 */
export function applyHighpass({
    buffer,
    hz,
    isLooped,
    sampleRate,
}: Readonly<{
    buffer: StereoBuffer;
    hz: number;
    isLooped: boolean;
    sampleRate: number;
}>) {
    const coefficient = Math.exp((-2 * Math.PI * hz) / sampleRate);

    [
        buffer.left,
        buffer.right,
    ].forEach((channel) => {
        let previousInput = 0;
        let previousOutput = 0;

        if (isLooped) {
            channel.forEach((sample) => {
                previousOutput = coefficient * (previousOutput + sample - previousInput);
                previousInput = sample;
            });
        }

        channel.forEach((sample, index) => {
            previousOutput = coefficient * (previousOutput + sample - previousInput);
            previousInput = sample;
            channel[index] = previousOutput;
        });
    });
}

export type SynthDelay = Readonly<
    {
        seconds: number;
        /** How much of each repeat feeds the next, from `0` to below `1`. */
        feedback: number;
    } & PartialWithUndefined<{
        /** Repeats get darker by passing a lowpass at this frequency each time. */
        lowpassHz: number;
        /** Repeats get thinner by passing a highpass at this frequency each time. */
        highpassHz: number;
    }>
>;

/**
 * Turns a delay send into the delay's wet output, in place. Repeats ping-pong: the first lands on
 * the left, the next on the right, and so on.
 */
export function applyPingPongDelay({
    buffer,
    delay,
    sampleRate,
}: Readonly<{
    buffer: StereoBuffer;
    delay: SynthDelay;
    sampleRate: number;
}>) {
    const delaySamples = Math.max(1, Math.round(delay.seconds * sampleRate));
    const leftLine = new Float32Array(delaySamples);
    const rightLine = new Float32Array(delaySamples);
    const lowpassCoefficient =
        1 - Math.exp((-2 * Math.PI * (delay.lowpassHz ?? 20_000)) / sampleRate);
    const highpassCoefficient =
        1 - Math.exp((-2 * Math.PI * (delay.highpassHz ?? 10)) / sampleRate);
    let lowLeft = 0;
    let lowRight = 0;
    let rumbleLeft = 0;
    let rumbleRight = 0;

    for (let index = 0; index < buffer.left.length; index++) {
        const linePosition = index % delaySamples;
        const leftOut = leftLine[linePosition] ?? 0;
        const rightOut = rightLine[linePosition] ?? 0;

        lowLeft += (leftOut - lowLeft) * lowpassCoefficient;
        lowRight += (rightOut - lowRight) * lowpassCoefficient;
        rumbleLeft += (lowLeft - rumbleLeft) * highpassCoefficient;
        rumbleRight += (lowRight - rumbleRight) * highpassCoefficient;

        const input = ((buffer.left[index] ?? 0) + (buffer.right[index] ?? 0)) / 2;

        leftLine[linePosition] = input + (lowRight - rumbleRight) * delay.feedback;
        rightLine[linePosition] = (lowLeft - rumbleLeft) * delay.feedback;
        buffer.left[index] = leftOut;
        buffer.right[index] = rightOut;
    }
}

export type SynthReverb = Readonly<
    {
        /** Time for the tail to fall 60 dB. */
        seconds: number;
    } & PartialWithUndefined<{
        /** Scales the room. Defaults to `1`. */
        size: number;
        predelaySeconds: number;
        /** High frequencies die away faster than this. Defaults to 6 kHz. */
        dampingHz: number;
        /** Keeps low end out of the tail. Defaults to 200 Hz. */
        highpassHz: number;
    }>
>;

/** Delay line lengths in milliseconds, mutually prime-ish so the echoes never stack up. */
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

/** Mixes 8 values with a normalized Hadamard matrix, which keeps their total energy. */
function hadamard8(values: Float64Array) {
    for (let size = 1; size < 8; size *= 2) {
        for (let start = 0; start < 8; start += size * 2) {
            for (let index = start; index < start + size; index++) {
                const first = values[index] ?? 0;
                const second = values[index + size] ?? 0;

                values[index] = first + second;
                values[index + size] = first - second;
            }
        }
    }

    for (let index = 0; index < 8; index++) {
        values[index] = (values[index] ?? 0) / Math.SQRT2 / 2;
    }
}

/**
 * Turns a reverb send into the reverb's wet output, in place. An 8-line feedback delay network
 * behind a chain of allpass diffusers: dense, smooth, and cheap.
 */
export function applyReverb({
    buffer,
    reverb,
    sampleRate,
}: Readonly<{
    buffer: StereoBuffer;
    reverb: SynthReverb;
    sampleRate: number;
}>) {
    const size = reverb.size ?? 1;
    const lineLengths = reverbLineMs.map((ms) => Math.round((ms * size * sampleRate) / 1000));
    const lines = lineLengths.map((length) => new Float32Array(length));
    const lineGains = lineLengths.map(
        (length) => 10 ** ((-3 * length) / (reverb.seconds * sampleRate)),
    );
    const dampingCoefficient =
        1 - Math.exp((-2 * Math.PI * (reverb.dampingHz ?? 6000)) / sampleRate);
    const highpassCoefficient =
        1 - Math.exp((-2 * Math.PI * (reverb.highpassHz ?? 200)) / sampleRate);
    const dampingStates = new Float64Array(8);
    /** Each channel gets its own diffuser chain, slightly longer on the right, for width. */
    const diffusers = [
        1,
        1.13,
    ].flatMap((stretch, channelIndex) => {
        return diffuserMs.map((ms) => {
            return {
                channelIndex,
                line: new Float32Array(Math.round((ms * stretch * sampleRate) / 1000)),
                position: 0,
            };
        });
    });
    const predelaySamples = Math.max(1, Math.round((reverb.predelaySeconds ?? 0) * sampleRate));
    const predelayLeft = new Float32Array(predelaySamples);
    const predelayRight = new Float32Array(predelaySamples);
    const diffused = new Float64Array(2);
    const lowStates = new Float64Array(2);
    const mixed = new Float64Array(8);
    const linePositions = new Int32Array(8);

    for (let index = 0; index < buffer.left.length; index++) {
        const predelayPosition = index % predelaySamples;
        const delayedLeft = predelayLeft[predelayPosition] ?? 0;
        const delayedRight = predelayRight[predelayPosition] ?? 0;

        predelayLeft[predelayPosition] = buffer.left[index] ?? 0;
        predelayRight[predelayPosition] = buffer.right[index] ?? 0;
        lowStates[0] =
            (lowStates[0] ?? 0) + (delayedLeft - (lowStates[0] ?? 0)) * highpassCoefficient;
        lowStates[1] =
            (lowStates[1] ?? 0) + (delayedRight - (lowStates[1] ?? 0)) * highpassCoefficient;
        diffused[0] = delayedLeft - lowStates[0];
        diffused[1] = delayedRight - lowStates[1];

        for (const diffuser of diffusers) {
            const input = diffused[diffuser.channelIndex] ?? 0;
            const delayed = diffuser.line[diffuser.position] ?? 0;
            const written = input + delayed * diffuserGain;

            diffuser.line[diffuser.position] = written;
            diffuser.position = (diffuser.position + 1) % diffuser.line.length;
            diffused[diffuser.channelIndex] = delayed - written * diffuserGain;
        }

        let left = 0;
        let right = 0;

        for (let line = 0; line < 8; line++) {
            const lineBuffer = lines[line] ?? new Float32Array(1);
            const output = lineBuffer[linePositions[line] ?? 0] ?? 0;

            dampingStates[line] =
                (dampingStates[line] ?? 0) +
                (output - (dampingStates[line] ?? 0)) * dampingCoefficient;
            mixed[line] = (dampingStates[line] ?? 0) * (lineGains[line] ?? 0);

            if (line % 2) {
                right += line % 4 === 1 ? output : -output;
            } else {
                left += line % 4 === 0 ? output : -output;
            }
        }

        hadamard8(mixed);

        for (let line = 0; line < 8; line++) {
            const lineBuffer = lines[line] ?? new Float32Array(1);
            const position = linePositions[line] ?? 0;

            lineBuffer[position] = (mixed[line] ?? 0) + (diffused[line % 2] ?? 0);
            linePositions[line] = (position + 1) % lineBuffer.length;
        }

        buffer.left[index] = left / 2;
        buffer.right[index] = right / 2;
    }
}
