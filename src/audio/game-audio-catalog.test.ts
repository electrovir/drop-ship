import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {gameAudioCatalog} from './game-audio-catalog.js';
import {soundEffectPlayer} from './game-sound-effect-player.js';
import {parseGeneratedAudioUrl} from './playback/generated-audio-url.js';

describe('gameAudioCatalog', () => {
    it('has a score for every sound effect file the game plays', () => {
        const missingKeys = soundEffectPlayer
            .getAllFiles()
            .map((file) => parseGeneratedAudioUrl(file.sources[0]?.url || '') || '')
            .filter((key) => !gameAudioCatalog[key]);

        assert.isEmpty(missingKeys);
    });
});
