// cspell:word tetromino
import {type ViewCreation2d} from '@antha/entity-2d';
import {Container, Graphics} from '@antha/graphics-2d';
import {normalizeVector2d} from '@antha/util';
import {awaitedForEach, type Coords} from '@augment-vir/common';
import {defineShape, enumShape} from 'object-shape-tester';
import {soundEffectPlayer} from '../audio/game-sound-effect-player.js';
import {SoundEffect} from '../audio/sound-effect.js';
import {BulletEntity, BulletSide, missileSpeedFactor} from '../bullet/bullet.entity.js';
import {createFragmentScatterVelocity, FragmentEntity} from '../fragment/fragment.entity.js';
import {defineEntity} from '../game-state/game-entity.mod.js';
import {gameWorldSize} from '../game-state/game-world.js';
import {ShieldOwner, shieldStateShape, stepShields} from '../ship/shield.js';
import {CellKind, defaultCellFacings, getMaxCellHp, type ShipCell} from '../ship/ship-cell.js';
import {flyCellSize, gunStats, isSquareTouchingCircle} from '../ship/ship-fly.js';
import {damageShipCell, hasCockpit, shipGridShape, type ShipGrid} from '../ship/ship-grid.js';
import {drawShieldBubbles, drawShipCells, shipViewCellSize} from '../ship/ship.entity.js';
import {getDistanceSquared} from '../util/distance.js';
import {EnemyKind} from './enemy-kind.js';

const enemyBulletSpeedPxPerMs = 0.35;
/**
 * How far from the target's center a volley can aim, along each axis. Small ships get missed now
 * and then while big ones still get hit.
 */
const maxAimOffsetPx = flyCellSize * 3;
const weaveAmplitudePx = 120;
const weaveRadiansPerMs = 0.003;
const diveStartY = 320;
const diveSpeedPxPerMs = 0.5;
const bossHoverY = 200;
const bossSwayAmplitudePx = 600;
const bossSwayRadiansPerMs = 0.0008;

export const enemyCellSize = 16;
/** Scales ship view cells down to enemy cells. */
const enemyViewScale = enemyCellSize / shipViewCellSize;
/** An enemy that lost every thruster still moves at this fraction of its speed. */
const minThrusterSpeedFactor = 0.5;

type EnemyLayoutCell = Readonly<Pick<ShipCell, 'kind' | 'x' | 'y'>>;

export const enemyStats: Readonly<
    Record<
        EnemyKind,
        Readonly<{
            /**
             * Cells in ship space, so +y points toward the enemy's nose. Must include one cockpit
             * cell at 0,0: the enemy's core. Every enemy also has a hull tetromino.
             */
            cells: ReadonlyArray<EnemyLayoutCell>;
            color: string;
            /** Damage dealt to each ship cell the enemy touches. */
            contactDamage: number;
            coreHp: number;
            /** Every gun cell fires on this interval. */
            fireIntervalMs: number | undefined;
            /** Extra core hp for each point of system difficulty. */
            hpPerWave: number;
            speedPxPerMs: number;
        }>
    >
> = {
    [EnemyKind.Straight]: {
        cells: [
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: 1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: 1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: 2,
            },
        ],
        color: '#ff6b6b',
        contactDamage: 1,
        coreHp: 1,
        fireIntervalMs: undefined,
        hpPerWave: 0,
        speedPxPerMs: 0.18,
    },
    [EnemyKind.Shooter]: {
        cells: [
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.Gun,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: 0,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -2,
            },
        ],
        color: '#c77dff',
        contactDamage: 1,
        coreHp: 2,
        fireIntervalMs: 1400,
        hpPerWave: 0,
        speedPxPerMs: 0.08,
    },
    [EnemyKind.Tank]: {
        cells: [
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.MissileLauncher,
                x: 0,
                y: 2,
            },
            {
                kind: CellKind.Shield,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.RapidGun,
                x: -1,
                y: 1,
            },
            {
                kind: CellKind.RapidGun,
                x: 1,
                y: 1,
            },
            {
                kind: CellKind.Shield,
                x: -1,
                y: 0,
            },
            {
                kind: CellKind.Shield,
                x: 1,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: -2,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -2,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: -2,
            },
        ],
        color: '#8d99ae',
        contactDamage: 3,
        coreHp: 4,
        fireIntervalMs: 2200,
        hpPerWave: 0,
        speedPxPerMs: 0.05,
    },
    [EnemyKind.Weaver]: {
        cells: [
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.Shield,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: 0,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -2,
            },
        ],
        color: '#4cc9f0',
        contactDamage: 1,
        coreHp: 1,
        fireIntervalMs: undefined,
        hpPerWave: 0,
        speedPxPerMs: 0.12,
    },
    [EnemyKind.Diver]: {
        cells: [
            {
                kind: CellKind.Shield,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: 2,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: 2,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: 2,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: 3,
            },
        ],
        color: '#f77f00',
        contactDamage: 2,
        coreHp: 2,
        fireIntervalMs: undefined,
        hpPerWave: 0,
        speedPxPerMs: 0.1,
    },
    [EnemyKind.Boss]: {
        cells: [
            {
                kind: CellKind.SpreadGun,
                x: -2,
                y: 2,
            },
            {
                kind: CellKind.RapidGun,
                x: -1,
                y: 2,
            },
            {
                kind: CellKind.Shield,
                x: 0,
                y: 2,
            },
            {
                kind: CellKind.RapidGun,
                x: 1,
                y: 2,
            },
            {
                kind: CellKind.SpreadGun,
                x: 2,
                y: 2,
            },
            {
                kind: CellKind.Gun,
                x: -2,
                y: 1,
            },
            {
                kind: CellKind.Shield,
                x: -1,
                y: 1,
            },
            {
                kind: CellKind.Shield,
                x: 0,
                y: 1,
            },
            {
                kind: CellKind.Shield,
                x: 1,
                y: 1,
            },
            {
                kind: CellKind.Gun,
                x: 2,
                y: 1,
            },
            {
                kind: CellKind.Thruster,
                x: -2,
                y: 0,
            },
            {
                kind: CellKind.Shield,
                x: -1,
                y: 0,
            },
            {
                kind: CellKind.Cockpit,
                x: 0,
                y: 0,
            },
            {
                kind: CellKind.Shield,
                x: 1,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: 2,
                y: 0,
            },
            {
                kind: CellKind.Thruster,
                x: -1,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 0,
                y: -1,
            },
            {
                kind: CellKind.Thruster,
                x: 1,
                y: -1,
            },
            {
                kind: CellKind.Hull,
                x: -1,
                y: -2,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -2,
            },
            {
                kind: CellKind.Hull,
                x: 1,
                y: -2,
            },
            {
                kind: CellKind.Hull,
                x: 0,
                y: -3,
            },
            {
                kind: CellKind.MissileLauncher,
                x: 0,
                y: 3,
            },
            {
                kind: CellKind.NovaGun,
                x: -2,
                y: -1,
            },
            {
                kind: CellKind.NovaGun,
                x: 2,
                y: -1,
            },
            {
                kind: CellKind.Magnet,
                x: -2,
                y: -2,
            },
            {
                kind: CellKind.Laser,
                x: 2,
                y: -2,
            },
        ],
        color: '#ff006e',
        contactDamage: 3,
        coreHp: 15,
        fireIntervalMs: 1500,
        hpPerWave: 4,
        speedPxPerMs: 0.06,
    },
};

/**
 * A fresh grid for an enemy of `kind`. Tougher systems give its core more hp, and in the easiest
 * systems every other cell has half the hp a player's cell would.
 */
export function createEnemyGrid({
    difficulty,
    kind,
}: Readonly<{
    difficulty: number;
    kind: EnemyKind;
}>) {
    const stats = enemyStats[kind];
    const maxShieldCount = getMaxEnemyShieldCount({
        difficulty,
        kind,
    });

    return {
        cells: stats.cells
            .map((cell, index) => {
                const earlierShieldCount = stats.cells
                    .slice(0, index)
                    .filter((earlierCell) => earlierCell.kind === CellKind.Shield).length;

                return cell.kind === CellKind.Shield && earlierShieldCount >= maxShieldCount
                    ? {
                          ...cell,
                          kind: CellKind.Hull,
                      }
                    : cell;
            })
            .map((cell) => {
                return {
                    ...cell,
                    facing: defaultCellFacings[cell.kind],
                    hp:
                        cell.kind === CellKind.Cockpit
                            ? stats.coreHp + Math.floor(stats.hpPerWave * difficulty)
                            : Math.max(
                                  1,
                                  Math.floor(
                                      getMaxCellHp({
                                          kind: cell.kind,
                                          level: 1,
                                      }) * (difficulty < 4 ? 0.5 : 1),
                                  ),
                              ),
                    level: 1,
                };
            }),
    };
}

/**
 * Bosses gain shields with difficulty, so early bosses aren't walls of shields. Extra shield cells
 * in the layout become hull. Other enemies keep all of theirs.
 */
function getMaxEnemyShieldCount({
    difficulty,
    kind,
}: Readonly<{
    difficulty: number;
    kind: EnemyKind;
}>) {
    return kind === EnemyKind.Boss ? Math.max(1, Math.floor(difficulty / 3)) : Infinity;
}

/**
 * The most enemy bullets that can be on screen at once. Enemies hold their fire past it. The
 * easiest systems allow fewer, up to the first hard system.
 */
export function getMaxEnemyBulletCount(difficulty: number) {
    return 4 + difficulty * 2 - Math.ceil(Math.max(0, 4 - difficulty) / 2);
}

/** Enemies in the easiest systems wait longer between shots. From the first hard system on, it's 1. */
export function getEnemyFireIntervalMultiplier(difficulty: number) {
    return 1 + Math.max(0, 4 - difficulty) * 0.5;
}

/** The distance from the core's center that covers every cell of a fresh enemy of `kind`. */
export function getEnemyRadius(kind: EnemyKind) {
    const reach = Math.max(
        ...enemyStats[kind].cells.flatMap((cell) => {
            return [
                Math.abs(cell.x),
                Math.abs(cell.y),
            ];
        }),
    );

    return (reach + 1) * enemyCellSize;
}

function countThrusters(cells: ReadonlyArray<Readonly<Pick<ShipCell, 'kind'>>>) {
    return cells.filter((cell) => cell.kind === CellKind.Thruster).length;
}

export const enemyParamsShape = defineShape({
    ageMs: 0,
    /** The enemy can't hit a ship again by touching it until this runs out. */
    contactCooldownMs: 0,
    fireCooldownMs: 0,
    /** Scales the kind's fire interval, so enemies in easy systems shoot less often. */
    fireIntervalMultiplier: 0,
    /** Cell positions are offsets from the core, in ship space. */
    grid: shipGridShape,
    kind: enumShape(EnemyKind),
    /** One entry for each shield cell. */
    shields: [
        shieldStateShape,
    ],
    spawnX: 0,
    speedMultiplier: 0,
    /** Only used once a diver starts its dive. */
    velocityX: 0,
    velocityY: 0,
    x: 0,
    y: 0,
});

type EnemyParams = typeof enemyParamsShape.runtimeType;

function createDiveVelocity({
    enemy,
    speedFactor,
    target,
}: Readonly<{
    enemy: Readonly<EnemyParams>;
    speedFactor: number;
    target: Readonly<Coords> | undefined;
}>) {
    const direction = normalizeVector2d(
        target
            ? {
                  x: target.x - enemy.x,
                  y: target.y - enemy.y,
              }
            : {
                  x: 0,
                  y: 1,
              },
    );

    return {
        x: direction.x * diveSpeedPxPerMs * enemy.speedMultiplier * speedFactor,
        y: direction.y * diveSpeedPxPerMs * enemy.speedMultiplier * speedFactor,
    };
}

/** Each kind's movement for one frame. */
const enemyMovers: Readonly<
    Record<
        EnemyKind,
        (
            params: Readonly<{
                enemy: Readonly<EnemyParams>;
                /** How far the enemy's own speed takes it this frame. */
                distance: number;
                frameMs: number;
                /** How much lost thrusters slow the enemy down. */
                speedFactor: number;
                target: Readonly<Coords> | undefined;
            }>,
        ) => Partial<Pick<EnemyParams, 'velocityX' | 'velocityY' | 'x' | 'y'>>
    >
> = {
    [EnemyKind.Straight]({distance, enemy}) {
        return {
            y: enemy.y + distance,
        };
    },
    [EnemyKind.Shooter]({distance, enemy}) {
        return {
            y: enemy.y + distance,
        };
    },
    [EnemyKind.Tank]({distance, enemy}) {
        return {
            y: enemy.y + distance,
        };
    },
    [EnemyKind.Weaver]({distance, enemy}) {
        return {
            x: enemy.spawnX + Math.sin(enemy.ageMs * weaveRadiansPerMs) * weaveAmplitudePx,
            y: enemy.y + distance,
        };
    },
    /** Locks in its dive velocity once it reaches the dive line, so it can be dodged. */
    [EnemyKind.Diver]({distance, enemy, frameMs, speedFactor, target}) {
        const isDiving = !!enemy.velocityX || !!enemy.velocityY;

        if (!isDiving && enemy.y < diveStartY) {
            return {
                y: enemy.y + distance,
            };
        }

        const velocity = isDiving
            ? {
                  x: enemy.velocityX,
                  y: enemy.velocityY,
              }
            : createDiveVelocity({
                  enemy,
                  speedFactor,
                  target,
              });

        return {
            velocityX: velocity.x,
            velocityY: velocity.y,
            x: enemy.x + velocity.x * frameMs,
            y: enemy.y + velocity.y * frameMs,
        };
    },
    [EnemyKind.Boss]({distance, enemy}) {
        return {
            x: enemy.spawnX + Math.sin(enemy.ageMs * bossSwayRadiansPerMs) * bossSwayAmplitudePx,
            y: Math.min(enemy.y + distance, bossHoverY),
        };
    },
};

const destroyedSoundEffects: Readonly<Record<EnemyKind, SoundEffect>> = {
    [EnemyKind.Straight]: SoundEffect.EnemyDestroyed,
    [EnemyKind.Shooter]: SoundEffect.EnemyDestroyed,
    [EnemyKind.Tank]: SoundEffect.LargeEnemyDestroyed,
    [EnemyKind.Weaver]: SoundEffect.EnemyDestroyed,
    [EnemyKind.Diver]: SoundEffect.EnemyDestroyed,
    [EnemyKind.Boss]: SoundEffect.BossDestroyed,
};

function isOffScreen({x, y, radius}: Readonly<Coords & {radius: number}>) {
    return y > gameWorldSize.height + radius || x < -radius || x > gameWorldSize.width + radius;
}

/**
 * Enemies are small ships made of cells, flying nose first down the screen. Shooting off a part
 * disables it and drops fragments. Destroying the core destroys the enemy. `RunEntity` steps them
 * and resolves their hits.
 */
export class EnemyEntity extends defineEntity({
    key: 'EnemyEntity',
    paramsShape: enemyParamsShape,
    paramsMap: {
        view: {
            x: true,
            y: true,
        },
    },
}) {
    protected readonly cellsGraphics = new Graphics();
    protected readonly shieldGraphics = new Graphics();
    protected drawnGrid: Readonly<ShipGrid> | undefined;
    protected drawnShields: EnemyParams['shields'] | undefined;

    public override createView(): ViewCreation2d {
        const view = new Container();

        view.addChild(this.cellsGraphics, this.shieldGraphics);
        /** Centers the core on the enemy's position and turns the nose down the screen. */
        view.pivot.set(shipViewCellSize / 2, -shipViewCellSize / 2);
        view.scale.set(enemyViewScale);
        view.rotation = Math.PI;

        return {
            view,
        };
    }

    /** Enemies are stepped by `RunEntity`. */
    public override update() {}

    public override render() {
        if (this.drawnGrid !== this.params.grid) {
            this.drawnGrid = this.params.grid;
            drawShipCells({
                alpha: 1,
                hullColor: enemyStats[this.params.kind].color,
                cells: this.params.grid.cells,
                graphics: this.cellsGraphics.clear(),
            });
        }

        if (this.drawnShields !== this.params.shields) {
            this.drawnShields = this.params.shields;
            drawShieldBubbles({
                cells: this.params.grid.cells,
                graphics: this.shieldGraphics.clear(),
                owner: ShieldOwner.Enemy,
                shields: this.params.shields,
            });
        }
    }

    public getCellWorldCenter(cell: Readonly<Coords>) {
        return {
            x: this.params.x - cell.x * enemyCellSize,
            y: this.params.y + cell.y * enemyCellSize,
        };
    }

    /** Of the cells the circle touches, the one closest to the circle's center. */
    public findCellTouchingCircle(circle: Readonly<Coords & {radius: number}>) {
        return this.params.grid.cells
            .map((cell) => {
                return {
                    cell,
                    center: this.getCellWorldCenter(cell),
                };
            })
            .filter(({center}) => {
                return isSquareTouchingCircle({
                    circle,
                    square: {
                        ...center,
                        size: enemyCellSize,
                    },
                });
            })
            .reduce<
                | {
                      cell: ShipCell;
                      distanceSquared: number;
                  }
                | undefined
            >((closest, {cell, center}) => {
                const distanceSquared = getDistanceSquared({
                    first: center,
                    second: circle,
                });

                return !closest || distanceSquared < closest.distanceSquared
                    ? {
                          cell,
                          distanceSquared,
                      }
                    : closest;
            }, undefined)?.cell;
    }

    /** Each cell as the circle inscribed in its square, for checking contact with ships. */
    public getCellCircles() {
        return this.params.grid.cells.map((cell) => {
            return {
                ...this.getCellWorldCenter(cell),
                radius: enemyCellSize / 2,
            };
        });
    }

    /** Moves the enemy straight down the screen, leaving it once it's off screen. */
    public flee(distance: number) {
        this.params.y += distance;

        if (
            isOffScreen({
                ...this.params,
                radius: getEnemyRadius(this.params.kind),
            })
        ) {
            this.immediatelyDestroy();
        }
    }

    public findCore() {
        return this.params.grid.cells.find((cell) => cell.kind === CellKind.Cockpit);
    }

    /**
     * Moves the enemy and, for enemies that shoot, fires every remaining gun at the closest target.
     * Targets are compared in the order given, so the first of two equally close targets wins.
     * Losing thrusters slows the enemy down. An enemy that can't fire stays ready to fire until it
     * can. Returns how many bullets it fired.
     */
    public async step({
        bulletBudget,
        frameMs,
        targets,
    }: Readonly<{
        /** The most bullets this enemy may fire this frame. Bullets past it are skipped. */
        bulletBudget: number;
        frameMs: number;
        targets: ReadonlyArray<Readonly<Coords>>;
    }>) {
        const stats = enemyStats[this.params.kind];
        const target = this.findClosestTarget(targets);
        const initialThrusterCount = countThrusters(stats.cells);
        const speedFactor = initialThrusterCount
            ? minThrusterSpeedFactor +
              ((1 - minThrusterSpeedFactor) * countThrusters(this.params.grid.cells)) /
                  initialThrusterCount
            : 1;

        Object.assign(
            this.params,
            enemyMovers[this.params.kind]({
                distance: stats.speedPxPerMs * this.params.speedMultiplier * speedFactor * frameMs,
                enemy: this.params,
                frameMs,
                speedFactor,
                target,
            }),
        );
        this.params.ageMs += frameMs;
        this.params.shields = stepShields({
            cells: this.params.grid.cells,
            frameMs,
            owner: ShieldOwner.Enemy,
            shields: this.params.shields,
        });
        this.params.contactCooldownMs = Math.max(0, this.params.contactCooldownMs - frameMs);

        if (
            isOffScreen({
                ...this.params,
                radius: getEnemyRadius(this.params.kind),
            })
        ) {
            this.immediatelyDestroy();
            return 0;
        } else if (stats.fireIntervalMs == undefined) {
            return 0;
        }

        this.params.fireCooldownMs -= frameMs;

        if (this.params.fireCooldownMs > 0 || !target || bulletBudget <= 0) {
            return 0;
        }

        this.params.fireCooldownMs += stats.fireIntervalMs * this.params.fireIntervalMultiplier;

        const guns = this.params.grid.cells
            .map((cell) => {
                return {
                    cell,
                    stats: gunStats[cell.kind],
                };
            })
            .filter(({stats}) => !!stats);

        if (!guns.length) {
            return 0;
        }

        soundEffectPlayer.play({
            audioPlayer: this.state.audioPlayer,
            effect: SoundEffect.EnemyShot,
        });

        const aimPoint = {
            x: target.x + (this.state.seededRandom.next() * 2 - 1) * maxAimOffsetPx,
            y: target.y + (this.state.seededRandom.next() * 2 - 1) * maxAimOffsetPx,
        };

        const bullets = guns
            .flatMap((gun) => {
                const origin = this.getCellWorldCenter(gun.cell);
                const direction = normalizeVector2d({
                    x: aimPoint.x - origin.x,
                    y: aimPoint.y - origin.y,
                });
                const isMissile = !!gun.stats?.isMissile;
                const speed = enemyBulletSpeedPxPerMs * (isMissile ? missileSpeedFactor : 1);

                return (gun.stats?.bulletAngles || []).map((angle) => {
                    return {
                        ageMs: 0,
                        damage: 1,
                        isMissile,
                        side: BulletSide.Enemy,
                        velocityX:
                            (direction.x * Math.cos(angle) - direction.y * Math.sin(angle)) * speed,
                        velocityY:
                            (direction.x * Math.sin(angle) + direction.y * Math.cos(angle)) * speed,
                        x: origin.x,
                        y: origin.y,
                    };
                });
            })
            .slice(0, bulletBudget);

        /** Sequential so bullets enter the entity store in the same order on every peer. */
        await awaitedForEach(bullets, async (bullet) => {
            await this.addEntity(BulletEntity, bullet);
        });

        return bullets.length;
    }

    /**
     * Damages the cell at `position`. A broken part, and every part it was holding on, drops a
     * fragment of its kind. Breaking the core destroys the enemy, and its other parts only become
     * debris. Returns `true` when the damage destroys the enemy.
     */
    public async damageCell({damage, position}: Readonly<{damage: number; position: Coords}>) {
        const damageResult = damageShipCell({
            damage,
            grid: this.params.grid,
            position,
        });

        if (!damageResult) {
            return false;
        }

        const isDestroyed = !hasCockpit(damageResult.grid);

        this.params.grid = damageResult.grid;
        soundEffectPlayer.play({
            audioPlayer: this.state.audioPlayer,
            effect: isDestroyed ? destroyedSoundEffects[this.params.kind] : SoundEffect.EnemyHit,
        });

        /**
         * Sequential because `addEntity` only inserts into the entity store after an async
         * `initInstance`, and store order must match on every peer.
         */
        await awaitedForEach(damageResult.removedCells, async (cell) => {
            const center = this.getCellWorldCenter(cell);

            await this.addEntity(FragmentEntity, {
                ...createFragmentScatterVelocity(this.state.seededRandom),
                ageMs: 0,
                isReward: false,
                kind: cell.kind,
                x: center.x,
                y: center.y,
            });
        });

        if (isDestroyed) {
            this.immediatelyDestroy();
        }

        return isDestroyed;
    }

    protected findClosestTarget(targets: ReadonlyArray<Readonly<Coords>>) {
        return targets.reduce<Readonly<Coords> | undefined>((closest, target) => {
            return !closest ||
                getDistanceSquared({
                    first: target,
                    second: this.params,
                }) <
                    getDistanceSquared({
                        first: closest,
                        second: this.params,
                    })
                ? target
                : closest;
        }, undefined);
    }
}
