import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {encodeWav} from './encode-wav.js';

describe(encodeWav.name, () => {
    it('writes a 16-bit stereo header and clamps samples', () => {
        const view = new DataView(
            encodeWav({
                channels: [
                    new Float32Array([
                        0,
                        2,
                    ]),
                    new Float32Array([
                        0,
                        -2,
                    ]),
                ],
                sampleRate: 44_100,
            }),
        );
        function text(offset: number) {
            return String.fromCodePoint(
                ...[
                    0,
                    1,
                    2,
                    3,
                ].map((index) => view.getUint8(offset + index)),
            );
        }

        assert.deepEquals(
            {
                byteLength: view.byteLength,
                channels: view.getUint16(22, true),
                format: text(8),
                rightPeak: view.getInt16(50, true),
                leftPeak: view.getInt16(48, true),
                riff: text(0),
                sampleRate: view.getUint32(24, true),
            },
            {
                byteLength: 44 + 2 * 2 * 2,
                channels: 2,
                format: 'WAVE',
                rightPeak: -32_768,
                leftPeak: 32_767,
                riff: 'RIFF',
                sampleRate: 44_100,
            },
        );
    });
});
