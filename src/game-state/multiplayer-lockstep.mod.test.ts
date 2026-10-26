import {AssetLoader} from '@antha/asset';
import {AnthaEngine} from '@antha/engine';
import {EntityStore2d} from '@antha/entity-2d';
import {createMockPixi} from '@antha/graphics-2d';
import {
    createMultiplayerPlayerId,
    emptyApiAndRoomConnectionState,
    MultiplayerControllerClientStatusEvent,
    type ClientId,
} from '@antha/multiplayer-core';
import {
    MultiplayerControllerFrameEvent,
    P2pLockStepMultiplayerController,
} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {assert, assertWrap} from '@augment-vir/assert';
import {applyBrand, SeededRandom, selectFrom, type PartialWithUndefined} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {generateGalaxy, getConnectedStarIndexes} from '../galaxy/galaxy.js';
import {createNewPilotProgress, type RunProgress} from '../player/pilot-progress.js';
import {PlayerColor} from '../player/player-profile.js';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity} from '../run/run.entity.js';
import {createRandomPiece} from '../ship/piece-bag.js';
import {CellKind, Direction} from '../ship/ship-cell.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {getSortedShips} from '../ship/ship.entity.js';
import {type FullGameState} from './game-state.js';
import {multiplayerLockstepMod} from './multiplayer-lockstep.mod.js';
import {
    createStateSync,
    loadStateSync,
    MultiplayerPacketType,
    type MultiplayerPacket,
} from './multiplayer-packet.js';

const clientIds = {
    blue: applyBrand<ClientId>('c_blue'),
    green: applyBrand<ClientId>('c_green'),
};

const playerIds = {
    blue: createMultiplayerPlayerId({
        clientId: clientIds.blue,
        playerPosition: LocalPlayerPosition.One,
    }),
    green: createMultiplayerPlayerId({
        clientId: clientIds.green,
        playerPosition: LocalPlayerPosition.One,
    }),
};

function createSpawnPacket(playerPosition: LocalPlayerPosition) {
    return {
        grid: createStarterShipGrid(),
        playerPosition,
        profile: {
            color: PlayerColor.Cyan,
            name: `Pilot ${playerPosition}`,
        },
        type: MultiplayerPacketType.SpawnPlayer,
    } satisfies MultiplayerPacket;
}

function createMultiplayerFrameEvent({
    packets,
    sourceClientId,
}: Readonly<{
    packets: ReadonlyArray<MultiplayerPacket>;
    sourceClientId: ClientId;
}>) {
    return new MultiplayerControllerFrameEvent<MultiplayerPacket>({
        detail: {
            packets: packets.map((packet) => {
                return {
                    packet,
                    sourceClientId,
                };
            }),
        },
    });
}

/**
 * Creates a run that the blue and green clients have each joined with one ship, and that has
 * traveled from the galaxy map into its first build unless `isOnGalaxyMap` is set.
 */
async function createMultiplayerSimulation(
    {
        isOnGalaxyMap,
        progress,
        roomId,
    }: Readonly<
        PartialWithUndefined<{
            isOnGalaxyMap: boolean;
            progress: RunProgress;
            roomId: string;
        }>
    > = {
        roomId: 'test-room',
    },
) {
    const controller = new P2pLockStepMultiplayerController<MultiplayerPacket>({
        gameId: 'multiplayer-simulation-test',
    });

    controller.startSingleplayer();
    if (roomId) {
        Object.defineProperty(controller, 'roomId', {
            configurable: true,
            get() {
                return roomId;
            },
        });
    }

    const engine = new AnthaEngine<FullGameState>({
        hostElement: document.createElement('div'),
        initState: {
            localProfileIds: {},
            menuState: undefined,
            multiplayerP2pLockStep: {
                connectionState: emptyApiAndRoomConnectionState,
                multiplayerController: controller,
            },
            seededRandom: SeededRandom.fromSeed('multiplayer-simulation-test'),
        },
        mods: [
            multiplayerLockstepMod,
        ],
    });
    const entityStore = new EntityStore2d({
        assetLoader: new AssetLoader(),
        pixi: createMockPixi(),
        state: engine.state,
    });

    engine.state.entityStore = entityStore;

    engine.dispatch(
        createMultiplayerFrameEvent({
            packets: [
                createSpawnPacket(LocalPlayerPosition.One),
                {
                    progress: progress || createNewPilotProgress('multiplayer-simulation-test').run,
                    runSeed: 'multiplayer-simulation-test',
                    type: MultiplayerPacketType.StartRun,
                },
            ],
            sourceClientId: clientIds.blue,
        }),
    );
    engine.dispatch(
        createMultiplayerFrameEvent({
            packets: [
                createSpawnPacket(LocalPlayerPosition.One),
            ],
            sourceClientId: clientIds.green,
        }),
    );
    if (!isOnGalaxyMap) {
        engine.dispatch(
            createMultiplayerFrameEvent({
                packets: [
                    {
                        playerPosition: LocalPlayerPosition.One,
                        type: MultiplayerPacketType.StarTravel,
                    },
                ],
                sourceClientId: clientIds.blue,
            }),
        );
    }
    await engine.runSingleTick();

    if (!isOnGalaxyMap) {
        /** This engine doesn't step entities, so the jump to the new star is skipped. */
        findRunEntity(entityStore)?.startBuildPhase();
    }

    return {
        controller,
        engine,
        entityStore,
        state: engine.state,
        destroy() {
            controller.destroy();
            entityStore.destroy();
        },
    };
}

/** Gives the build a piece to move and place, since a new pilot hasn't earned any yet. */
function createProgressWithEarnedPiece() {
    return {
        ...createNewPilotProgress('multiplayer-simulation-test').run,
        earnedPieces: [
            createRandomPiece({
                kind: CellKind.Hull,
                random: SeededRandom.fromSeed('earned-piece'),
            }),
        ],
    };
}

function getShipPlayerIds(entityStore: Readonly<EntityStore2d>) {
    return getSortedShips(entityStore).map((ship) => ship.params.playerId);
}

describe(multiplayerLockstepMod.modName, () => {
    it('removes the players of lost peers', async () => {
        const simulation = await createMultiplayerSimulation();
        const lostClientId = applyBrand<ClientId>('c_lost');
        const lifecyclePackets: MultiplayerPacket[] = [];

        simulation.controller.listen(MultiplayerControllerFrameEvent, ({detail}) => {
            lifecyclePackets.push(
                ...detail.packets.map(({packet}) => {
                    return packet;
                }),
            );
        });

        try {
            simulation.engine.dispatch(
                new MultiplayerControllerClientStatusEvent({
                    detail: {
                        lostMember: lostClientId,
                    },
                }),
            );
            await simulation.engine.runSingleTick();
            simulation.controller.runFrame();

            assert.deepEquals(lifecyclePackets, [
                {
                    clientId: lostClientId,
                    type: MultiplayerPacketType.DespawnPlayers,
                },
            ]);
        } finally {
            simulation.destroy();
        }
    });

    it('drops out only the requested local player', async () => {
        const simulation = await createMultiplayerSimulation();

        try {
            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        createSpawnPacket(LocalPlayerPosition.Two),
                    ],
                    sourceClientId: clientIds.blue,
                }),
            );
            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            playerPosition: LocalPlayerPosition.Two,
                            type: MultiplayerPacketType.DespawnPlayer,
                        },
                    ],
                    sourceClientId: clientIds.blue,
                }),
            );
            await simulation.engine.runSingleTick();

            assert.deepEquals(getShipPlayerIds(simulation.entityStore), [
                playerIds.blue,
                playerIds.green,
            ]);
        } finally {
            simulation.destroy();
        }
    });

    it('starts a run on the galaxy map at the start star', async () => {
        const simulation = await createMultiplayerSimulation({
            isOnGalaxyMap: true,
        });

        try {
            const run = assertWrap.isDefined(findRunEntity(simulation.entityStore));

            assert.deepEquals(
                {
                    currentStarIndex: run.params.currentStarIndex,
                    isAnyShipBuilding: getSortedShips(simulation.entityStore).some(
                        (ship) => !!ship.params.build.activePiece,
                    ),
                    phase: run.params.phase,
                },
                {
                    currentStarIndex: run.getGalaxy().startStarIndex,
                    isAnyShipBuilding: false,
                    phase: RunPhase.GalaxyMap,
                },
            );
        } finally {
            simulation.destroy();
        }
    });

    it('resumes a saved run at the last visited star', async () => {
        const galaxy = generateGalaxy('multiplayer-simulation-test');
        const firstJumpStarIndex = assertWrap.isDefined(
            getConnectedStarIndexes({
                galaxy,
                starIndex: galaxy.startStarIndex,
            })[0],
        );
        const visitedStarIndexes = [
            galaxy.startStarIndex,
            firstJumpStarIndex,
        ];
        const simulation = await createMultiplayerSimulation({
            isOnGalaxyMap: true,
            progress: {
                earnedPieces: [],
                galaxySeed: 'multiplayer-simulation-test',
                partProgress: [],
                systemsCleared: 1,
                visitedStarIndexes,
            },
        });

        try {
            const run = assertWrap.isDefined(findRunEntity(simulation.entityStore));

            assert.deepEquals(
                selectFrom(run.params, {
                    currentStarIndex: true,
                    visitedStarIndexes: true,
                    waveIndex: true,
                }),
                {
                    currentStarIndex: firstJumpStarIndex,
                    visitedStarIndexes,
                    waveIndex: 1,
                },
            );
        } finally {
            simulation.destroy();
        }
    });

    it('restarts at the start star when the saved route no longer fits the galaxy', async () => {
        const galaxy = generateGalaxy('multiplayer-simulation-test');
        const simulation = await createMultiplayerSimulation({
            isOnGalaxyMap: true,
            progress: {
                earnedPieces: [],
                galaxySeed: 'multiplayer-simulation-test',
                partProgress: [],
                systemsCleared: 1,
                visitedStarIndexes: [
                    galaxy.startStarIndex,
                    galaxy.startStarIndex,
                ],
            },
        });

        try {
            const run = assertWrap.isDefined(findRunEntity(simulation.entityStore));

            assert.deepEquals(
                selectFrom(run.params, {
                    currentStarIndex: true,
                    visitedStarIndexes: true,
                }),
                {
                    currentStarIndex: galaxy.startStarIndex,
                    visitedStarIndexes: [
                        galaxy.startStarIndex,
                    ],
                },
            );
        } finally {
            simulation.destroy();
        }
    });

    it('builds every ship after traveling to a connected star', async () => {
        const simulation = await createMultiplayerSimulation({
            progress: createProgressWithEarnedPiece(),
            roomId: undefined,
        });

        try {
            const run = assertWrap.isDefined(findRunEntity(simulation.entityStore));

            assert.deepEquals(
                {
                    isEveryShipBuilding: getSortedShips(simulation.entityStore).every(
                        (ship) => !!ship.params.build.activePiece,
                    ),
                    isOnConnectedStar: getConnectedStarIndexes({
                        galaxy: run.getGalaxy(),
                        starIndex: run.getGalaxy().startStarIndex,
                    }).includes(run.params.currentStarIndex),
                    phase: run.params.phase,
                    shipPlayerIds: getShipPlayerIds(simulation.entityStore),
                },
                {
                    isEveryShipBuilding: true,
                    isOnConnectedStar: true,
                    phase: RunPhase.Build,
                    shipPlayerIds: [
                        playerIds.blue,
                        playerIds.green,
                    ],
                },
            );
        } finally {
            simulation.destroy();
        }
    });

    it('loads the host state into a joining peer', async () => {
        const hostSimulation = await createMultiplayerSimulation();
        const joiningSimulation = await createMultiplayerSimulation();

        try {
            hostSimulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            direction: Direction.Left,
                            playerPosition: LocalPlayerPosition.One,
                            type: MultiplayerPacketType.PieceMove,
                        },
                    ],
                    sourceClientId: clientIds.blue,
                }),
            );
            await hostSimulation.engine.runSingleTick();
            hostSimulation.state.seededRandom?.next();

            await loadStateSync({
                state: joiningSimulation.state,
                stateSync: createStateSync(hostSimulation.state),
            });

            assert.deepEquals(
                {
                    entityHash: joiningSimulation.entityStore.hashEntities(),
                    randomState: joiningSimulation.state.seededRandom?.exportState(),
                    shipPlayerIds: getShipPlayerIds(joiningSimulation.entityStore),
                },
                {
                    entityHash: hostSimulation.entityStore.hashEntities(),
                    randomState: hostSimulation.state.seededRandom?.exportState(),
                    shipPlayerIds: [
                        playerIds.blue,
                        playerIds.green,
                    ],
                },
            );
        } finally {
            hostSimulation.destroy();
            joiningSimulation.destroy();
        }
    });

    it('drops gameplay packets on every peer until each pausing player resumes', async () => {
        const simulation = await createMultiplayerSimulation({
            progress: createProgressWithEarnedPiece(),
            roomId: 'test-room',
        });
        const pieceMoveFrame = {
            packets: [
                {
                    direction: Direction.Left,
                    playerPosition: LocalPlayerPosition.One,
                    type: MultiplayerPacketType.PieceMove,
                },
            ],
            sourceClientId: clientIds.blue,
        } satisfies Parameters<typeof createMultiplayerFrameEvent>[0];

        try {
            const unpausedHash = simulation.entityStore.hashEntities();

            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            playerPositions: [
                                LocalPlayerPosition.One,
                            ],
                            type: MultiplayerPacketType.PauseSet,
                        },
                    ],
                    sourceClientId: clientIds.green,
                }),
            );
            simulation.engine.dispatch(createMultiplayerFrameEvent(pieceMoveFrame));
            await simulation.engine.runSingleTick();

            const pausedState = {
                entityHash: simulation.entityStore.hashEntities(),
                pausingPlayerIds: simulation.state.pausingPlayerIds,
            };

            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            playerPositions: [],
                            type: MultiplayerPacketType.PauseSet,
                        },
                    ],
                    sourceClientId: clientIds.green,
                }),
            );
            simulation.engine.dispatch(createMultiplayerFrameEvent(pieceMoveFrame));
            await simulation.engine.runSingleTick();

            assert.deepEquals(
                {
                    isMovedAfterResume: simulation.entityStore.hashEntities() !== unpausedHash,
                    pausedState,
                    resumedPausingPlayerIds: simulation.state.pausingPlayerIds,
                },
                {
                    isMovedAfterResume: true,
                    pausedState: {
                        entityHash: unpausedHash,
                        pausingPlayerIds: [
                            playerIds.green,
                        ],
                    },
                    resumedPausingPlayerIds: [],
                },
            );
        } finally {
            simulation.destroy();
        }
    });

    it('resumes when the pausing peer leaves', async () => {
        const simulation = await createMultiplayerSimulation();

        try {
            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            playerPositions: [
                                LocalPlayerPosition.One,
                            ],
                            type: MultiplayerPacketType.PauseSet,
                        },
                    ],
                    sourceClientId: clientIds.green,
                }),
            );
            simulation.engine.dispatch(
                createMultiplayerFrameEvent({
                    packets: [
                        {
                            clientId: clientIds.green,
                            type: MultiplayerPacketType.DespawnPlayers,
                        },
                    ],
                    sourceClientId: clientIds.blue,
                }),
            );
            await simulation.engine.runSingleTick();

            assert.deepEquals(simulation.state.pausingPlayerIds, []);
        } finally {
            simulation.destroy();
        }
    });

    it('simulates batched multiplayer frames individually', async () => {
        const batchedSimulation = await createMultiplayerSimulation();
        const separateSimulation = await createMultiplayerSimulation();
        const pieceMoveFrame = {
            packets: [
                {
                    direction: Direction.Left,
                    playerPosition: LocalPlayerPosition.One,
                    type: MultiplayerPacketType.PieceMove,
                },
            ],
            sourceClientId: clientIds.blue,
        } satisfies Parameters<typeof createMultiplayerFrameEvent>[0];
        const emptyFrame = {
            packets: [],
            sourceClientId: clientIds.blue,
        } satisfies Parameters<typeof createMultiplayerFrameEvent>[0];

        try {
            batchedSimulation.engine.dispatch(createMultiplayerFrameEvent(pieceMoveFrame));
            batchedSimulation.engine.dispatch(createMultiplayerFrameEvent(emptyFrame));
            await batchedSimulation.engine.runSingleTick();

            separateSimulation.engine.dispatch(createMultiplayerFrameEvent(pieceMoveFrame));
            await separateSimulation.engine.runSingleTick();
            separateSimulation.engine.dispatch(createMultiplayerFrameEvent(emptyFrame));
            await separateSimulation.engine.runSingleTick();

            assert.deepEquals(
                {
                    entityHash: batchedSimulation.entityStore.hashEntities(),
                    frameCount: batchedSimulation.controller.frameCount,
                    randomState: assertWrap
                        .isDefined(batchedSimulation.state.seededRandom)
                        .exportState(),
                },
                {
                    entityHash: separateSimulation.entityStore.hashEntities(),
                    frameCount: separateSimulation.controller.frameCount,
                    randomState: assertWrap
                        .isDefined(separateSimulation.state.seededRandom)
                        .exportState(),
                },
            );
            assert.strictEquals(batchedSimulation.controller.frameCount, 5);
        } finally {
            batchedSimulation.destroy();
            separateSimulation.destroy();
        }
    });
});
