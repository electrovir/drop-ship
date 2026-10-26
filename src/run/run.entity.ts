import {type ModExecuteParams} from '@antha/engine';
import {type EntityStore2d} from '@antha/entity-2d';
import {assertWrap} from '@augment-vir/assert';
import {
    awaitedBlockingMap,
    awaitedForEach,
    createArray,
    type Coords,
    type MaybePromise,
    type PartialWithUndefined,
} from '@augment-vir/common';
import {defineShape, enumShape} from 'object-shape-tester';
import {soundEffectPlayer} from '../audio/game-sound-effect-player.js';
import {SoundEffect} from '../audio/sound-effect.js';
import {BulletEntity, bulletRadius, BulletSide, steerMissile} from '../bullet/bullet.entity.js';
import {EnemyKind} from '../enemy/enemy-kind.js';
import {
    createEnemyGrid,
    enemyCellSize,
    EnemyEntity,
    enemyStats,
    getEnemyFireIntervalMultiplier,
    getEnemyRadius,
    getMaxEnemyBulletCount,
} from '../enemy/enemy.entity.js';
import {createFragmentScatterVelocity, FragmentEntity} from '../fragment/fragment.entity.js';
import {
    findConnectedStarClosestToCenter,
    generateGalaxy,
    getConnectedStarIndexes,
} from '../galaxy/galaxy.js';
import {createSystemStar} from '../galaxy/system-star.js';
import {defineLogicEntity} from '../game-state/game-entity.mod.js';
import {gameWorldSize} from '../game-state/game-world.js';
import {addFragment, partProgressShape} from '../part/part-progress.js';
import {debrisLifetimeMs} from '../ship/debris.entity.js';
import {damageShield, findShieldTouchingCircle, shieldRadiusCells} from '../ship/shield.js';
import {getShipBuildPieces} from '../ship/ship-build.js';
import {CellKind} from '../ship/ship-cell.js';
import {
    findCellsTouchingCircle,
    flyCellSize,
    getCellWorldCenter,
    getFlyStartPosition,
    getMagnetRangePx,
    isLaserFiring,
    isSquareTouchingCircle,
    laserPulseMs,
    toWorldVector,
} from '../ship/ship-fly.js';
import {cockpitPosition} from '../ship/ship-grid.js';
import {pieceShape} from '../ship/ship-piece.js';
import {getSortedShips, type ShipEntity} from '../ship/ship.entity.js';
import {getDistanceSquared} from '../util/distance.js';
import {getRayDistanceToCircle, getRayDistanceToSquare} from '../util/ray.js';
import {generateWave, systemTravelPxPerMs} from '../wave/generate-wave.js';
import {jumpMs, phaseTransitionMs, RunPhase} from './run-phase.js';

/** Far enough for a laser beam to cross the whole screen. */
const maxLaserLengthPx = gameWorldSize.width + gameWorldSize.height;
/** After the last ship blows up, enemies speed up as they fly away. */
const wreckFleeStartPxPerMs = 0.2;
const wreckFleePxPerMsPerMs = 0.004;
const fragmentCollectRadiusPx = 20;
const rewardFragmentsPerDifficulty = 24;
/** How long a cleared system's star takes to send out all of its reward fragments. */
const rewardStreamMs = 1500;
/** The ships speed up as they fly off the top of the screen after a cleared system. */
const departStartPxPerMs = 0.15;
const departPxPerMsPerMs = 0.0015;

/**
 * Runs the game loop: pick a star on the galaxy map, build, fly through that star's system, repeat
 * until every ship is wrecked. Ships and enemies are stepped here, and every hit is resolved here,
 * so that everything happens in the same order on every peer.
 */
export class RunEntity extends defineLogicEntity({
    key: 'RunEntity',
    paramsShape: defineShape({
        currentStarIndex: 0,
        /**
         * Pieces earned since the last build phase. Every ship gets a copy, since the whole team
         * shares fragments.
         */
        earnedPieces: [
            pieceShape,
        ],
        galaxySeed: '',
        /** One entry for each fragment kind. */
        partProgress: [
            partProgressShape,
        ],
        phase: enumShape(RunPhase),
        phaseElapsedMs: 0,
        runSeed: '',
        /** The connected star the galaxy map cursor is on. */
        selectedStarIndex: 0,
        spawnedEnemyCount: 0,
        /** How far the ships have flown toward the system's star this wave. */
        systemTravelPx: 0,
        visitedStarIndexes: [
            0,
        ],
        /** How many systems have been cleared. */
        waveIndex: 0,
        /** The ship count when the current wave started, so ships joining mid-wave don't change it. */
        wavePlayerCount: 0,
    }),
}) {
    protected cachedWave:
        | {
              key: string;
              wave: ReturnType<typeof generateWave>;
          }
        | undefined;

    protected readonly phaseSteps: Readonly<
        Record<RunPhase, (frameMs: number) => MaybePromise<void>>
    > = {
        [RunPhase.GalaxyMap]: (frameMs) => {
            this.params.phaseElapsedMs += frameMs;
        },
        [RunPhase.Jump]: (frameMs) => {
            this.params.phaseElapsedMs += frameMs;

            if (this.params.phaseElapsedMs >= jumpMs) {
                this.startBuildPhase();

                if (this.getShips().length && !this.hasPiecesToBuild()) {
                    this.launchShips(RunPhase.Fly);
                }
            }
        },
        [RunPhase.Build]: () => this.stepBuildPhase(),
        [RunPhase.ToFly]: (frameMs) => {
            this.stepTransition(frameMs, () => this.startPhase(RunPhase.Fly));
        },
        [RunPhase.Fly]: (frameMs) => this.stepFlyPhase(frameMs),
        [RunPhase.Wrecked]: (frameMs) => this.stepWreckedPhase(frameMs),
        [RunPhase.Reward]: (frameMs) => this.stepRewardPhase(frameMs),
        [RunPhase.Depart]: (frameMs) => {
            this.params.phaseElapsedMs += frameMs;

            const ships = this.getLivingShips();

            ships.forEach((ship) => {
                ship.flyUp(
                    (departStartPxPerMs + this.params.phaseElapsedMs * departPxPerMsPerMs) *
                        frameMs,
                );
            });

            if (ships.every((ship) => ship.isAboveScreen())) {
                this.clearFlyEntities();
                this.getShips().forEach((ship) => ship.restoreIfWrecked());
                this.params.waveIndex++;
                this.startGalaxyMap();
            }
        },
    };

    public override async update({msSinceLastExecute}: Readonly<ModExecuteParams>) {
        await this.phaseSteps[this.params.phase](msSinceLastExecute);
    }

    public getShips() {
        return getSortedShips(this.entityStore);
    }

    /** Ships that still have a cockpit. */
    public getLivingShips() {
        return this.getShips().filter((ship) => !ship.isWrecked());
    }

    /** The current star's difficulty, which is higher closer to the galaxy's core. */
    public getSystemDifficulty() {
        return assertWrap.isDefined(this.getGalaxy().stars[this.params.currentStarIndex])
            .difficulty;
    }

    /** The core fragments clearing the current system grants. Harder systems grant more. */
    public getRewardFragmentCount() {
        return (this.getSystemDifficulty() + 1) * rewardFragmentsPerDifficulty;
    }

    public getWave() {
        /** Includes the cleared system count so revisiting a star doesn't replay the same wave. */
        const waveSeed = [
            this.params.runSeed,
            this.params.waveIndex,
        ].join(':');
        const key = [
            waveSeed,
            this.params.currentStarIndex,
            this.params.wavePlayerCount,
        ].join(':');

        if (this.cachedWave?.key !== key) {
            this.cachedWave = {
                key,
                wave: generateWave({
                    difficulty: this.getSystemDifficulty(),
                    playerCount: this.params.wavePlayerCount,
                    runSeed: waveSeed,
                }),
            };
        }

        return this.cachedWave.wave;
    }

    public getGalaxy() {
        return generateGalaxy(this.params.galaxySeed);
    }

    public getConnectedStarIndexes() {
        return getConnectedStarIndexes({
            galaxy: this.getGalaxy(),
            starIndex: this.params.currentStarIndex,
        });
    }

    /** Opens the galaxy map with the cursor on the connected star closest to the galaxy's center. */
    public startGalaxyMap() {
        this.startPhase(RunPhase.GalaxyMap);
        this.params.selectedStarIndex = findConnectedStarClosestToCenter({
            galaxy: this.getGalaxy(),
            starIndex: this.params.currentStarIndex,
        });
    }

    /** Ignores stars that aren't connected, since a late packet may target an old position. */
    public selectStar(starIndex: number) {
        if (
            this.params.phase === RunPhase.GalaxyMap &&
            this.getConnectedStarIndexes().includes(starIndex)
        ) {
            this.params.selectedStarIndex = starIndex;
        }
    }

    public travelToSelectedStar() {
        if (
            this.params.phase !== RunPhase.GalaxyMap ||
            !this.getConnectedStarIndexes().includes(this.params.selectedStarIndex)
        ) {
            return;
        }

        this.params.currentStarIndex = this.params.selectedStarIndex;
        this.params.visitedStarIndexes = [
            ...this.params.visitedStarIndexes,
            this.params.selectedStarIndex,
        ];
        /** The system's planets are drawn from these during the jump and build, before launch. */
        this.params.systemTravelPx = 0;
        this.params.wavePlayerCount = this.getShips().length;
        this.playSoundEffect(SoundEffect.HyperspaceJump);
        this.startPhase(RunPhase.Jump);
    }

    /**
     * When there's nothing to build, a jump skips the build panels and the ships fly straight into
     * the system.
     */
    public hasPiecesToBuild() {
        return this.getShips().some((ship) => {
            return !!getShipBuildPieces({
                grid: ship.params.grid,
                pieces: this.params.earnedPieces,
            }).length;
        });
    }

    /** Starts the build phase for every ship, including ships that were wrecked last wave. */
    public startBuildPhase() {
        this.startPhase(RunPhase.Build);
        this.getShips().forEach((ship) => this.startShipBuild(ship));
    }

    /** Brings a ship that joined mid-run into the current phase. */
    public prepareJoiningShip(ship: ShipEntity) {
        if (this.params.phase === RunPhase.Build) {
            this.startShipBuild(ship);
        } else if (this.params.phase === RunPhase.Fly || this.params.phase === RunPhase.ToFly) {
            ship.startFlying(
                getFlyStartPosition({
                    shipCount: 1,
                    shipIndex: 0,
                }),
            );
        }
    }

    protected startShipBuild(ship: ShipEntity) {
        ship.startBuild(
            getShipBuildPieces({
                grid: ship.params.grid,
                pieces: this.params.earnedPieces,
            }),
        );
    }

    /** Fragments are shared, so whoever collects one fills the bar for the whole team. */
    protected collectFragment({
        isReward,
        kind,
    }: Readonly<Pick<FragmentEntity['params'], 'isReward' | 'kind'>>) {
        const result = addFragment({
            isOwnKindOnly: isReward,
            kind,
            partProgress: this.params.partProgress,
            random: this.state.seededRandom,
        });

        this.params.partProgress = result.partProgress;

        if (result.earnedPieces.length) {
            this.params.earnedPieces = [
                ...this.params.earnedPieces,
                ...result.earnedPieces,
            ];
            this.playSoundEffect(SoundEffect.PiecePlace);
        }
    }

    protected startPhase(phase: RunPhase) {
        this.params.phase = phase;
        this.params.phaseElapsedMs = 0;
    }

    protected stepTransition(frameMs: number, finishTransition: () => void) {
        this.params.phaseElapsedMs += frameMs;

        if (this.params.phaseElapsedMs >= phaseTransitionMs) {
            finishTransition();
        }
    }

    protected playSoundEffect(effect: SoundEffect) {
        soundEffectPlayer.play({
            audioPlayer: this.state.audioPlayer,
            effect,
        });
    }

    protected stepBuildPhase() {
        const ships = this.getShips();

        if (!ships.length || ships.some((ship) => !ship.params.build.isReady)) {
            return;
        }

        this.launchShips(RunPhase.ToFly);
    }

    protected launchShips(phase: RunPhase.Fly | RunPhase.ToFly) {
        const ships = this.getShips();

        ships.forEach((ship, shipIndex) => {
            ship.startFlying(
                getFlyStartPosition({
                    shipCount: ships.length,
                    shipIndex,
                }),
            );
        });

        this.params.earnedPieces = [];
        this.params.spawnedEnemyCount = 0;
        this.params.systemTravelPx = 0;
        this.params.wavePlayerCount = ships.length;
        this.startPhase(phase);
    }

    protected async stepFlyPhase(frameMs: number) {
        this.params.phaseElapsedMs += frameMs;

        await this.spawnDueEnemies();

        const livingShips = this.getLivingShips();

        await awaitedForEach(livingShips, (ship) => ship.stepFly(frameMs));
        /** Every enemy shares one bullet cap, so each enemy's shots use up what the next can fire. */
        await this.getEnemies().reduce(
            async (previousBudget, enemy) => {
                const bulletBudget = await previousBudget;

                return (
                    bulletBudget -
                    (await enemy.step({
                        bulletBudget,
                        frameMs,
                        targets: livingShips.map((ship) => ship.params.fly),
                    }))
                );
            },
            Promise.resolve(
                getMaxEnemyBulletCount(this.getSystemDifficulty()) -
                    this.getBullets(BulletSide.Enemy).length,
            ),
        );

        this.steerMissiles({
            frameMs,
            ships: livingShips,
        });
        await this.resolveLasers({
            frameMs,
            ships: livingShips,
        });
        await this.resolvePlayerBulletHits();
        await this.resolveEnemyBulletHits(livingShips);
        await this.resolveEnemyContacts(livingShips);
        this.stepFragments({
            frameMs,
            ships: this.getLivingShips(),
        });

        /** Bosses hover instead of leaving, so the star waits for them to be destroyed. */
        if (!this.getEnemies().some((enemy) => enemy.params.kind === EnemyKind.Boss)) {
            this.params.systemTravelPx += frameMs * systemTravelPxPerMs;
        }

        if (!this.getLivingShips().length) {
            this.getShips().forEach((ship) => ship.stopFlying());
            this.getBullets().forEach((bullet) => bullet.immediatelyDestroy());
            this.playSoundEffect(SoundEffect.LifeLost);
            this.startPhase(RunPhase.Wrecked);
        } else if (this.params.systemTravelPx >= this.getWave().starDistancePx) {
            [
                ...this.getEnemies(),
                ...this.getBullets(),
            ].forEach((entity) => entity.immediatelyDestroy());
            this.getShips().forEach((ship) => {
                ship.stopFlying();
                ship.healCells();
            });
            this.playSoundEffect(SoundEffect.WaveCleared);
            this.startPhase(RunPhase.Reward);
        }
    }

    /**
     * Core fragments stream out of the star at the bottom of the screen and every fragment left on
     * screen gets pulled into the closest ship, however far away it is.
     */
    protected async stepRewardPhase(frameMs: number) {
        const fragmentCount = this.getRewardFragmentCount();
        const previousStreamedCount = getStreamedFragmentCount({
            elapsedMs: this.params.phaseElapsedMs,
            fragmentCount,
        });

        this.params.phaseElapsedMs += frameMs;

        const streamedCount = getStreamedFragmentCount({
            elapsedMs: this.params.phaseElapsedMs,
            fragmentCount,
        });

        const star = createSystemStar({
            galaxySeed: this.params.galaxySeed,
            starIndex: this.params.currentStarIndex,
        });

        /** Sequential so fragments enter the entity store in the same order on every peer. */
        await awaitedForEach(
            createArray(streamedCount - previousStreamedCount, () => {
                return undefined;
            }),
            async () => {
                await this.addEntity(FragmentEntity, {
                    ...createFragmentScatterVelocity(this.state.seededRandom),
                    ageMs: 0,
                    isReward: true,
                    kind: CellKind.Cockpit,
                    x: star.x + (this.state.seededRandom.next() - 0.5) * star.radius,
                    y: gameWorldSize.height,
                });
            },
        );

        this.stepFragments({
            frameMs,
            isRangeUnlimited: true,
            ships: this.getLivingShips(),
        });

        if (streamedCount === fragmentCount && !this.getFragments().length) {
            this.startPhase(RunPhase.Depart);
        }
    }

    /**
     * The last ship's debris flies apart while every enemy speeds off the bottom of the screen.
     * Once they're gone, the system is undone.
     */
    protected stepWreckedPhase(frameMs: number) {
        this.params.phaseElapsedMs += frameMs;
        this.getEnemies().forEach((enemy) => {
            enemy.flee(
                (wreckFleeStartPxPerMs + this.params.phaseElapsedMs * wreckFleePxPerMsPerMs) *
                    frameMs,
            );
        });

        if (!this.getEnemies().length && this.params.phaseElapsedMs >= debrisLifetimeMs) {
            this.revertSystem();
        }
    }

    protected async spawnDueEnemies() {
        const wave = this.getWave();
        const dueSpawns = wave.spawns
            .slice(this.params.spawnedEnemyCount)
            .filter((spawn) => spawn.atMs <= this.params.phaseElapsedMs);

        this.params.spawnedEnemyCount += dueSpawns.length;

        await awaitedForEach(dueSpawns, async (spawn) => {
            const stats = enemyStats[spawn.enemyKind];

            if (spawn.enemyKind === EnemyKind.Boss) {
                this.playSoundEffect(SoundEffect.BossWarning);
            }

            await this.addEntity(EnemyEntity, {
                ageMs: 0,
                contactCooldownMs: 0,
                fireCooldownMs:
                    (stats.fireIntervalMs ?? 0) *
                    getEnemyFireIntervalMultiplier(this.getSystemDifficulty()),
                fireIntervalMultiplier: getEnemyFireIntervalMultiplier(this.getSystemDifficulty()),
                grid: createEnemyGrid({
                    difficulty: this.getSystemDifficulty(),
                    kind: spawn.enemyKind,
                }),
                kind: spawn.enemyKind,
                shields: [],
                spawnX: spawn.x,
                speedMultiplier: wave.enemySpeedMultiplier,
                velocityX: 0,
                velocityY: 0,
                x: spawn.x,
                y: 0 - getEnemyRadius(spawn.enemyKind),
            });
        });
    }

    protected async resolvePlayerBulletHits() {
        await awaitedForEach(this.getBullets(BulletSide.Player), async (bullet) => {
            const circle = {
                radius: bulletRadius,
                x: bullet.params.x,
                y: bullet.params.y,
            };
            const shieldHit = this.getEnemies()
                .map((enemy) => {
                    return {
                        enemy,
                        index: findShieldTouchingCircle({
                            cellSize: enemyCellSize,
                            cells: enemy.params.grid.cells,
                            circle,
                            getCenter(cell) {
                                return enemy.getCellWorldCenter(cell);
                            },
                            shields: enemy.params.shields,
                        }),
                    };
                })
                .find(({index}) => index >= 0);

            if (shieldHit) {
                shieldHit.enemy.params.shields = damageShield({
                    damage: bullet.params.damage,
                    index: shieldHit.index,
                    shields: shieldHit.enemy.params.shields,
                });
                bullet.immediatelyDestroy();
                return;
            }

            const hit = this.getEnemies()
                .map((enemy) => {
                    return {
                        cell: enemy.findCellTouchingCircle(circle),
                        enemy,
                    };
                })
                .find((enemyHit) => enemyHit.cell);

            if (!hit?.cell) {
                return;
            }

            const damage = bullet.params.damage;

            bullet.immediatelyDestroy();
            await this.damageEnemy({
                damage,
                enemy: hit.enemy,
                position: hit.cell,
            });
        });
    }

    protected async resolveEnemyBulletHits(ships: ReadonlyArray<ShipEntity>) {
        await awaitedForEach(this.getBullets(BulletSide.Enemy), async (bullet) => {
            const shieldHit = ships
                .map((ship) => {
                    return {
                        index: findShieldTouchingCircle({
                            cellSize: flyCellSize,
                            cells: ship.params.grid.cells,
                            circle: {
                                radius: bulletRadius,
                                x: bullet.params.x,
                                y: bullet.params.y,
                            },
                            getCenter(cell) {
                                return getCellWorldCenter({
                                    cell,
                                    fly: ship.params.fly,
                                });
                            },
                            shields: ship.params.fly.shields,
                        }),
                        ship,
                    };
                })
                .find(({index}) => index >= 0);

            if (shieldHit) {
                shieldHit.ship.setShields(
                    damageShield({
                        damage: bullet.params.damage,
                        index: shieldHit.index,
                        shields: shieldHit.ship.params.fly.shields,
                    }),
                );
                bullet.immediatelyDestroy();
                return;
            }

            const hit = ships
                .map((ship) => {
                    return {
                        cell: findCellsTouchingCircle({
                            circle: {
                                radius: bulletRadius,
                                x: bullet.params.x,
                                y: bullet.params.y,
                            },
                            fly: ship.params.fly,
                            grid: ship.params.grid,
                        })[0],
                        ship,
                    };
                })
                .find((shipHit) => shipHit.cell);

            if (!hit?.cell) {
                return;
            }

            bullet.immediatelyDestroy();
            await hit.ship.damageCell({
                damage: 1,
                position: hit.cell,
            });
        });
    }

    protected async damageEnemy({
        damage,
        enemy,
        position,
    }: Readonly<{
        damage: number;
        enemy: EnemyEntity;
        position: Readonly<Coords>;
    }>) {
        await enemy.damageCell({
            damage,
            position,
        });
    }

    /**
     * An enemy that crashes into a ship damages every cell it touches on the first ship it touches.
     * Its core takes damage equal to the hp those cells had, so ramming kills small enemies. An
     * enemy that survives can't crash again until its contact cooldown runs out.
     */
    protected async resolveEnemyContacts(ships: ReadonlyArray<ShipEntity>) {
        await awaitedForEach(this.getEnemies(), async (enemy) => {
            if (enemy.isDestroyed || enemy.params.contactCooldownMs > 0) {
                return;
            }

            const enemyCircles = enemy.getCellCircles();
            const contact = ships
                .map((ship) => {
                    return {
                        cells: ship.params.grid.cells.filter((shipCell) => {
                            const square = {
                                ...getCellWorldCenter({
                                    cell: shipCell,
                                    fly: ship.params.fly,
                                }),
                                size: flyCellSize,
                            };

                            return enemyCircles.some((circle) => {
                                return isSquareTouchingCircle({
                                    circle,
                                    square,
                                });
                            });
                        }),
                        ship,
                    };
                })
                .find((shipContact) => shipContact.cells.length);
            const core = enemy.findCore();

            if (!contact || !core) {
                return;
            }

            const contactDamage = enemyStats[enemy.params.kind].contactDamage;

            enemy.params.contactCooldownMs = 600;
            await this.damageEnemy({
                damage: contact.cells.reduce((sum, cell) => sum + cell.hp, 0),
                enemy,
                position: core,
            });

            const shieldIndex = enemyCircles
                .map((circle) => {
                    return findShieldTouchingCircle({
                        cellSize: flyCellSize,
                        cells: contact.ship.params.grid.cells,
                        circle,
                        getCenter(cell) {
                            return getCellWorldCenter({
                                cell,
                                fly: contact.ship.params.fly,
                            });
                        },
                        shields: contact.ship.params.fly.shields,
                    });
                })
                .find((index) => index >= 0);

            if (shieldIndex != undefined) {
                contact.ship.setShields(
                    damageShield({
                        damage: contactDamage * contact.cells.length,
                        index: shieldIndex,
                        shields: contact.ship.params.fly.shields,
                    }),
                );
                return;
            }

            await awaitedForEach(contact.cells, async (cell) => {
                await contact.ship.damageCell({
                    damage: contactDamage,
                    position: cell,
                });
            });
        });
    }

    /** Turns each missile toward the closest enemy core or ship on the other side. */
    protected steerMissiles({
        frameMs,
        ships,
    }: Readonly<{
        frameMs: number;
        ships: ReadonlyArray<ShipEntity>;
    }>) {
        const targets: Readonly<Record<BulletSide, ReadonlyArray<Readonly<Coords>>>> = {
            [BulletSide.Enemy]: ships.map((ship) => ship.params.fly),
            [BulletSide.Player]: this.getEnemies().map((enemy) => enemy.params),
        };

        this.getBullets()
            .filter((bullet) => bullet.params.isMissile)
            .forEach((missile) => {
                const target = targets[missile.params.side].reduce<Readonly<Coords> | undefined>(
                    (closest, candidate) => {
                        return !closest ||
                            getDistanceSquared({
                                first: candidate,
                                second: missile.params,
                            }) <
                                getDistanceSquared({
                                    first: closest,
                                    second: missile.params,
                                })
                            ? candidate
                            : closest;
                    },
                    undefined,
                );

                if (target) {
                    Object.assign(
                        missile.params,
                        steerMissile({
                            frameMs,
                            missile: missile.params,
                            target,
                        }),
                    );
                }
            });
    }

    /**
     * Each firing laser's beam stops at the first enemy part or enemy shield in its way. On every
     * pulse, that part or shield takes the laser's level in damage.
     */
    protected async resolveLasers({
        frameMs,
        ships,
    }: Readonly<{
        frameMs: number;
        ships: ReadonlyArray<ShipEntity>;
    }>) {
        await awaitedForEach(ships, async (ship) => {
            const gunElapsedMs = ship.params.fly.gunElapsedMs;
            const isPulse =
                Math.floor(gunElapsedMs / laserPulseMs) >
                Math.floor((gunElapsedMs - frameMs) / laserPulseMs);
            const lasers = isLaserFiring(gunElapsedMs)
                ? ship.params.grid.cells.filter((cell) => cell.kind === CellKind.Laser)
                : [];

            const beams = await awaitedBlockingMap(lasers, async (laser) => {
                const origin = getCellWorldCenter({
                    cell: laser,
                    fly: ship.params.fly,
                });
                const direction = toWorldVector({
                    angle: 0,
                    direction: laser.facing,
                });
                const hit = this.findLaserHit({
                    direction,
                    origin,
                });

                if (hit && isPulse) {
                    await hit.damage(laser.level);
                }

                return {
                    lengthPx: hit?.distancePx ?? maxLaserLengthPx,
                    x: laser.x,
                    y: laser.y,
                };
            });

            ship.setLaserBeams(beams);
        });
    }

    /** The closest enemy part or enemy shield along the ray, with how to damage it. */
    protected findLaserHit({
        direction,
        origin,
    }: Readonly<{
        direction: Readonly<Coords>;
        origin: Readonly<Coords>;
    }>) {
        return this.getEnemies()
            .flatMap((enemy) => {
                const shieldHits = enemy.params.shields
                    .filter((shield) => !shield.isBroken)
                    .map((shield) => {
                        return {
                            damage(damage: number) {
                                enemy.params.shields = damageShield({
                                    damage,
                                    index: enemy.params.shields.indexOf(shield),
                                    shields: enemy.params.shields,
                                });
                            },
                            distancePx: getRayDistanceToCircle({
                                circle: {
                                    ...enemy.getCellWorldCenter(shield),
                                    radius: shieldRadiusCells * enemyCellSize,
                                },
                                direction,
                                origin,
                            }),
                        };
                    });
                const cellHits = enemy.params.grid.cells.map((cell) => {
                    return {
                        damage: async (damage: number) => {
                            await this.damageEnemy({
                                damage,
                                enemy,
                                position: cell,
                            });
                        },
                        distancePx: getRayDistanceToSquare({
                            direction,
                            origin,
                            square: {
                                ...enemy.getCellWorldCenter(cell),
                                size: enemyCellSize,
                            },
                        }),
                    };
                });

                return [
                    ...shieldHits,
                    ...cellHits,
                ];
            })
            .reduce<
                {damage: (damage: number) => MaybePromise<void>; distancePx: number} | undefined
            >((closest, candidate) => {
                return candidate.distancePx != undefined &&
                    (!closest || candidate.distancePx < closest.distancePx)
                    ? {
                          ...candidate,
                          distancePx: candidate.distancePx,
                      }
                    : closest;
            }, undefined);
    }

    /**
     * Each fragment is pulled toward the closest ship cockpit whose magnet range reaches it, and
     * collected once it reaches it.
     */
    protected stepFragments({
        frameMs,
        isRangeUnlimited,
        ships,
    }: Readonly<
        {
            frameMs: number;
            ships: ReadonlyArray<ShipEntity>;
        } & PartialWithUndefined<{
            isRangeUnlimited: boolean;
        }>
    >) {
        const magnets = ships.map((ship) => {
            return {
                position: getCellWorldCenter({
                    cell: cockpitPosition,
                    fly: ship.params.fly,
                }),
                rangePx: isRangeUnlimited ? Infinity : getMagnetRangePx(ship.params.grid),
            };
        });

        this.getFragments().forEach((fragment) => {
            const closestMagnet = magnets
                .map(({position, rangePx}) => {
                    return {
                        distanceSquared: getDistanceSquared({
                            first: position,
                            second: fragment.params,
                        }),
                        magnet: position,
                        rangePx,
                    };
                })
                .filter(({distanceSquared, rangePx}) => distanceSquared <= rangePx * rangePx)
                .reduce<
                    {distanceSquared: number; magnet: Readonly<Coords>; rangePx: number} | undefined
                >((closest, candidate) => {
                    return !closest || candidate.distanceSquared < closest.distanceSquared
                        ? candidate
                        : closest;
                }, undefined);

            fragment.step({
                frameMs,
                magnetTarget: closestMagnet?.magnet,
            });

            if (
                fragment.isDestroyed ||
                !closestMagnet ||
                getDistanceSquared({
                    first: closestMagnet.magnet,
                    second: fragment.params,
                }) >
                    fragmentCollectRadiusPx * fragmentCollectRadiusPx
            ) {
                return;
            }

            this.collectFragment(fragment.params);
            fragment.immediatelyDestroy();
        });
    }

    /** Clears everything that only exists while flying through a system. */
    /**
     * Undoes the system: the ships go back to how they launched and the galaxy map opens on the
     * star the ships jumped from. Fragments and pieces collected there are kept.
     */
    protected revertSystem() {
        this.clearFlyEntities();
        this.getShips().forEach((ship) => ship.restoreIfWrecked());

        const visitedStarIndexes =
            this.params.visitedStarIndexes.length > 1
                ? this.params.visitedStarIndexes.slice(0, -1)
                : this.params.visitedStarIndexes;

        this.params.visitedStarIndexes = visitedStarIndexes;
        this.params.currentStarIndex = visitedStarIndexes.at(-1) ?? this.params.currentStarIndex;
        this.startGalaxyMap();
    }

    protected clearFlyEntities() {
        [
            ...this.getEnemies(),
            ...this.getBullets(),
            ...this.getFragments(),
        ].forEach((entity) => entity.immediatelyDestroy());
    }

    protected getFragments() {
        return [
            ...this.entityStore.getEntities(FragmentEntity),
        ].filter((fragment) => !fragment.isDestroyed);
    }

    protected getEnemies() {
        return [
            ...this.entityStore.getEntities(EnemyEntity),
        ].filter((enemy) => !enemy.isDestroyed);
    }

    protected getBullets(side?: BulletSide | undefined) {
        return [
            ...this.entityStore.getEntities(BulletEntity),
        ].filter((bullet) => !bullet.isDestroyed && (!side || bullet.params.side === side));
    }
}

/** How many of a cleared system's reward fragments its star has sent out after `elapsedMs`. */
function getStreamedFragmentCount({
    elapsedMs,
    fragmentCount,
}: Readonly<{
    elapsedMs: number;
    fragmentCount: number;
}>) {
    return Math.min(fragmentCount, Math.ceil((elapsedMs / rewardStreamMs) * fragmentCount));
}

export function findRunEntity(entityStore: Readonly<Pick<EntityStore2d, 'getEntities'>>) {
    return [
        ...entityStore.getEntities(RunEntity),
    ][0];
}
