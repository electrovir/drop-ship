import {emptyApiAndRoomConnectionState} from '@antha/multiplayer-core';
import {
    MultiplayerControllerFrameEvent,
    P2pLockStepMultiplayerController,
    type MultiplayerFramePacket,
} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {assert, assertWrap} from '@augment-vir/assert';
import {wait} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {createNewPilotProgress} from '../player/pilot-progress.js';
import {PlayerColor, type PlayerProfile} from '../player/player-profile.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {type FullGameState} from './game-state.js';
import {MultiplayerPacketType, type MultiplayerPacket} from './multiplayer-packet.js';
import {
    createMultiplayerError,
    startLocalGame,
    startMultiplayerGame,
} from './multiplayer-session.js';
import {createDefaultGameSaveState} from './save-data.js';

const testProfiles: ReadonlyArray<PlayerProfile> = [
    {
        color: PlayerColor.Cyan,
        id: 'first-profile',
        name: 'First pilot',
        progress: {
            ...createNewPilotProgress('first-galaxy'),
            shipGrid: {
                cells: [],
            },
        },
    },
    {
        color: PlayerColor.Pink,
        id: 'second-profile',
        name: 'Second pilot',
        progress: createNewPilotProgress('second-galaxy'),
    },
];

/**
 * Creates game state with a singleplayer-ready controller, and collects every frame that delivers
 * packets.
 */
function createTestSession({
    gameId,
    localProfileIds,
}: Readonly<{
    gameId: string;
    localProfileIds: FullGameState['localProfileIds'];
}>) {
    const controller = new P2pLockStepMultiplayerController<MultiplayerPacket>({
        frameDuration: {
            milliseconds: 1,
        },
        gameId,
    });
    const gameState: Partial<FullGameState> = {
        localProfileIds,
        multiplayerP2pLockStep: {
            connectionState: emptyApiAndRoomConnectionState,
            multiplayerController: controller,
        },
        saveState: {
            ...createDefaultGameSaveState(),
            profiles: [
                ...testProfiles,
            ],
        },
    };
    const receivedFrames: Array<ReadonlyArray<MultiplayerFramePacket<MultiplayerPacket>>> = [];

    controller.listen(MultiplayerControllerFrameEvent, ({detail}) => {
        if (detail.packets.length) {
            receivedFrames.push(detail.packets);
        }
    });

    return {
        controller,
        gameState,
        receivedFrames,
    };
}

describe(startLocalGame.name, () => {
    it('spawns each local player that picked a profile before starting the run', async () => {
        const {controller, gameState, receivedFrames} = createTestSession({
            gameId: 'drop-ship-start-local-game-test',
            localProfileIds: {
                [LocalPlayerPosition.One]: 'first-profile',
            },
        });

        try {
            startLocalGame(gameState);
            const clientId = assertWrap.isDefined(controller.getClientId());

            await wait({
                milliseconds: 5,
            });

            const [
                frame,
            ] = assertWrap.isLengthExactly(receivedFrames, 1);
            const [
                spawnPacket,
                startRunPacket,
            ] = assertWrap.isLengthExactly(frame, 2);

            assert.deepEquals(spawnPacket, {
                packet: {
                    grid: {
                        cells: [],
                    },
                    playerPosition: LocalPlayerPosition.One,
                    profile: {
                        color: PlayerColor.Cyan,
                        name: 'First pilot',
                    },
                    type: MultiplayerPacketType.SpawnPlayer,
                },
                sourceClientId: clientId,
            });
            assert.deepEquals(startRunPacket.packet, {
                progress: createNewPilotProgress('first-galaxy').run,
                runSeed: assertWrap.isDefined(
                    startRunPacket.packet.type === MultiplayerPacketType.StartRun
                        ? startRunPacket.packet.runSeed
                        : undefined,
                ),
                type: MultiplayerPacketType.StartRun,
            });
        } finally {
            controller.destroy();
        }
    });
});

describe(startMultiplayerGame.name, () => {
    it('queues every local player whose picked profile still exists', async () => {
        const {controller, gameState, receivedFrames} = createTestSession({
            gameId: 'drop-ship-start-multiplayer-game-test',
            localProfileIds: {
                [LocalPlayerPosition.One]: 'first-profile',
                [LocalPlayerPosition.Two]: 'deleted-profile',
                [LocalPlayerPosition.Three]: 'second-profile',
            },
        });

        controller.startSingleplayer();
        const clientId = assertWrap.isDefined(controller.getClientId());

        try {
            startMultiplayerGame(gameState);

            await wait({
                milliseconds: 5,
            });

            assert.deepEquals(receivedFrames, [
                [
                    {
                        packet: {
                            grid: createStarterShipGrid(),
                            playerPosition: LocalPlayerPosition.One,
                            profile: {
                                color: PlayerColor.Cyan,
                                name: 'First pilot',
                            },
                            type: MultiplayerPacketType.SpawnPlayer,
                        },
                        sourceClientId: clientId,
                    },
                    {
                        packet: {
                            grid: createStarterShipGrid(),
                            playerPosition: LocalPlayerPosition.Three,
                            profile: {
                                color: PlayerColor.Pink,
                                name: 'Second pilot',
                            },
                            type: MultiplayerPacketType.SpawnPlayer,
                        },
                        sourceClientId: clientId,
                    },
                ],
            ]);
        } finally {
            controller.destroy();
        }
    });
});

describe(createMultiplayerError.name, () => {
    it('retains an original error while adding the multiplayer context', () => {
        const originalError = new Error('Room is unavailable.');
        const multiplayerError = createMultiplayerError(originalError);

        assert.strictEquals(multiplayerError, originalError);
        assert.strictEquals(multiplayerError.message, 'Multiplayer failed: Room is unavailable.');
    });
});
