import {arrayToObject, createArray, getEnumValues} from '@augment-vir/common';
import {createSoundEffectKey} from './playback/generated-audio-url.js';
import {type SynthCatalog} from './playback/synth-catalog-server.js';
import {soundEffectScores} from './sound-effect-scores.js';
import {SoundEffect, soundEffectConfigs} from './sound-effect.js';

/** All of the game's generated sound effects. Music plays live instead, from `playScoreGraphs`. */
export const gameAudioCatalog: SynthCatalog = arrayToObject(
    getEnumValues(SoundEffect).flatMap((effect) => {
        return createArray(soundEffectConfigs[effect].variantCount ?? 1, (variant) => {
            return {
                effect,
                variant,
            };
        });
    }),
    ({effect, variant}) => {
        return {
            key: createSoundEffectKey({
                effect,
                variant,
            }),
            value() {
                return soundEffectScores[effect](variant);
            },
        };
    },
);
