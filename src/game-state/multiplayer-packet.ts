import {type SerializedEntity2d} from '@antha/entity-2d';
import {
    createMultiplayerPlayerId,
    extractMultiplayerPlayerIdParts,
    multiplayerIdShapes,
    type ClientId,
    type MultiplayerPlayerId,
} from '@antha/multiplayer-core';
import {type MultiplayerFramePacket} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {assertWrap} from '@augment-vir/assert';
import {
    awaitedForEach,
    SeededRandom,
    type MaybePromise,
    type SeededRandomState,
} from '@augment-vir/common';
import {defineShape, enumShape, exactShape, unionShape} from 'object-shape-tester';
import {findConnectedStarClosestToCenter, generateGalaxy, isGalaxyRoute} from '../galaxy/galaxy.js';
import {createPartProgress} from '../part/part-progress.js';
import {runProgressShape} from '../player/pilot-progress.js';
import {sanitizePlayerProfileName, sharedPlayerProfileShape} from '../player/player-profile.js';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity, RunEntity} from '../run/run.entity.js';
import {createFinishedShipBuild} from '../ship/ship-build.js';
import {Direction} from '../ship/ship-cell.js';
import {createStarterShipGrid, shipGridShape} from '../ship/ship-grid.js';
import {findShip, getSortedShips, ShipEntity} from '../ship/ship.entity.js';
import {gameEntities} from './game-entities.js';
import {type FullGameState} from './game-state.js';

export const maxPlayerCount = 4;

export enum MultiplayerPacketType {
    /** Removes a single local player that dropped out. */
    DespawnPlayer = 'despawn-player',
    /** Removes every player owned by a peer that has left the session. */
    DespawnPlayers = 'despawn-players',
    /** Moves a player's active piece one cell, in ship space. */
    PieceMove = 'piece-move',
    /** Places a player's active piece onto their ship, if it fits there. */
    PiecePlace = 'piece-place',
    PieceRotate = 'piece-rotate',
    /** Marks a player as done building. */
    ShipReady = 'ship-ready',
    /** Swaps a player's active piece for the next offered piece. */
    PieceSwap = 'piece-swap',
    /** Takes back the last piece a player placed this build. */
    PieceUndo = 'piece-undo',
    /** Replaces which of a peer's local players are pausing the game. */
    PauseSet = 'pause-set',
    /** Sets a player's steering, which stays until the next steer packet. */
    ShipSteer = 'ship-steer',
    /** Creates a player, triggered by a local player picking a profile. */
    SpawnPlayer = 'spawn-player',
    /** Moves the galaxy map cursor to a star connected to the current star. */
    StarSelect = 'star-select',
    /** Travels to the star under the galaxy map cursor. */
    StarTravel = 'star-travel',
    /** Starts or resumes a run with every current player. */
    StartRun = 'start-run',
}

const playerPositionShape = enumShape(LocalPlayerPosition);

/** Packets come from other peers, so they are validated before they're handled. */
export const multiplayerPacketShape = unionShape(
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.DespawnPlayer),
    }),
    defineShape({
        clientId: multiplayerIdShapes.client(),
        type: exactShape(MultiplayerPacketType.DespawnPlayers),
    }),
    defineShape({
        direction: enumShape(Direction),
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.PieceMove),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.PiecePlace),
    }),
    defineShape({
        isClockwise: false,
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.PieceRotate),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.ShipReady),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.PieceSwap),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.PieceUndo),
    }),
    defineShape({
        playerPositions: [
            playerPositionShape,
        ],
        type: exactShape(MultiplayerPacketType.PauseSet),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        steering: {
            x: 0,
            y: 0,
        },
        type: exactShape(MultiplayerPacketType.ShipSteer),
    }),
    defineShape({
        grid: shipGridShape,
        playerPosition: playerPositionShape,
        profile: sharedPlayerProfileShape,
        type: exactShape(MultiplayerPacketType.SpawnPlayer),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        starIndex: 0,
        type: exactShape(MultiplayerPacketType.StarSelect),
    }),
    defineShape({
        playerPosition: playerPositionShape,
        type: exactShape(MultiplayerPacketType.StarTravel),
    }),
    defineShape({
        /** A run with no visited stars starts fresh, with starter ships, from the galaxy's edge. */
        progress: runProgressShape,
        runSeed: '',
        type: exactShape(MultiplayerPacketType.StartRun),
    }),
);

/** Defines every action payload peers may send through the lock-step controller. */
export type MultiplayerPacket = typeof multiplayerPacketShape.runtimeType;

/** Carries a complete entity and random-state snapshot to a newly connected peer. */
export type MultiplayerStateForSync = {
    entities: SerializedEntity2d[];
    pausingPlayerIds: MultiplayerPlayerId[];
    randomState: SeededRandomState;
};

/** Creates a serializable snapshot so a joining player can match the current game. */
export function createStateSync(state: Partial<FullGameState>): MultiplayerStateForSync {
    if (!state.seededRandom) {
        throw new Error('Missing seeded random: cannot sync multiplayer state.');
    } else if (state.entityStore) {
        return {
            entities: state.entityStore.createSnapshot(),
            pausingPlayerIds: state.pausingPlayerIds || [],
            randomState: state.seededRandom.exportState(),
        };
    } else {
        throw new Error('Missing entity store: cannot sync multiplayer state.');
    }
}

/**
 * Replaces a peer's entities and random state with the host's. Every peer runs this, the host
 * included, so each one rebuilds its entities the same way.
 */
export async function loadStateSync({
    state,
    stateSync,
}: Readonly<{
    state: Partial<FullGameState>;
    stateSync: Readonly<MultiplayerStateForSync>;
}>) {
    if (!state.entityStore) {
        throw new Error('Cannot load multiplayer state: no entity store exists.');
    }

    state.seededRandom = SeededRandom.fromState(stateSync.randomState);
    state.pausingPlayerIds = [
        ...stateSync.pausingPlayerIds,
    ];
    state.entityStore.registerEntities({
        entities: gameEntities,
    });

    await state.entityStore.loadSnapshot(stateSync.entities);
}

function getEntityStore(state: Partial<FullGameState>) {
    if (!state.entityStore) {
        throw new Error('Cannot handle packet: no entity store exists.');
    }

    return state.entityStore;
}

/** Finds the ship of the player that sent `detail`, so peers can only control their own players. */
function findSourceShip({
    detail,
    state,
}: Readonly<{
    detail: Readonly<
        MultiplayerFramePacket<
            Readonly<{
                playerPosition: LocalPlayerPosition;
            }>
        >
    >;
    state: Partial<FullGameState>;
}>) {
    const playerId = createMultiplayerPlayerId({
        clientId: detail.sourceClientId,
        playerPosition: detail.packet.playerPosition,
    });
    const ship = findShip({
        entityStore: getEntityStore(state),
        playerId,
    });

    if (!ship) {
        throw new Error(`Player '${playerId}' does not exist.`);
    }

    return ship;
}

async function addShip({
    grid,
    playerId,
    profile,
    state,
}: Readonly<
    Pick<ShipEntity['params'], 'grid' | 'playerId' | 'profile'> & {
        state: Partial<FullGameState>;
    }
>) {
    return await getEntityStore(state).addEntity(ShipEntity, {
        build: createFinishedShipBuild(),
        fly: {
            gunElapsedMs: 0,
            laserBeams: [],
            shields: [],
            steering: {
                x: 0,
                y: 0,
            },
            x: 0,
            y: 0,
        },
        grid,
        launchGrid: grid,
        playerId,
        profile,
    });
}

function removeClientPlayerIds({
    clientId,
    playerIds,
}: Readonly<{
    clientId: ClientId;
    playerIds: ReadonlyArray<MultiplayerPlayerId>;
}>) {
    return playerIds.filter((playerId) => {
        return (
            extractMultiplayerPlayerIdParts({
                playerId,
            }).clientId !== clientId
        );
    });
}

/**
 * Whether each packet still applies while the game is paused. Packets that change the action are
 * dropped, on every peer alike, so nothing moves while paused. Joining, leaving, and restarting
 * still work from the menus that pause the game.
 */
export const isPacketAllowedWhilePaused: Readonly<Record<MultiplayerPacketType, boolean>> = {
    [MultiplayerPacketType.DespawnPlayer]: true,
    [MultiplayerPacketType.DespawnPlayers]: true,
    [MultiplayerPacketType.PauseSet]: true,
    [MultiplayerPacketType.PieceMove]: false,
    [MultiplayerPacketType.PiecePlace]: false,
    [MultiplayerPacketType.PieceRotate]: false,
    [MultiplayerPacketType.PieceSwap]: false,
    [MultiplayerPacketType.PieceUndo]: false,
    [MultiplayerPacketType.ShipReady]: false,
    [MultiplayerPacketType.ShipSteer]: false,
    [MultiplayerPacketType.SpawnPlayer]: true,
    [MultiplayerPacketType.StarSelect]: false,
    [MultiplayerPacketType.StarTravel]: false,
    [MultiplayerPacketType.StartRun]: true,
};

export const multiplayerPacketHandlers = {
    [MultiplayerPacketType.DespawnPlayer]({detail, state}) {
        findShip({
            entityStore: getEntityStore(state),
            playerId: createMultiplayerPlayerId({
                clientId: detail.sourceClientId,
                playerPosition: detail.packet.playerPosition,
            }),
        })?.immediatelyDestroy();
    },
    [MultiplayerPacketType.DespawnPlayers]({detail, state}) {
        /** A peer that left can never resume the game itself. */
        state.pausingPlayerIds = removeClientPlayerIds({
            clientId: detail.packet.clientId,
            playerIds: state.pausingPlayerIds || [],
        });
        getSortedShips(getEntityStore(state)).forEach((ship) => {
            if (
                extractMultiplayerPlayerIdParts({
                    playerId: ship.params.playerId,
                }).clientId === detail.packet.clientId
            ) {
                ship.immediatelyDestroy();
            }
        });
    },
    [MultiplayerPacketType.PauseSet]({detail, state}) {
        state.pausingPlayerIds = [
            ...removeClientPlayerIds({
                clientId: detail.sourceClientId,
                playerIds: state.pausingPlayerIds || [],
            }),
            ...detail.packet.playerPositions.map((playerPosition) => {
                return createMultiplayerPlayerId({
                    clientId: detail.sourceClientId,
                    playerPosition,
                });
            }),
        ];
    },
    [MultiplayerPacketType.PieceMove]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).moveActivePiece(detail.packet.direction);
    },
    [MultiplayerPacketType.PiecePlace]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).placeActivePiece();
    },
    [MultiplayerPacketType.PieceRotate]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).rotateActivePiece(detail.packet.isClockwise);
    },
    [MultiplayerPacketType.ShipReady]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).finishBuild();
    },
    [MultiplayerPacketType.PieceSwap]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).swapActivePiece();
    },
    [MultiplayerPacketType.PieceUndo]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).undoPlacement();
    },
    [MultiplayerPacketType.ShipSteer]({detail, state}) {
        findSourceShip({
            detail,
            state,
        }).steer(detail.packet.steering);
    },
    [MultiplayerPacketType.StarSelect]({detail, state}) {
        findSourceShip({
            detail,
            state,
        });
        findRunEntity(getEntityStore(state))?.selectStar(detail.packet.starIndex);
    },
    [MultiplayerPacketType.StarTravel]({detail, state}) {
        findSourceShip({
            detail,
            state,
        });
        findRunEntity(getEntityStore(state))?.travelToSelectedStar();
    },
    async [MultiplayerPacketType.SpawnPlayer]({detail, state}) {
        const entityStore = getEntityStore(state);
        const playerId = createMultiplayerPlayerId({
            clientId: detail.sourceClientId,
            playerPosition: detail.packet.playerPosition,
        });
        const ships = getSortedShips(entityStore);

        if (
            ships.length >= maxPlayerCount ||
            findShip({
                entityStore,
                playerId,
            })
        ) {
            return;
        }

        const ship = await addShip({
            grid: detail.packet.grid,
            playerId,
            profile: {
                ...detail.packet.profile,
                name: sanitizePlayerProfileName({
                    fallbackName: `Pilot ${ships.length + 1}`,
                    name: detail.packet.profile.name,
                }),
            },
            state,
        });

        findRunEntity(entityStore)?.prepareJoiningShip(ship);
    },
    async [MultiplayerPacketType.StartRun]({detail, state}) {
        const entityStore = getEntityStore(state);
        const progress = detail.packet.progress;
        const isFreshRun = !progress.visitedStarIndexes.length;
        const players = getSortedShips(entityStore).map((ship) => {
            return {
                grid: isFreshRun ? createStarterShipGrid() : ship.params.grid,
                playerId: ship.params.playerId,
                profile: ship.params.profile,
            };
        });
        const galaxy = generateGalaxy(progress.galaxySeed);
        const visitedStarIndexes = isGalaxyRoute({
            galaxy,
            starIndexes: progress.visitedStarIndexes,
        })
            ? progress.visitedStarIndexes
            : [
                  galaxy.startStarIndex,
              ];
        const currentStarIndex = assertWrap.isDefined(visitedStarIndexes.at(-1));

        entityStore.destroyAllEntities();
        state.seededRandom = SeededRandom.fromSeed(detail.packet.runSeed);

        const run = await entityStore.addEntity(RunEntity, {
            currentStarIndex,
            earnedPieces: progress.earnedPieces,
            galaxySeed: progress.galaxySeed,
            partProgress: createPartProgress({
                random: state.seededRandom,
                saved: progress.partProgress,
            }),
            phase: RunPhase.GalaxyMap,
            phaseElapsedMs: 0,
            runSeed: detail.packet.runSeed,
            selectedStarIndex: findConnectedStarClosestToCenter({
                galaxy,
                starIndex: currentStarIndex,
            }),
            spawnedEnemyCount: 0,
            systemTravelPx: 0,
            visitedStarIndexes,
            waveIndex: progress.systemsCleared,
            wavePlayerCount: 0,
        });

        await awaitedForEach(players, async (player) => {
            await addShip({
                ...player,
                state,
            });
        });

        run.startGalaxyMap();
    },
} satisfies Readonly<{
    [PacketType in MultiplayerPacketType]: (
        params: Readonly<{
            detail: Readonly<
                MultiplayerFramePacket<
                    Extract<
                        MultiplayerPacket,
                        {
                            type: PacketType;
                        }
                    >
                >
            >;
            state: Partial<FullGameState>;
        }>,
    ) => MaybePromise<void>;
}> as Readonly<
    Record<
        MultiplayerPacketType,
        (
            params: Readonly<{
                detail: Readonly<MultiplayerFramePacket<MultiplayerPacket>>;
                state: Partial<FullGameState>;
            }>,
        ) => MaybePromise<void>
    >
>;
