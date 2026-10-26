import {AssetLoader} from '@antha/asset';
import {AnthaEngine, ModExecutionTriggerType, type ModInstanceId} from '@antha/engine';
import {EntityStore2d} from '@antha/entity-2d';
import {createMockPixi} from '@antha/graphics-2d';
import {createMultiplayerPlayerId, type ClientId} from '@antha/multiplayer-core';
import {LocalPlayerPosition} from '@antha/util';
import {assert, assertWrap} from '@augment-vir/assert';
import {
    applyBrand,
    awaitedBlockingMap,
    awaitedForEach,
    createArray,
    SeededRandom,
    selectFrom,
} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {BulletEntity, BulletSide} from '../bullet/bullet.entity.js';
import {EnemyKind} from '../enemy/enemy-kind.js';
import {createEnemyGrid, EnemyEntity, getMaxEnemyBulletCount} from '../enemy/enemy.entity.js';
import {FragmentEntity} from '../fragment/fragment.entity.js';
import {
    createPartProgress,
    getFragmentsNeeded,
    specialFragmentWeight,
} from '../part/part-progress.js';
import {PlayerColor} from '../player/player-profile.js';
import {debrisLifetimeMs} from '../ship/debris.entity.js';
import {getShieldCapacity, ShieldOwner} from '../ship/shield.js';
import {createFinishedShipBuild} from '../ship/ship-build.js';
import {CellKind, Direction, maxCellHp} from '../ship/ship-cell.js';
import {getCellWorldCenter, laserPulseMs} from '../ship/ship-fly.js';
import {cockpitPosition, createStarterShipGrid} from '../ship/ship-grid.js';
import {ShipEntity} from '../ship/ship.entity.js';
import {jumpMs, RunPhase} from './run-phase.js';
import {RunEntity} from './run.entity.js';

const baseRunParams: RunEntity['params'] = {
    currentStarIndex: 0,
    earnedPieces: [],
    galaxySeed: 'run-entity-test',
    partProgress: [],
    phase: RunPhase.Fly,
    phaseElapsedMs: 0,
    runSeed: 'run-entity-test',
    selectedStarIndex: 0,
    spawnedEnemyCount: 0,
    systemTravelPx: 0,
    visitedStarIndexes: [
        0,
    ],
    waveIndex: 0,
    wavePlayerCount: 1,
};

const baseEnemyParams: EnemyEntity['params'] = {
    ageMs: 0,
    contactCooldownMs: 0,
    fireCooldownMs: 0,
    fireIntervalMultiplier: 1,
    grid: createEnemyGrid({
        difficulty: 0,
        kind: EnemyKind.Straight,
    }),
    kind: EnemyKind.Straight,
    shields: [],
    spawnX: 300,
    speedMultiplier: 1,
    velocityX: 0,
    velocityY: 0,
    x: 300,
    y: 300,
};

async function testWithEntityStore(
    callback: (
        params: Readonly<{
            entityStore: EntityStore2d;
            update: (msSinceLastExecute: number) => Promise<void>;
        }>,
    ) => Promise<void>,
) {
    const engine = new AnthaEngine();

    engine.state.seededRandom = SeededRandom.fromSeed('run-entity-test');
    const entityStore = new EntityStore2d({
        assetLoader: new AssetLoader(),
        pixi: createMockPixi(),
        state: engine.state,
    });

    try {
        await callback({
            entityStore,
            async update(msSinceLastExecute) {
                await entityStore.updateAllEntities({
                    currentTick: 0,
                    engine,
                    executionTrigger: {
                        type: ModExecutionTriggerType.Tick,
                    },
                    hostElement: document.createElement('div'),
                    lastExecution: undefined,
                    modInstanceId: applyBrand<ModInstanceId>('run-entity-test'),
                    msSinceLastExecute,
                    state: engine.state,
                    ticksSinceLastExecute: 0,
                    trigger: undefined,
                });
            },
        });
    } finally {
        entityStore.destroy();
    }
}

/** Adds a flying run with one ship, `travelLeftPx` short of the system's star. */
async function addFlyingRun({
    entityStore,
    travelLeftPx,
}: Readonly<{
    entityStore: EntityStore2d;
    travelLeftPx: number;
}>) {
    const run = await entityStore.addEntity(
        RunEntity,
        /** The store keeps the given object as the entity's params, which the run then changes. */
        structuredClone(baseRunParams),
    );

    run.params.systemTravelPx = run.getWave().starDistancePx - travelLeftPx;
    /** Skips the wave's spawns so only the test's enemies are flying. */
    run.params.spawnedEnemyCount = run.getWave().spawns.length;

    await entityStore.addEntity(ShipEntity, {
        build: createFinishedShipBuild(),
        fly: {
            gunElapsedMs: 0,
            laserBeams: [],
            shields: [],
            steering: {
                x: 0,
                y: 0,
            },
            x: 1500,
            y: 900,
        },
        grid: createStarterShipGrid(),
        launchGrid: createStarterShipGrid(),
        playerId: createMultiplayerPlayerId({
            clientId: applyBrand<ClientId>('c_test'),
            playerPosition: LocalPlayerPosition.One,
        }),
        profile: {
            color: PlayerColor.Cyan,
            name: 'Pilot 1',
        },
    });

    return run;
}

describe(RunEntity.name, () => {
    it('destroys an enemy whose core is hit, dropping every part as a fragment', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });
            await entityStore.addEntity(EnemyEntity, structuredClone(baseEnemyParams));
            await entityStore.addEntity(BulletEntity, {
                ageMs: 0,
                damage: 1,
                isMissile: false,
                side: BulletSide.Player,
                velocityX: 0,
                velocityY: 0,
                x: 300,
                y: 300,
            });

            await update(0);

            assert.deepEquals(
                {
                    enemyCount: entityStore.getEntities(EnemyEntity).size,
                    fragmentKinds: [
                        ...entityStore.getEntities(FragmentEntity),
                    ].map((fragment) => fragment.params.kind),
                },
                {
                    enemyCount: 0,
                    fragmentKinds: [
                        CellKind.Cockpit,
                        CellKind.Thruster,
                        CellKind.Thruster,
                        CellKind.Thruster,
                        CellKind.Hull,
                        CellKind.Hull,
                        CellKind.Hull,
                        CellKind.Hull,
                    ],
                },
            );
        });
    });

    it('holds enemy fire while the enemy bullet cap is reached', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            await entityStore.addEntity(EnemyEntity, {
                ...structuredClone(baseEnemyParams),
                grid: createEnemyGrid({
                    difficulty: 0,
                    kind: EnemyKind.Shooter,
                }),
                kind: EnemyKind.Shooter,
            });
            await awaitedForEach(
                createArray(getMaxEnemyBulletCount(run.getSystemDifficulty()), () => undefined),
                async () => {
                    await entityStore.addEntity(BulletEntity, {
                        ageMs: 0,
                        damage: 1,
                        isMissile: false,
                        side: BulletSide.Enemy,
                        velocityX: 0,
                        velocityY: 0,
                        x: 10,
                        y: 10,
                    });
                },
            );
            await update(0);

            assert.isLengthExactly(
                [
                    ...entityStore.getEntities(BulletEntity),
                ].filter((bullet) => bullet.params.side === BulletSide.Enemy),
                getMaxEnemyBulletCount(run.getSystemDifficulty()),
            );
        });
    });

    it('caps all enemy bullets together, even within one volley', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            await awaitedForEach(
                [
                    EnemyKind.Boss,
                    EnemyKind.Boss,
                ],
                async (kind) => {
                    await entityStore.addEntity(EnemyEntity, {
                        ...structuredClone(baseEnemyParams),
                        grid: createEnemyGrid({
                            difficulty: 0,
                            kind,
                        }),
                        kind,
                    });
                },
            );
            await update(0);

            assert.isLengthExactly(
                [
                    ...entityStore.getEntities(BulletEntity),
                ].filter((bullet) => bullet.params.side === BulletSide.Enemy),
                getMaxEnemyBulletCount(run.getSystemDifficulty()),
            );
        });
    });

    it('breaks off a part hit by a player bullet, dropping its fragment', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            const enemy = await entityStore.addEntity(
                EnemyEntity,
                structuredClone(baseEnemyParams),
            );
            const partCell = assertWrap.isDefined(
                enemy.params.grid.cells.find((cell) => cell.kind === CellKind.Thruster),
            );

            await entityStore.addEntity(BulletEntity, {
                ...enemy.getCellWorldCenter(partCell),
                ageMs: 0,
                damage: partCell.hp,
                isMissile: false,
                side: BulletSide.Player,
                velocityX: 0,
                velocityY: 0,
            });
            await update(0);

            assert.deepEquals(
                {
                    enemyCells: enemy.params.grid.cells.map((cell) => cell.kind),
                    fragmentKinds: [
                        ...entityStore.getEntities(FragmentEntity),
                    ].map((fragment) => fragment.params.kind),
                },
                {
                    enemyCells: [
                        CellKind.Cockpit,
                        CellKind.Thruster,
                        CellKind.Thruster,
                        CellKind.Hull,
                        CellKind.Hull,
                        CellKind.Hull,
                        CellKind.Hull,
                    ],
                    fragmentKinds: [
                        CellKind.Thruster,
                    ],
                },
            );
        });
    });

    it('adds a fragment that reaches a ship to the shared part progress', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            run.params.partProgress = createPartProgress({
                random: SeededRandom.fromSeed('part-progress'),
                saved: [],
            });

            await entityStore.addEntity(FragmentEntity, {
                ...getCellWorldCenter({
                    cell: cockpitPosition,
                    fly: run.getShips()[0]?.params.fly ?? {
                        x: 0,
                        y: 0,
                    },
                }),
                ageMs: 0,
                isReward: false,
                kind: CellKind.Gun,
                velocityX: 0,
                velocityY: 0,
            });
            await update(0);

            assert.deepEquals(
                {
                    fragmentCount: entityStore.getEntities(FragmentEntity).size,
                    gunFragments: run.params.partProgress.find(
                        (progress) => progress.kind === CellKind.Gun,
                    )?.fragments,
                },
                {
                    fragmentCount: 0,
                    gunFragments: specialFragmentWeight,
                },
            );
        });
    });

    it('reverts the system once every ship is wrecked and the enemies have fled', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });
            const ship = assertWrap.isDefined(run.getShips()[0]);
            const launchGrid = {
                cells: [
                    ...createStarterShipGrid().cells,
                    {
                        facing: Direction.Forward,
                        hp: 2,
                        kind: CellKind.Hull,
                        level: 1,
                        x: cockpitPosition.x,
                        y: cockpitPosition.y - 1,
                    },
                ],
            };
            const partProgress = createPartProgress({
                random: SeededRandom.fromSeed('part-progress'),
                saved: [],
            }).map((progress) => {
                return {
                    ...progress,
                    fragments: 1,
                };
            });

            run.params.currentStarIndex = 1;
            run.params.visitedStarIndexes = [
                0,
                1,
            ];
            run.params.partProgress = partProgress;
            ship.params.launchGrid = launchGrid;
            ship.params.grid = {
                cells: [],
            };
            await entityStore.addEntity(EnemyEntity, structuredClone(baseEnemyParams));
            await update(0);

            const wreckedPhase = run.params.phase;

            /** Long enough for the debris to fade and the enemy to flee off screen. */
            await update(debrisLifetimeMs);

            assert.deepEquals(
                {
                    ...selectFrom(run.params, {
                        currentStarIndex: true,
                        partProgress: true,
                        phase: true,
                        visitedStarIndexes: true,
                    }),
                    grid: ship.params.grid,
                    wreckedPhase,
                },
                {
                    currentStarIndex: 0,
                    grid: launchGrid,
                    partProgress,
                    phase: RunPhase.GalaxyMap,
                    wreckedPhase: RunPhase.Wrecked,
                    visitedStarIndexes: [
                        0,
                    ],
                },
            );
        });
    });

    it('skips building when a jump ends with nothing to build', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            run.params.phase = RunPhase.Jump;
            run.params.phaseElapsedMs = jumpMs;
            await update(0);

            assert.deepEquals(
                selectFrom(run.params, {
                    phase: true,
                }),
                {
                    phase: RunPhase.Fly,
                },
            );
        });
    });

    it('keeps the wave and star distance unchanged from the jump through launch', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            run.startGalaxyMap();
            run.params.wavePlayerCount = 0;
            run.params.selectedStarIndex = assertWrap.isDefined(run.getConnectedStarIndexes()[0]);
            run.travelToSelectedStar();
            const jumpState = {
                starDistancePx: run.getWave().starDistancePx,
                systemTravelPx: run.params.systemTravelPx,
            };

            run.params.phaseElapsedMs = jumpMs;
            await update(0);

            assert.deepEquals(
                {
                    phase: run.params.phase,
                    starDistancePx: run.getWave().starDistancePx,
                    systemTravelPx: run.params.systemTravelPx,
                },
                {
                    ...jumpState,
                    phase: RunPhase.Fly,
                },
            );
        });
    });

    it('builds when a jump ends with earned pieces', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            run.params.phase = RunPhase.Jump;
            run.params.phaseElapsedMs = jumpMs;
            run.params.earnedPieces = [
                {
                    cells: [
                        {
                            facing: Direction.Forward,
                            kind: CellKind.Hull,
                            x: 0,
                            y: 0,
                        },
                    ],
                },
            ];
            await update(0);

            assert.deepEquals(
                selectFrom(run.params, {
                    phase: true,
                }),
                {
                    phase: RunPhase.Build,
                },
            );
        });
    });

    it('waits to launch until every ship finishes building', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });
            const ship = assertWrap.isDefined(run.getShips()[0]);

            run.params.phase = RunPhase.Build;
            await update(0);
            const phaseBeforeReady = run.params.phase;

            ship.finishBuild();
            await update(0);

            assert.deepEquals(
                {
                    phaseAfterReady: selectFrom(run.params, {
                        phase: true,
                    }).phase,
                    phaseBeforeReady,
                },
                {
                    phaseAfterReady: RunPhase.ToFly,
                    phaseBeforeReady: RunPhase.Build,
                },
            );
        });
    });

    it('undoes each placement back to the start of the build', async () => {
        await testWithEntityStore(async ({entityStore}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });
            const ship = assertWrap.isDefined(run.getShips()[0]);
            const hullPiece = {
                cells: [
                    {
                        facing: Direction.Forward,
                        kind: CellKind.Hull,
                        x: 0,
                        y: 0,
                    },
                ],
            };

            ship.startBuild([
                hullPiece,
                hullPiece,
            ]);

            const startState = {
                build: ship.params.build,
                grid: ship.params.grid,
            };

            ship.placeActivePiece();
            ship.placeActivePiece();
            const placedCellCount = ship.params.grid.cells.length;

            ship.undoPlacement();
            ship.undoPlacement();
            ship.undoPlacement();

            assert.deepEquals(
                {
                    build: ship.params.build,
                    grid: ship.params.grid,
                    placedCellCount,
                },
                {
                    ...startState,
                    placedCellCount: startState.grid.cells.length + 2,
                },
            );
        });
    });

    it('ends the wave once the system star reaches the bottom of the screen', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            await entityStore.addEntity(EnemyEntity, structuredClone(baseEnemyParams));
            await update(100);

            assert.deepEquals(
                {
                    enemyCount: entityStore.getEntities(EnemyEntity).size,
                    phase: run.params.phase,
                    waveIndex: run.params.waveIndex,
                },
                {
                    enemyCount: 0,
                    phase: RunPhase.Reward,
                    waveIndex: 0,
                },
            );
        });
    });

    it('heals the ship once the system is cleared', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            const ship = assertWrap.isDefined(
                [
                    ...entityStore.getEntities(ShipEntity),
                ][0],
            );
            const healthyCells = structuredClone(ship.params.grid.cells);

            ship.params.grid = {
                cells: ship.params.grid.cells.map((cell) => {
                    return {
                        ...cell,
                        hp: 1,
                    };
                }),
            };
            await update(100);

            assert.deepEquals(ship.params.grid.cells, healthyCells);
        });
    });

    it('pulls core fragments out of a cleared star into the ship before the galaxy map', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });

            run.params.partProgress = createPartProgress({
                random: SeededRandom.fromSeed('part-progress'),
                saved: [],
            });
            await update(100);
            /** Short frames so fragments don't step past the ship's collect radius. */
            await awaitedForEach(
                createArray(500, () => undefined),
                async () => {
                    await update(16);
                },
            );

            assert.deepEquals(
                {
                    coreFragments: run.params.partProgress.find(
                        (progress) => progress.kind === CellKind.Cockpit,
                    )?.fragments,
                    hullFragments: run.params.partProgress.find(
                        (progress) => progress.kind === CellKind.Hull,
                    )?.fragments,
                    phase: run.params.phase,
                    waveIndex: run.params.waveIndex,
                },
                {
                    /** Core fragments count extra, and a filled core bar starts over. */
                    coreFragments:
                        (run.getRewardFragmentCount() * specialFragmentWeight) %
                        getFragmentsNeeded(
                            assertWrap.isDefined(
                                run.params.partProgress.find(
                                    (progress) => progress.kind === CellKind.Cockpit,
                                ),
                            ),
                        ),
                    hullFragments: 0,
                    phase: RunPhase.GalaxyMap,
                    waveIndex: 1,
                },
            );
        });
    });

    it('opens the galaxy map only once the ships fly off the top of the screen', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });
            const ship = assertWrap.isDefined([...entityStore.getEntities(ShipEntity)][0]);

            /** Assigned this way so TypeScript doesn't narrow the phase for the rest of the test. */
            Object.assign(run.params, {
                phase: RunPhase.Depart,
            });
            await update(500);

            const departing = {
                isAboveScreen: ship.isAboveScreen(),
                isFlyingUp: ship.params.fly.y < 900,
                phase: run.params.phase,
            };

            await update(2000);

            assert.deepEquals(
                {
                    departing,
                    phase: run.params.phase,
                    waveIndex: run.params.waveIndex,
                },
                {
                    departing: {
                        isAboveScreen: false,
                        isFlyingUp: true,
                        phase: RunPhase.Depart,
                    },
                    phase: RunPhase.GalaxyMap,
                    waveIndex: 1,
                },
            );
        });
    });

    it('holds the system star in place while a boss is alive', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            const run = await addFlyingRun({
                entityStore,
                travelLeftPx: 1,
            });
            const travelPx = run.params.systemTravelPx;

            await entityStore.addEntity(EnemyEntity, {
                ...baseEnemyParams,
                grid: createEnemyGrid({
                    difficulty: 0,
                    kind: EnemyKind.Boss,
                }),
                kind: EnemyKind.Boss,
            });
            await update(100);

            assert.deepEquals(
                {
                    phase: run.params.phase,
                    systemTravelPx: run.params.systemTravelPx,
                },
                {
                    phase: RunPhase.Fly,
                    systemTravelPx: travelPx,
                },
            );
        });
    });

    it('blocks player bullets with an enemy shield until the shield breaks', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            const enemy = await entityStore.addEntity(EnemyEntity, {
                ...structuredClone(baseEnemyParams),
                grid: createEnemyGrid({
                    difficulty: 0,
                    kind: EnemyKind.Weaver,
                }),
                kind: EnemyKind.Weaver,
            });

            async function shootCore() {
                await entityStore.addEntity(BulletEntity, {
                    ageMs: 0,
                    damage: 1,
                    isMissile: false,
                    side: BulletSide.Player,
                    velocityX: 0,
                    velocityY: 0,
                    x: 300,
                    y: 300,
                });
                await update(0);
            }

            await awaitedForEach(
                createArray(
                    getShieldCapacity({
                        level: 1,
                        owner: ShieldOwner.Enemy,
                    }),
                    () => undefined,
                ),
                shootCore,
            );

            const isAliveWithBrokenShield =
                !enemy.isDestroyed && !!enemy.params.shields[0]?.isBroken;

            await shootCore();

            assert.deepEquals(
                {
                    isAliveWithBrokenShield,
                    isDestroyed: enemy.isDestroyed,
                },
                {
                    isAliveWithBrokenShield: true,
                    isDestroyed: true,
                },
            );
        });
    });

    it('absorbs collision damage with a player shield', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            const ship = assertWrap.isDefined(
                [
                    ...entityStore.getEntities(ShipEntity),
                ][0],
            );

            ship.params.grid = {
                cells: [
                    assertWrap.isDefined(createStarterShipGrid().cells[0]),
                    {
                        facing: Direction.Forward,
                        hp: maxCellHp[CellKind.Shield],
                        kind: CellKind.Shield,
                        level: 1,
                        x: cockpitPosition.x,
                        y: cockpitPosition.y + 1,
                    },
                ],
            };

            const cellsBefore = structuredClone(ship.params.grid.cells);
            const cockpitCenter = getCellWorldCenter({
                cell: cockpitPosition,
                fly: ship.params.fly,
            });

            await entityStore.addEntity(EnemyEntity, {
                ...structuredClone(baseEnemyParams),
                spawnX: cockpitCenter.x,
                ...cockpitCenter,
            });
            await update(0);

            assert.deepEquals(
                {
                    cells: ship.params.grid.cells,
                    isShieldHit:
                        (ship.params.fly.shields[0]?.energy ?? Infinity) <
                        getShieldCapacity({
                            level: 1,
                            owner: ShieldOwner.Player,
                        }),
                },
                {
                    cells: cellsBefore,
                    isShieldHit: true,
                },
            );
        });
    });

    it('stops a laser beam at the first enemy part in its way', async () => {
        await testWithEntityStore(async ({entityStore, update}) => {
            await addFlyingRun({
                entityStore,
                travelLeftPx: 10_000,
            });

            const ship = assertWrap.isDefined(
                [
                    ...entityStore.getEntities(ShipEntity),
                ][0],
            );
            const laserCell = {
                facing: Direction.Forward,
                hp: 2,
                kind: CellKind.Laser,
                level: 1,
                x: cockpitPosition.x,
                y: cockpitPosition.y + 1,
            };

            ship.params.grid = {
                cells: [
                    assertWrap.isDefined(createStarterShipGrid().cells[0]),
                    laserCell,
                ],
            };

            const laserX = getCellWorldCenter({
                cell: laserCell,
                fly: ship.params.fly,
            }).x;
            const [
                nearEnemy,
                farEnemy,
            ] = await awaitedBlockingMap(
                [
                    300,
                    150,
                ],
                async (y) => {
                    return await entityStore.addEntity(EnemyEntity, {
                        ...structuredClone(baseEnemyParams),
                        spawnX: laserX,
                        x: laserX,
                        y,
                    });
                },
            );

            await update(laserPulseMs);

            assert.deepEquals(
                {
                    beamCount: ship.params.fly.laserBeams.length,
                    farCellCount: farEnemy?.params.grid.cells.length,
                    nearCellCount: nearEnemy?.params.grid.cells.length,
                },
                {
                    beamCount: 1,
                    farCellCount: baseEnemyParams.grid.cells.length,
                    nearCellCount: baseEnemyParams.grid.cells.length - 1,
                },
            );
        });
    });
});
