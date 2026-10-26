import {defineAnthaMod} from '@antha/engine';
import {getObjectTypedEntries} from '@augment-vir/common';
import {type NavController} from 'device-navigation';
import {isGamePaused, type FullGameState} from '../game-state/game-state.js';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity} from '../run/run.entity.js';
import {createDropShipTheme, dropShipThemeGrid, MusicLayer} from './drop-ship-theme-song.js';
import {GameAudioChannel} from './game-audio.js';
import {soundEffectPlayer} from './game-sound-effect-player.js';
import {keepAudioRunning} from './playback/keep-audio-running.js';
import {createLayeredMusicMod} from './playback/layered-music.mod.js';
import {playScoreGraphs} from './playback/play-score-graphs.js';
import {type SynthWorkerPool} from './playback/synth-worker-pool.js';
import {SoundEffect} from './sound-effect.js';

const musicLayerByPhase: Readonly<Record<RunPhase, MusicLayer>> = {
    [RunPhase.GalaxyMap]: MusicLayer.Build,
    [RunPhase.Jump]: MusicLayer.Build,
    [RunPhase.Build]: MusicLayer.Build,
    [RunPhase.ToFly]: MusicLayer.Fly,
    [RunPhase.Fly]: MusicLayer.Fly,
    [RunPhase.Wrecked]: MusicLayer.Fly,
    [RunPhase.Reward]: MusicLayer.Fly,
    [RunPhase.Depart]: MusicLayer.Fly,
};

/** Plays menu sounds from the nav controller's events, so every menu gets them for free. */
function listenForMenuSounds({
    navController,
    state,
}: Readonly<{
    navController: NavController;
    state: Partial<FullGameState>;
}>) {
    function play(effect: SoundEffect) {
        soundEffectPlayer.play({
            audioPlayer: state.audioPlayer,
            effect,
        });
    }

    const removeListeners = [
        navController.listen('nav-navigate', ({detail}) => {
            play(detail.success ? SoundEffect.MenuMove : SoundEffect.Denied);
        }),
        navController.listen('nav-navigate-pibling', ({detail}) => {
            if (detail.success) {
                play(SoundEffect.MenuMove);
            }
        }),
        navController.listen('nav-enter', ({detail}) => {
            if (detail.success) {
                play(SoundEffect.MenuSelect);
            }
        }),
        navController.listen('nav-activate', ({detail}) => {
            if (detail.success) {
                play(SoundEffect.MenuSelect);
            }
        }),
        navController.listen('nav-exit', ({detail}) => {
            if (detail.success) {
                play(SoundEffect.MenuBack);
            }
        }),
    ];

    return () => {
        removeListeners.forEach((removeListener) => {
            removeListener();
        });
    };
}

/**
 * Runs all of the game's audio that isn't tied to a single entity: the adaptive music and menu
 * sounds. Also keeps the audio context running. Owns `synthPool` and destroys it on cleanup.
 */
export function createGameAudioMod(synthPool: Readonly<SynthWorkerPool>) {
    const themeScores = createDropShipTheme();
    const musicMod = createLayeredMusicMod({
        audioChannel: GameAudioChannel.Music,
        fadeSeconds: 30 / dropShipThemeGrid.bpm,
        layers: [
            MusicLayer.Build,
            MusicLayer.Fly,
        ],
        quantizeSeconds: 60 / dropShipThemeGrid.bpm,
        selectMix(state: Partial<FullGameState>) {
            const phase = state.entityStore && findRunEntity(state.entityStore)?.params.phase;

            return {
                isMuffled: !!state.menuState || isGamePaused(state),
                layer: phase ? musicLayerByPhase[phase] : MusicLayer.Build,
            };
        },
        async startLayers({context, destinations}) {
            return await playScoreGraphs({
                context,
                outputs: getObjectTypedEntries(destinations).map(
                    ([
                        layer,
                        destination,
                    ]) => {
                        return {
                            destination,
                            score: themeScores[layer],
                        };
                    },
                ),
            });
        },
    });
    const menuSounds: {
        navController: NavController | undefined;
        removeListeners: (() => void) | undefined;
    } = {
        navController: undefined,
        removeListeners: undefined,
    };
    const audioResumer: {
        audioPlayer: FullGameState['audioPlayer'] | undefined;
        stop: (() => void) | undefined;
    } = {
        audioPlayer: undefined,
        stop: undefined,
    };

    return defineAnthaMod<FullGameState>({
        modName: 'game-audio',
        async cleanup(params) {
            await musicMod.cleanup?.(params);
            menuSounds.removeListeners?.();
            menuSounds.navController = undefined;
            menuSounds.removeListeners = undefined;
            audioResumer.stop?.();
            audioResumer.audioPlayer = undefined;
            audioResumer.stop = undefined;
            synthPool.destroy();
        },
        async execute(params) {
            const {state} = params;

            if (audioResumer.audioPlayer !== state.audioPlayer) {
                audioResumer.stop?.();
                audioResumer.audioPlayer = state.audioPlayer;
                audioResumer.stop = state.audioPlayer
                    ? keepAudioRunning(state.audioPlayer.audioContext)
                    : undefined;
            }

            await musicMod.execute(params);

            if (menuSounds.navController !== state.navController) {
                menuSounds.removeListeners?.();
                menuSounds.navController = state.navController;
                menuSounds.removeListeners = state.navController
                    ? listenForMenuSounds({
                          navController: state.navController,
                          state,
                      })
                    : undefined;
            }
        },
    });
}
