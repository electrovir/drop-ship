import {type AudioPlayer} from '@antha/audio';
import {assert, check} from '@augment-vir/assert';
import {ensureArray} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {parseGeneratedAudioUrl} from './generated-audio-url.js';
import {createSoundEffectPlayer} from './sound-effect-player.js';

function createFakeAudioPlayer() {
    const playedKeys: (string | undefined)[] = [];

    return {
        audioPlayer: {
            isDestroyed: false,
            play({sources}: Parameters<AudioPlayer['play']>[0]) {
                const source = ensureArray(sources)[0];

                playedKeys.push(
                    parseGeneratedAudioUrl(check.isString(source) ? source : source?.url || ''),
                );
                return Promise.resolve(true);
            },
        },
        playedKeys,
    };
}

const soundEffectPlayer = createSoundEffectPlayer({
    audioChannel: 'effects',
    effects: {
        blip: {
            variantCount: 2,
        },
        boom: {
            minIntervalMs: 10_000,
        },
    },
});

describe(createSoundEffectPlayer.name, () => {
    it('plays variants in turn', () => {
        const {audioPlayer, playedKeys} = createFakeAudioPlayer();

        [
            1,
            2,
            3,
        ].forEach(() => {
            soundEffectPlayer.play({
                audioPlayer,
                effect: 'blip',
            });
        });

        assert.deepEquals(playedKeys, [
            'blip-0',
            'blip-1',
            'blip-0',
        ]);
    });

    it('drops plays inside the minimum interval', () => {
        const {audioPlayer, playedKeys} = createFakeAudioPlayer();

        [
            1,
            2,
        ].forEach(() => {
            soundEffectPlayer.play({
                audioPlayer,
                effect: 'boom',
            });
        });

        assert.deepEquals(playedKeys, [
            'boom-0',
        ]);
    });

    it('lists every variant for preloading', () => {
        assert.deepEquals(
            soundEffectPlayer
                .getAllFiles()
                .map((file) => parseGeneratedAudioUrl(file.sources[0]?.url || '')),
            [
                'blip-0',
                'blip-1',
                'boom-0',
            ],
        );
    });
});
