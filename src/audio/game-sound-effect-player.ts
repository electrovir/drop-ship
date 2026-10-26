import {GameAudioChannel} from './game-audio.js';
import {createSoundEffectPlayer} from './playback/sound-effect-player.js';
import {soundEffectConfigs} from './sound-effect.js';

/** Plays the game's sound effects on the effects channel. */
export const soundEffectPlayer = createSoundEffectPlayer({
    audioChannel: GameAudioChannel.Effects,
    effects: soundEffectConfigs,
});
