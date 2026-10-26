import {AssetLoader} from '@antha/asset';
import {AnthaEngine} from '@antha/engine';
import {EntityStore2d} from '@antha/entity-2d';
import {createMockPixi} from '@antha/graphics-2d';
import {emptyApiAndRoomConnectionState} from '@antha/multiplayer-core';
import {P2pLockStepMultiplayerController} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {assert, assertWrap} from '@augment-vir/assert';
import {ensureArray} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {InputConsumer, type FullGameState} from '../game-state/game-state.js';
import {
    multiplayerPacketHandlers,
    MultiplayerPacketType,
    type MultiplayerPacket,
} from '../game-state/multiplayer-packet.js';
import {RunPhase} from '../run/run-phase.js';
import {RunEntity} from '../run/run.entity.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {sendLocalControls} from './local-controls.js';
import {PlayerBinding} from './player-binding.js';
import {PlayerColor} from './player-profile.js';

/** Player one on the galaxy map, holding a fresh press of the travel button. */
async function testOnGalaxyMap(
    callback: (
        params: Readonly<{
            sendControls: (rawInputConsumer: InputConsumer) => MultiplayerPacket[];
        }>,
    ) => void,
) {
    const controller = new P2pLockStepMultiplayerController<MultiplayerPacket>({
        gameId: 'local-controls-test',
    });
    controller.startSingleplayer();
    const engine = new AnthaEngine<FullGameState>({
        hostElement: document.createElement('div'),
        initState: {
            multiplayerP2pLockStep: {
                connectionState: emptyApiAndRoomConnectionState,
                multiplayerController: controller,
            },
        },
        mods: [],
    });
    const entityStore = new EntityStore2d({
        assetLoader: new AssetLoader(),
        pixi: createMockPixi(),
        state: engine.state,
    });
    const localClientId = assertWrap.isDefined(controller.getClientId());

    engine.state.entityStore = entityStore;

    try {
        await entityStore.addEntity(RunEntity, {
            currentStarIndex: 0,
            earnedPieces: [],
            galaxySeed: 'local-controls-test',
            partProgress: [],
            phase: RunPhase.GalaxyMap,
            phaseElapsedMs: 0,
            runSeed: 'local-controls-test',
            selectedStarIndex: 0,
            spawnedEnemyCount: 0,
            systemTravelPx: 0,
            visitedStarIndexes: [
                0,
            ],
            waveIndex: 0,
            wavePlayerCount: 1,
        });
        await multiplayerPacketHandlers[MultiplayerPacketType.SpawnPlayer]({
            detail: {
                packet: {
                    grid: createStarterShipGrid(),
                    playerPosition: LocalPlayerPosition.One,
                    profile: {
                        color: PlayerColor.Cyan,
                        name: 'Pilot 1',
                    },
                    type: MultiplayerPacketType.SpawnPlayer,
                },
                sourceClientId: localClientId,
            },
            state: engine.state,
        });

        callback({
            sendControls(rawInputConsumer) {
                const sentPackets: MultiplayerPacket[] = [];

                controller.act = (packets) => {
                    sentPackets.push(...ensureArray(packets));
                };
                engine.state.rawInputConsumer = rawInputConsumer;
                engine.state.activeBindings = {
                    [LocalPlayerPosition.One]: {
                        [PlayerBinding.Travel]: {
                            actCount: 0,
                            holdDuration: {
                                milliseconds: 0,
                            },
                            lastActDuration: {
                                milliseconds: 0,
                            },
                            rawInputs: [],
                            value: 1,
                        },
                    },
                };
                sendLocalControls({
                    localClientId,
                    state: engine.state,
                });

                return sentPackets;
            },
        });
    } finally {
        controller.destroy();
        entityStore.destroy();
        await engine.reset();
    }
}

describe(sendLocalControls.name, () => {
    it('travels on a press read for the galaxy map', async () => {
        await testOnGalaxyMap(({sendControls}) => {
            assert.deepEquals(
                sendControls(InputConsumer.GalaxyMap).map((packet) => packet.type),
                [
                    MultiplayerPacketType.StarTravel,
                ],
            );
        });
    });

    it('ignores a press read while the pilot menu was still the input consumer', async () => {
        await testOnGalaxyMap(({sendControls}) => {
            assert.isEmpty(sendControls(InputConsumer.Menu));
        });
    });
});
