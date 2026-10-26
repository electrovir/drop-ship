import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {createGeneratedAudioUrl, parseGeneratedAudioUrl} from './generated-audio-url.js';

describe(parseGeneratedAudioUrl.name, () => {
    it('reads back the key of a generated audio url', () => {
        assert.strictEquals(
            parseGeneratedAudioUrl(createGeneratedAudioUrl('gun-shot-2')),
            'gun-shot-2',
        );
    });

    it('ignores real urls', () => {
        assert.isUndefined(parseGeneratedAudioUrl('https://example.com/gun-shot.wav'));
    });
});
