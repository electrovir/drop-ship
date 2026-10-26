import {type AssetLoader, type AssetLoadSession} from '@antha/asset';
import {AudioPlayer, createAnthaAudioMod} from '@antha/audio';
import {type AnthaEngine} from '@antha/engine';
import {loadAnthaAssets} from '@antha/entity-2d';
import {createAnthaFpsMod} from '@antha/fps';
import {
    createAnthaGraphics2dMod,
    createAnthaVirtualViewportMod,
    createVirtualViewportPixiOptions,
} from '@antha/graphics-2d';
import {createAnthaInputBindingsMod, createAnthaReadRawInputMod} from '@antha/input';
import {LocalPlayerPosition} from '@antha/util';
import {ensureErrorAndPrependMessage, randomString, SeededRandom} from '@augment-vir/common';
import {css} from 'element-vir';
import {createGameAudioMod} from '../audio/game-audio.mod.js';
import {soundEffectPlayer} from '../audio/game-sound-effect-player.js';
import {createSynthWorkerPool} from '../audio/playback/synth-worker-pool.js';
import {gameMenuMod, gameMenuNavMod} from '../menu/game-menu.mod.js';
import {gameSceneMod} from '../scene/game-scene.mod.js';
import {defaultBindings} from './default-bindings.js';
import {deployEnv, DeployEnv} from './deploy-env.js';
import {gameEntities} from './game-entities.js';
import {updateEntitiesMod} from './game-entity.mod.js';
import {type FullGameState} from './game-state.js';
import {gameUpdateMod} from './game-update.mod.js';
import {gameWorldSize} from './game-world.js';
import {inputConsumerMod} from './input-consumer.mod.js';
import {multiplayerLockstepMod} from './multiplayer-lockstep.mod.js';
import {anthaAutosaveMod, createDefaultGameSaveState, loadSaveDataAsset} from './save-data.js';

async function loadInitialGameAssets({
    assetLoader,
    engine,
    loadSession,
}: Readonly<{
    assetLoader: AssetLoader;
    engine: AnthaEngine;
    loadSession: AssetLoadSession;
}>) {
    try {
        await loadAnthaAssets(
            {
                assetLoader,
                assets: [
                    loadSaveDataAsset,
                ],
                entities: gameEntities,
            },
            {
                doNotUnload: true,
                loadSession,
            },
        );
        const loadedSaveState = await assetLoader.loadIndividualAsset({
            asset: loadSaveDataAsset,
        });

        if (loadedSaveState.loadError) {
            engine.log.error(loadedSaveState.loadError);
        }

        return loadedSaveState;
    } catch (error) {
        engine.log.error(ensureErrorAndPrependMessage(error, 'Failed to load game save state.'));

        return {
            loadError: ensureErrorAndPrependMessage(error, 'Failed to load game save state.'),
            saveState: createDefaultGameSaveState(),
        };
    }
}

/** Loads assets and installs the game mods so a new engine starts a playable session. */
export async function bootstrapGame({
    assetLoader,
    engine,
    loadSession,
    state,
}: Readonly<{
    assetLoader: AssetLoader;
    engine: AnthaEngine;
    loadSession: AssetLoadSession;
    state: Partial<FullGameState>;
}>) {
    engine.currentMods.push(
        createAnthaVirtualViewportMod({
            virtualHeight: gameWorldSize.height,
            virtualWidth: gameWorldSize.width,
        }),
    );
    const synthPool = createSynthWorkerPool({
        createWorker() {
            return new Worker(new URL('../audio/game-audio-worker.ts', import.meta.url), {
                type: 'module',
            });
        },
        sampleRate: 44_100,
        /** Leaves a core for the game itself. */
        workerCount: Math.max(1, Math.min(3, navigator.hardwareConcurrency - 1)),
    });
    state.audioPlayer = new AudioPlayer({
        fetch: synthPool.fetch,
    });
    /** Sound effects are requested before the music so they're ready first. */
    state.audioPlayer.loadFiles(soundEffectPlayer.getAllFiles()).catch((error: unknown) => {
        engine.log.error(ensureErrorAndPrependMessage(error, 'Failed to load sound effects.'));
    });
    const loadedSaveState = await loadInitialGameAssets({
        assetLoader,
        engine,
        loadSession,
    });
    state.saveState = loadedSaveState.saveState;
    state.bindingAssignments = defaultBindings;
    state.menuState = undefined;
    state.pausingPlayerIds = [];
    state.pauseRequest = undefined;
    /** Without a last pick, player one flies the first profile, which a fresh save names "Pilot 1". */
    const playerOneProfile =
        loadedSaveState.saveState.profiles.find((profile) => {
            return profile.id === loadedSaveState.saveState.lastProfileId;
        }) || loadedSaveState.saveState.profiles[0];
    state.localProfileIds = playerOneProfile
        ? {
              [LocalPlayerPosition.One]: playerOneProfile.id,
          }
        : {};
    state.seededRandom = SeededRandom.fromSeed(randomString());

    return {
        mods: [
            anthaAutosaveMod,
            createAnthaGraphics2dMod({
                extraCanvasWrapperStyles: css`
                    z-index: 0;
                `,
                pixiOptions: {
                    background: 'black',
                    ...createVirtualViewportPixiOptions(),
                },
            }),
            ...(deployEnv === DeployEnv.Dev
                ? [
                      createAnthaFpsMod({
                          debugFps: true,
                      }),
                  ]
                : []),
            createAnthaAudioMod(),
            createAnthaReadRawInputMod({
                deviceHandlerOptions: {
                    globalDeadZone: loadedSaveState.saveState.joystickDeadZone,
                },
            }),
            createAnthaInputBindingsMod(),
            updateEntitiesMod,
            multiplayerLockstepMod,
            gameUpdateMod,
            gameSceneMod,
            gameMenuNavMod,
            gameMenuMod,
            createGameAudioMod(synthPool),
            inputConsumerMod,
        ],
    };
}
