import {createSeededNoise} from './synth-math.js';
import {type RenderedAudio} from './synth-score.js';

/**
 * Encodes rendered audio as a 16-bit PCM WAV file, with triangular dither so quiet tails fade out
 * smoothly instead of breaking into quantization buzz.
 */
export function encodeWav({channels, sampleRate}: Readonly<RenderedAudio>) {
    const frameCount = channels[0].length;
    const bytesPerFrame = channels.length * 2;
    const dataBytes = frameCount * bytesPerFrame;
    const view = new DataView(new ArrayBuffer(44 + dataBytes));
    const noise = createSeededNoise(1);

    [
        {
            offset: 0,
            text: 'RIFF',
        },
        {
            offset: 8,
            text: 'WAVE',
        },
        {
            offset: 12,
            text: 'fmt ',
        },
        {
            offset: 36,
            text: 'data',
        },
    ].forEach(({offset, text}) => {
        text.split('').forEach((character, index) => {
            view.setUint8(offset + index, character.codePointAt(0) ?? 0);
        });
    });

    view.setUint32(4, 36 + dataBytes, true);
    view.setUint32(16, 16, true);
    /** Uncompressed PCM. */
    view.setUint16(20, 1, true);
    view.setUint16(22, channels.length, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerFrame, true);
    view.setUint16(32, bytesPerFrame, true);
    view.setUint16(34, 16, true);
    view.setUint32(40, dataBytes, true);

    for (let frame = 0; frame < frameCount; frame++) {
        channels.forEach((channel, channelIndex) => {
            const dither = (noise() + noise()) / 2;
            const value = Math.round((channel[frame] ?? 0) * 32_767 + dither);

            view.setInt16(
                44 + frame * bytesPerFrame + channelIndex * 2,
                Math.max(-32_768, Math.min(32_767, value)),
                true,
            );
        });
    }

    return view.buffer;
}
