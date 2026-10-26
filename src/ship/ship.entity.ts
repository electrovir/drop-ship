import {type EntityStore2d, type ViewCreation2d} from '@antha/entity-2d';
import {Container, Graphics} from '@antha/graphics-2d';
import {multiplayerPlayerIdShape, type MultiplayerPlayerId} from '@antha/multiplayer-core';
import {
    awaitedForEach,
    createArray,
    type Coords,
    type PartialWithUndefined,
} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {soundEffectPlayer} from '../audio/game-sound-effect-player.js';
import {SoundEffect} from '../audio/sound-effect.js';
import {BulletEntity, BulletSide, missileSpeedFactor} from '../bullet/bullet.entity.js';
import {defineEntity} from '../game-state/game-entity.mod.js';
import {sharedPlayerProfileShape} from '../player/player-profile.js';
import {getCellColor} from './cell-color.js';
import {DebrisEntity} from './debris.entity.js';
import {
    getShieldFullness,
    ShieldOwner,
    shieldRadiusCells,
    stepShields,
    type ShieldState,
} from './shield.js';
import {
    canPlaceActivePiece,
    createFinishedShipBuild,
    moveActivePiece,
    placeActivePiece,
    rotateActivePiece,
    shipBuildShape,
    startShipBuild,
    swapActivePiece,
    type ShipBuild,
} from './ship-build.js';
import {
    CellKind,
    directionVectors,
    getMaxCellHp,
    type Direction,
    type PieceCell,
    type ShipCell,
} from './ship-cell.js';
import {
    flyCellSize,
    getCellWorldCenter,
    gunStats,
    moveShip,
    sanitizeSteering,
    shipFlyShape,
    toWorldVector,
    type ShipFly,
} from './ship-fly.js';
import {
    damageShipCell,
    hasCockpit,
    shipGridShape,
    shipGridSize,
    type ShipGrid,
} from './ship-grid.js';
import {getPlacedPieceCells, type Piece} from './ship-piece.js';

/** Ship views are drawn at this cell size. Cameras scale them to fit each phase. */
export const shipViewCellSize = 32;

export const playerBulletSpeedPxPerMs = 0.9;
const debrisMaxSpeedPxPerMs = 0.15;
const invalidPieceAlpha = 0.35;
const levelPipSize = 5;
/** Level pips wrap into more rows past this many, so they stay inside the cell. */
const levelPipsPerRow = Math.floor((shipViewCellSize - 4) / (levelPipSize + 2));
const gunSoundEffects: Readonly<Record<CellKind, SoundEffect | undefined>> = {
    [CellKind.Hull]: undefined,
    [CellKind.Cockpit]: undefined,
    [CellKind.Gun]: SoundEffect.GunShot,
    [CellKind.RapidGun]: SoundEffect.RapidGunShot,
    [CellKind.Shield]: undefined,
    [CellKind.SpreadGun]: SoundEffect.SpreadGunShot,
    [CellKind.Thruster]: undefined,
    [CellKind.Magnet]: undefined,
    [CellKind.MissileLauncher]: SoundEffect.GunShot,
    [CellKind.NovaGun]: SoundEffect.SpreadGunShot,
    [CellKind.Laser]: undefined,
};

const barrelColor = '#2b2b2b';
const laserColor = '#9be7ff';
const shieldColor = '#9be7ff';

/**
 * Draws gun barrels from the cell's center out to its facing edge. Each barrel is turned by its
 * angle and shifted sideways by its offset, both relative to the facing.
 */
function drawBarrels({
    alpha,
    barrels,
    center,
    facing,
    graphics,
    width,
}: Readonly<{
    alpha: number;
    barrels: ReadonlyArray<
        Readonly<{
            angle: number;
            offset: number;
        }>
    >;
    center: Readonly<Coords>;
    facing: Readonly<Coords>;
    graphics: Graphics;
    width: number;
}>) {
    barrels.forEach(({angle, offset}) => {
        const direction = {
            x: facing.x * Math.cos(angle) - facing.y * Math.sin(angle),
            y: facing.x * Math.sin(angle) + facing.y * Math.cos(angle),
        };
        const start = {
            x: center.x - facing.y * offset,
            y: center.y + facing.x * offset,
        };

        graphics
            .moveTo(start.x, start.y)
            .lineTo(
                start.x + (direction.x * shipViewCellSize) / 2,
                start.y + (direction.y * shipViewCellSize) / 2,
            )
            .stroke({
                alpha,
                color: barrelColor,
                width,
            });
    });
    graphics.circle(center.x, center.y, shipViewCellSize / 6).fill({
        alpha,
        color: barrelColor,
    });
}

/** Each gun kind gets its own barrel shape, so guns are told apart by more than color. */
const cellMarkerDrawers: Readonly<
    Record<
        CellKind,
        | ((
              params: Readonly<{
                  alpha: number;
                  center: Readonly<Coords>;
                  /** In view space, where +y is down. */
                  facing: Readonly<Coords>;
                  graphics: Graphics;
              }>,
          ) => void)
        | undefined
    >
> = {
    [CellKind.Hull]: undefined,
    [CellKind.Cockpit]({alpha, center, graphics}) {
        graphics.circle(center.x, center.y, shipViewCellSize / 4).fill({
            alpha,
            color: '#1c3d5a',
        });
    },
    [CellKind.Gun](params) {
        drawBarrels({
            ...params,
            barrels: [
                {
                    angle: 0,
                    offset: 0,
                },
            ],
            width: shipViewCellSize / 4,
        });
    },
    [CellKind.RapidGun](params) {
        drawBarrels({
            ...params,
            barrels: [
                {
                    angle: 0,
                    offset: -shipViewCellSize / 6,
                },
                {
                    angle: 0,
                    offset: shipViewCellSize / 6,
                },
            ],
            width: shipViewCellSize / 8,
        });
    },
    [CellKind.Shield]: undefined,
    [CellKind.SpreadGun](params) {
        drawBarrels({
            ...params,
            barrels: [
                {
                    angle: -0.6,
                    offset: 0,
                },
                {
                    angle: 0,
                    offset: 0,
                },
                {
                    angle: 0.6,
                    offset: 0,
                },
            ],
            width: shipViewCellSize / 8,
        });
    },
    [CellKind.Thruster]({alpha, center, facing, graphics}) {
        graphics
            .circle(
                center.x + (facing.x * shipViewCellSize) / 2,
                center.y + (facing.y * shipViewCellSize) / 2,
                shipViewCellSize / 5,
            )
            .fill({
                alpha,
                color: '#ffd60a',
            });
    },
    [CellKind.Magnet]({alpha, center, facing, graphics}) {
        const radius = shipViewCellSize / 4;
        const opening = Math.atan2(facing.y, facing.x);

        graphics
            .arc(center.x, center.y, radius, opening + Math.PI / 2, opening + (Math.PI * 3) / 2)
            .stroke({
                alpha,
                color: barrelColor,
                width: shipViewCellSize / 8,
            });
        [
            -1,
            1,
        ].forEach((side) => {
            graphics
                .circle(
                    center.x + facing.y * -side * radius,
                    center.y + facing.x * side * radius,
                    shipViewCellSize / 12,
                )
                .fill({
                    alpha,
                    color: '#ff453a',
                });
        });
    },
    [CellKind.MissileLauncher]({alpha, center, facing, graphics}) {
        [
            -1,
            1,
        ].forEach((side) => {
            const tubeCenter = {
                x: center.x - facing.y * side * (shipViewCellSize / 6),
                y: center.y + facing.x * side * (shipViewCellSize / 6),
            };

            graphics
                .circle(tubeCenter.x, tubeCenter.y, shipViewCellSize / 8)
                .fill({
                    alpha,
                    color: barrelColor,
                })
                .circle(
                    tubeCenter.x + (facing.x * shipViewCellSize) / 16,
                    tubeCenter.y + (facing.y * shipViewCellSize) / 16,
                    shipViewCellSize / 16,
                )
                .fill({
                    alpha,
                    color: '#ff453a',
                });
        });
    },
    [CellKind.NovaGun](params) {
        drawBarrels({
            ...params,
            barrels: createArray(8, (index) => {
                return {
                    angle: (index * Math.PI) / 4,
                    offset: 0,
                };
            }),
            width: shipViewCellSize / 10,
        });
    },
    [CellKind.Laser]({alpha, center, facing, graphics}) {
        graphics
            .moveTo(center.x, center.y)
            .lineTo(
                center.x + (facing.x * shipViewCellSize) / 2,
                center.y + (facing.y * shipViewCellSize) / 2,
            )
            .stroke({
                alpha,
                color: barrelColor,
                width: shipViewCellSize / 5,
            })
            .circle(center.x, center.y, shipViewCellSize / 5)
            .fill({
                alpha,
                color: barrelColor,
            })
            .circle(center.x, center.y, shipViewCellSize / 10)
            .fill({
                alpha,
                color: laserColor,
            });
    },
};

/** Draws each shield's bubble in ship view space. Broken shields only show a faint outline. */
export function drawShieldBubbles({
    cells,
    graphics,
    owner,
    shields,
}: Readonly<{
    cells: ReadonlyArray<Readonly<ShipCell>>;
    graphics: Graphics;
    owner: ShieldOwner;
    shields: ReadonlyArray<Readonly<ShieldState>>;
}>) {
    shields.forEach((shield) => {
        const fullness = getShieldFullness({
            cells,
            owner,
            shield,
        });
        const center = {
            x: (shield.x + 0.5) * shipViewCellSize,
            y: -(shield.y + 0.5) * shipViewCellSize,
        };
        const radius = shieldRadiusCells * shipViewCellSize;

        if (shield.isBroken) {
            graphics.circle(center.x, center.y, radius * fullness).stroke({
                alpha: 0.25,
                color: shieldColor,
                width: 2,
            });
        } else {
            graphics
                .circle(center.x, center.y, radius)
                .fill({
                    alpha: 0.08 + 0.14 * fullness,
                    color: shieldColor,
                })
                .stroke({
                    alpha: 0.3 + 0.6 * fullness,
                    color: shieldColor,
                    width: 3,
                });
        }
    });
}

/** Draws each laser beam in ship view space, from its cell's center out along its facing. */
export function drawLaserBeams({
    beams,
    cells,
    graphics,
}: Readonly<{
    beams: ShipFly['laserBeams'];
    cells: ReadonlyArray<Readonly<PieceCell>>;
    graphics: Graphics;
}>) {
    beams.forEach((beam) => {
        const cell = cells.find((gridCell) => gridCell.x === beam.x && gridCell.y === beam.y);

        if (!cell) {
            return;
        }

        const start = {
            x: (beam.x + 0.5) * shipViewCellSize,
            y: -(beam.y + 0.5) * shipViewCellSize,
        };
        /** The view's +y is down, the same as the world's. */
        const direction = toWorldVector({
            angle: 0,
            direction: cell.facing,
        });
        const length = (beam.lengthPx / flyCellSize) * shipViewCellSize;
        const end = {
            x: start.x + direction.x * length,
            y: start.y + direction.y * length,
        };

        graphics
            .moveTo(start.x, start.y)
            .lineTo(end.x, end.y)
            .stroke({
                alpha: 0.5,
                color: laserColor,
                width: shipViewCellSize / 2,
            })
            .moveTo(start.x, start.y)
            .lineTo(end.x, end.y)
            .stroke({
                color: '#ffffff',
                width: shipViewCellSize / 6,
            });
    });
}

/** Draws cells in ship view space, where each cell is `shipViewCellSize` wide and +y is up. */
export function drawShipCells({
    alpha,
    hullColor,
    cells,
    graphics,
}: Readonly<{
    alpha: number;
    cells: ReadonlyArray<
        Readonly<PieceCell & PartialWithUndefined<Pick<ShipCell, 'hp' | 'level'>>>
    >;
    hullColor: string;
    graphics: Graphics;
}>) {
    cells.forEach((cell) => {
        /** Ship space has +y toward the nose, which is up in the view. */
        const left = cell.x * shipViewCellSize;
        const top = -(cell.y + 1) * shipViewCellSize;
        const facingVector = directionVectors[cell.facing];
        const healthAlpha =
            cell.hp == undefined
                ? 1
                : 0.4 +
                  0.6 *
                      Math.min(
                          1,
                          cell.hp /
                              getMaxCellHp({
                                  kind: cell.kind,
                                  level: cell.level ?? 1,
                              }),
                      );
        const centerX = left + shipViewCellSize / 2;
        const centerY = top + shipViewCellSize / 2;

        graphics
            .rect(left, top, shipViewCellSize, shipViewCellSize)
            .fill({
                alpha: alpha * healthAlpha,
                color: getCellColor({
                    hullColor,
                    kind: cell.kind,
                }),
            })
            .stroke({
                alpha,
                color: '#111111',
                width: 2,
            });

        createArray((cell.level ?? 1) - 1, (pipIndex) => pipIndex).forEach((pipIndex) => {
            graphics
                .rect(
                    left + 3 + (pipIndex % levelPipsPerRow) * (levelPipSize + 2),
                    top + 3 + Math.floor(pipIndex / levelPipsPerRow) * (levelPipSize + 2),
                    levelPipSize,
                    levelPipSize,
                )
                .fill({
                    alpha,
                    color: '#ffffff',
                });
        });

        cellMarkerDrawers[cell.kind]?.({
            alpha,
            center: {
                x: centerX,
                y: centerY,
            },
            /** The view's +y is down, so the facing's y flips. */
            facing: {
                x: facingVector.x,
                y: -facingVector.y,
            },
            graphics,
        });
    });
}

/**
 * One player's ship. `RunEntity` drives its build and fly steps so that every ship steps in the
 * same order on every peer. The view's position, rotation, and scale are set by the camera.
 */
export class ShipEntity extends defineEntity({
    key: 'ShipEntity',
    paramsShape: defineShape({
        build: shipBuildShape,
        fly: shipFlyShape,
        grid: shipGridShape,
        /** The grid as it was when the ship last launched, after any building. */
        launchGrid: shipGridShape,
        playerId: multiplayerPlayerIdShape,
        profile: sharedPlayerProfileShape,
    }),
}) {
    protected readonly laserGraphics = new Graphics();
    protected readonly cellsGraphics = new Graphics();
    protected readonly shieldGraphics = new Graphics();
    protected readonly pieceGraphics = new Graphics();
    protected drawnGrid: Readonly<ShipGrid> | undefined;
    protected drawnActivePiece: ShipBuild['activePiece'];
    protected drawnFly: Readonly<ShipFly> | undefined;

    public override createView(): ViewCreation2d {
        const view = new Container();

        view.addChild(
            this.laserGraphics,
            this.cellsGraphics,
            this.shieldGraphics,
            this.pieceGraphics,
        );
        view.pivot.set(
            (shipGridSize.width * shipViewCellSize) / 2,
            -(shipGridSize.height * shipViewCellSize) / 2,
        );

        return {
            view,
        };
    }

    /** Ships are stepped by `RunEntity`. */
    public override update() {}

    public override render() {
        if (this.drawnGrid !== this.params.grid) {
            this.drawnGrid = this.params.grid;
            drawShipCells({
                alpha: 1,
                cells: this.params.grid.cells,
                graphics: this.cellsGraphics.clear(),
                hullColor: this.params.profile.color,
            });
        }

        if (this.drawnFly !== this.params.fly) {
            this.drawnFly = this.params.fly;
            drawShieldBubbles({
                cells: this.params.grid.cells,
                graphics: this.shieldGraphics.clear(),
                owner: ShieldOwner.Player,
                shields: this.params.fly.shields,
            });
            drawLaserBeams({
                beams: this.params.fly.laserBeams,
                cells: this.params.grid.cells,
                graphics: this.laserGraphics.clear(),
            });
        }

        if (this.drawnActivePiece !== this.params.build.activePiece) {
            this.drawnActivePiece = this.params.build.activePiece;
            this.drawActivePiece();
        }
    }

    public isWrecked() {
        return !hasCockpit(this.params.grid);
    }

    /** A wrecked ship goes back to how it was when it launched, keeping that launch's building. */
    public restoreIfWrecked() {
        if (this.isWrecked()) {
            this.params.grid = this.params.launchGrid;
        }
    }

    /** Restores every remaining part to full hp. Parts that were knocked off stay gone. */
    public healCells() {
        this.params.grid = {
            ...this.params.grid,
            cells: this.params.grid.cells.map((cell) => {
                return {
                    ...cell,
                    hp: getMaxCellHp(cell),
                };
            }),
        };
    }

    public startBuild(pieces: ReadonlyArray<Readonly<Piece>>) {
        this.stopFlying();
        this.params.build = startShipBuild({
            grid: this.params.grid,
            pieces,
        });
    }

    public moveActivePiece(direction: Direction) {
        const moved = moveActivePiece({
            build: this.params.build,
            direction,
            grid: this.params.grid,
        });

        this.params.build = moved || this.params.build;
        this.playSoundEffect(moved ? SoundEffect.PieceMove : SoundEffect.Denied);
    }

    public rotateActivePiece(isClockwise: boolean) {
        const rotated = rotateActivePiece({
            build: this.params.build,
            grid: this.params.grid,
            isClockwise,
        });

        this.params.build = rotated || this.params.build;
        this.playSoundEffect(rotated ? SoundEffect.PieceRotate : SoundEffect.Denied);
    }

    public swapActivePiece() {
        const swapped = swapActivePiece({
            build: this.params.build,
            grid: this.params.grid,
        });

        this.params.build = swapped || this.params.build;
        this.playSoundEffect(swapped ? SoundEffect.PieceSwap : SoundEffect.Denied);
    }

    /** Any pieces still left to place are given up. */
    public finishBuild() {
        this.params.build = {
            ...createFinishedShipBuild(),
            isReady: true,
        };
    }

    public placeActivePiece() {
        const placed = placeActivePiece({
            build: this.params.build,
            grid: this.params.grid,
        });

        if (placed) {
            this.params.build = {
                ...placed.build,
                undoSteps: [
                    ...this.params.build.undoSteps,
                    {
                        activePiece: this.params.build.activePiece,
                        grid: this.params.grid,
                        offers: this.params.build.offers,
                        selectedOfferIndex: this.params.build.selectedOfferIndex,
                    },
                ],
            };
            this.params.grid = placed.grid;
        }

        this.playSoundEffect(placed ? SoundEffect.PiecePlace : SoundEffect.Denied);
    }

    /** Puts the last placed piece back, right where it was before it was placed. */
    public undoPlacement() {
        const undoStep = this.params.build.undoSteps.at(-1);

        if (undoStep) {
            this.params.build = {
                ...this.params.build,
                activePiece: undoStep.activePiece,
                offers: undoStep.offers,
                selectedOfferIndex: undoStep.selectedOfferIndex,
                undoSteps: this.params.build.undoSteps.slice(0, -1),
            };
            this.params.grid = undoStep.grid;
        }

        this.playSoundEffect(undoStep ? SoundEffect.MenuBack : SoundEffect.Denied);
    }

    public startFlying(position: Readonly<Coords>) {
        this.params.launchGrid = this.params.grid;
        this.params.fly = {
            ...this.params.fly,
            gunElapsedMs: 0,
            laserBeams: [],
            shields: [],
            x: position.x,
            y: position.y,
        };
    }

    /** Turns off the ship's lasers and shields, which only show while flying. */
    public stopFlying() {
        this.params.fly = {
            ...this.params.fly,
            laserBeams: [],
            shields: [],
        };
    }

    public setLaserBeams(laserBeams: ShipFly['laserBeams']) {
        this.params.fly = {
            ...this.params.fly,
            laserBeams,
        };
    }

    public setShields(shields: ShipFly['shields']) {
        this.params.fly = {
            ...this.params.fly,
            shields,
        };
    }

    /** Moves the ship straight up by `distancePx`, past the top of the screen if needed. */
    public flyUp(distancePx: number) {
        this.params.fly = {
            ...this.params.fly,
            y: this.params.fly.y - distancePx,
        };
    }

    public isAboveScreen() {
        return this.params.fly.y + (shipGridSize.height * flyCellSize) / 2 < 0;
    }

    public steer(steering: Readonly<Coords>) {
        this.params.fly = {
            ...this.params.fly,
            steering: sanitizeSteering(steering),
        };
    }

    /** Moves the ship, recharges its shields, and fires each gun whose interval has come around. */
    public async stepFly(frameMs: number) {
        const previousGunElapsedMs = this.params.fly.gunElapsedMs;
        const gunElapsedMs = previousGunElapsedMs + frameMs;

        this.params.fly = {
            ...moveShip({
                fly: this.params.fly,
                frameMs,
                grid: this.params.grid,
            }),
            gunElapsedMs,
            shields: stepShields({
                cells: this.params.grid.cells,
                frameMs,
                owner: ShieldOwner.Player,
                shields: this.params.fly.shields,
            }),
        };

        const firingGuns = this.params.grid.cells
            .map((cell) => {
                return {
                    cell,
                    stats: gunStats[cell.kind],
                };
            })
            .filter(({stats}) => {
                return (
                    !!stats &&
                    Math.floor(gunElapsedMs / stats.fireIntervalMs) >
                        Math.floor(previousGunElapsedMs / stats.fireIntervalMs)
                );
            });

        /** Guns of a kind fire on the same frame, so throttling drops all but the first sound. */
        firingGuns.forEach(({cell}) => {
            const effect = gunSoundEffects[cell.kind];

            if (effect) {
                this.playSoundEffect(effect);
            }
        });

        /**
         * Sequential because `addEntity` only inserts into the entity store after an async
         * `initInstance`, and store order must match on every peer.
         */
        await awaitedForEach(firingGuns, async ({cell, stats}) => {
            const cellCenter = getCellWorldCenter({
                cell,
                fly: this.params.fly,
            });

            const isMissile = !!stats?.isMissile;
            const speed = playerBulletSpeedPxPerMs * (isMissile ? missileSpeedFactor : 1);

            await awaitedForEach(stats?.bulletAngles || [], async (angle) => {
                const worldVector = toWorldVector({
                    angle,
                    direction: cell.facing,
                });

                await this.addEntity(BulletEntity, {
                    ageMs: 0,
                    damage: cell.level,
                    isMissile,
                    side: BulletSide.Player,
                    velocityX: worldVector.x * speed,
                    velocityY: worldVector.y * speed,
                    x: cellCenter.x,
                    y: cellCenter.y,
                });
            });
        });
    }

    /** Damages the cell at `position`, turning everything it knocks off into debris. */
    public async damageCell({damage, position}: Readonly<{damage: number; position: Coords}>) {
        const damageResult = damageShipCell({
            damage,
            grid: this.params.grid,
            position,
        });

        if (!damageResult) {
            return;
        }

        const wasWrecked = this.isWrecked();

        this.params.grid = damageResult.grid;
        this.playSoundEffect(
            !wasWrecked && this.isWrecked()
                ? SoundEffect.ShipWrecked
                : damageResult.removedCells.length
                  ? SoundEffect.ShipCellDestroyed
                  : SoundEffect.ShipHit,
        );

        await awaitedForEach(damageResult.removedCells, async (cell) => {
            const cellCenter = getCellWorldCenter({
                cell,
                fly: this.params.fly,
            });

            await this.addEntity(DebrisEntity, {
                ageMs: 0,
                color: getCellColor({
                    hullColor: this.params.profile.color,
                    kind: cell.kind,
                }),
                velocityX: (this.state.seededRandom.next() * 2 - 1) * debrisMaxSpeedPxPerMs,
                velocityY: (this.state.seededRandom.next() * 2 - 1) * debrisMaxSpeedPxPerMs,
                x: cellCenter.x,
                y: cellCenter.y,
            });
        });
    }

    protected playSoundEffect(effect: SoundEffect) {
        soundEffectPlayer.play({
            audioPlayer: this.state.audioPlayer,
            effect,
        });
    }

    protected drawActivePiece() {
        const activePiece = this.params.build.activePiece;

        this.pieceGraphics.clear();

        if (!activePiece) {
            return;
        }

        const cells = getPlacedPieceCells({
            piece: activePiece.piece,
            position: activePiece.position,
        });
        const canPlace = canPlaceActivePiece({
            build: this.params.build,
            grid: this.params.grid,
        });

        drawShipCells({
            alpha: canPlace ? 1 : invalidPieceAlpha,
            cells,
            graphics: this.pieceGraphics,
            hullColor: this.params.profile.color,
        });
        cells.forEach((cell) => {
            this.pieceGraphics.rect(
                cell.x * shipViewCellSize,
                -(cell.y + 1) * shipViewCellSize,
                shipViewCellSize,
                shipViewCellSize,
            );
        });
        this.pieceGraphics.stroke({
            color: canPlace ? '#ffffff' : '#ff375f',
            width: 4,
        });
    }
}

/** Every ship in player ID order, which is the same on every peer. */
export function getSortedShips(entityStore: Readonly<Pick<EntityStore2d, 'getEntities'>>) {
    return [
        ...entityStore.getEntities(ShipEntity),
    ].toSorted((first, second) => {
        /** Not `localeCompare`, which can sort differently depending on the browser's locale. */
        return first.params.playerId < second.params.playerId ? -1 : 1;
    });
}

export function findShip({
    entityStore,
    playerId,
}: Readonly<{
    entityStore: Readonly<Pick<EntityStore2d, 'getEntities'>>;
    playerId: MultiplayerPlayerId;
}>) {
    return [
        ...entityStore.getEntities(ShipEntity),
    ].find((ship) => ship.params.playerId === playerId);
}
