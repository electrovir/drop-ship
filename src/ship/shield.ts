import {type Coords} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {getDistanceSquared} from '../util/distance.js';
import {CellKind, type ShipCell} from './ship-cell.js';

/** A shield bubble's radius, in cells. */
export const shieldRadiusCells = 1.6;

export enum ShieldOwner {
    Enemy = 'enemy',
    Player = 'player',
}

/** Player shields are much stronger, so enemy shields only slow the player down. */
const shieldEnergyPerLevel: Readonly<Record<ShieldOwner, number>> = {
    [ShieldOwner.Enemy]: 2,
    [ShieldOwner.Player]: 6,
};
/** A shield that hasn't been hit for this long starts recharging quickly. */
const quickRechargeDelayMs = 1200;
const quickFullRechargeMs = 2000;
/** A broken shield is down until it has slowly recharged all the way. */
const brokenFullRechargeMs = 8000;

/** `x` and `y` are the shield cell's position in its grid. */
export const shieldStateShape = defineShape({
    energy: 0,
    isBroken: false,
    msSinceHit: 0,
    x: 0,
    y: 0,
});

export type ShieldState = typeof shieldStateShape.runtimeType;

/** How much damage a shield of `level` absorbs before it breaks. */
export function getShieldCapacity({
    level,
    owner,
}: Readonly<{
    level: number;
    owner: ShieldOwner;
}>) {
    return shieldEnergyPerLevel[owner] * level;
}

function findShieldCell({
    cells,
    shield,
}: Readonly<{
    cells: ReadonlyArray<Readonly<ShipCell>>;
    shield: Readonly<Coords>;
}>) {
    return cells.find((cell) => {
        return cell.kind === CellKind.Shield && cell.x === shield.x && cell.y === shield.y;
    });
}

/**
 * Recharges every shield for one frame. Shield cells without a state yet start fully charged, and
 * states whose shield cell is gone are dropped.
 */
export function stepShields({
    cells,
    frameMs,
    owner,
    shields,
}: Readonly<{
    cells: ReadonlyArray<Readonly<ShipCell>>;
    frameMs: number;
    owner: ShieldOwner;
    shields: ReadonlyArray<Readonly<ShieldState>>;
}>) {
    return cells
        .filter((cell) => cell.kind === CellKind.Shield)
        .map((cell): ShieldState => {
            const capacity = getShieldCapacity({
                level: cell.level,
                owner,
            });
            const shield = shields.find((state) => state.x === cell.x && state.y === cell.y);

            if (!shield) {
                return {
                    energy: capacity,
                    isBroken: false,
                    msSinceHit: 0,
                    x: cell.x,
                    y: cell.y,
                };
            }

            const msSinceHit = shield.msSinceHit + frameMs;
            const recharge = shield.isBroken
                ? (capacity * frameMs) / brokenFullRechargeMs
                : msSinceHit >= quickRechargeDelayMs
                  ? (capacity * frameMs) / quickFullRechargeMs
                  : 0;
            const energy = Math.min(capacity, shield.energy + recharge);

            return {
                ...shield,
                energy,
                isBroken: shield.isBroken && energy < capacity,
                msSinceHit,
            };
        });
}

/**
 * The index of the first shield that is up and whose bubble touches `circle`, or -1. `getCenter`
 * turns a shield cell's grid position into a world position.
 */
export function findShieldTouchingCircle({
    cellSize,
    cells,
    circle,
    getCenter,
    shields,
}: Readonly<{
    cellSize: number;
    cells: ReadonlyArray<Readonly<ShipCell>>;
    circle: Readonly<Coords & {radius: number}>;
    getCenter: (cell: Readonly<Coords>) => Coords;
    shields: ReadonlyArray<Readonly<ShieldState>>;
}>) {
    const reach = shieldRadiusCells * cellSize + circle.radius;

    return shields.findIndex((shield) => {
        return (
            !shield.isBroken &&
            !!findShieldCell({
                cells,
                shield,
            }) &&
            getDistanceSquared({
                first: getCenter(shield),
                second: circle,
            }) <=
                reach * reach
        );
    });
}

/** Takes `damage` out of the shield at `index`, breaking it once its energy runs out. */
export function damageShield({
    damage,
    index,
    shields,
}: Readonly<{
    damage: number;
    index: number;
    shields: ReadonlyArray<Readonly<ShieldState>>;
}>) {
    return shields.map((shield, shieldIndex) => {
        if (shieldIndex !== index) {
            return shield;
        }

        const energy = Math.max(0, shield.energy - damage);

        return {
            ...shield,
            energy,
            isBroken: !energy,
            msSinceHit: 0,
        };
    });
}

/** How full each shield is, from 0 to 1, for drawing its bubble. */
export function getShieldFullness({
    cells,
    owner,
    shield,
}: Readonly<{
    cells: ReadonlyArray<Readonly<ShipCell>>;
    owner: ShieldOwner;
    shield: Readonly<ShieldState>;
}>) {
    const cell = findShieldCell({
        cells,
        shield,
    });

    return cell
        ? shield.energy /
              getShieldCapacity({
                  level: cell.level,
                  owner,
              })
        : 0;
}
