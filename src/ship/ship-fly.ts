import {clamp, createArray, type Coords, type PartialWithUndefined} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {gameWorldSize} from '../game-state/game-world.js';
import {getDistanceSquared} from '../util/distance.js';
import {shieldStateShape} from './shield.js';
import {CellKind, directionVectors, type Direction} from './ship-cell.js';
import {findShipCell, shipGridSize, sumShipCellLevels, type ShipGrid} from './ship-grid.js';

/** The size of one ship cell, in world pixels, while flying. */
export const flyCellSize = 14;

/** How each kind of gun fires. Each bullet deals the gun's level in damage. */
export const gunStats: Readonly<
    Record<
        CellKind,
        | (Readonly<{
              /** Each bullet's angle in radians away from the gun's facing. */
              bulletAngles: ReadonlyArray<number>;
              fireIntervalMs: number;
          }> &
              PartialWithUndefined<{
                  /** Fires slower bullets that turn toward the closest target. */
                  isMissile: boolean;
              }>)
        | undefined
    >
> = {
    [CellKind.Hull]: undefined,
    [CellKind.Cockpit]: undefined,
    [CellKind.Gun]: {
        bulletAngles: [
            0,
        ],
        fireIntervalMs: 400,
    },
    [CellKind.RapidGun]: {
        bulletAngles: [
            0,
        ],
        fireIntervalMs: 180,
    },
    [CellKind.Shield]: undefined,
    [CellKind.SpreadGun]: {
        bulletAngles: [
            -0.3,
            0,
            0.3,
        ],
        fireIntervalMs: 650,
    },
    [CellKind.Thruster]: undefined,
    [CellKind.Magnet]: undefined,
    [CellKind.MissileLauncher]: {
        bulletAngles: [
            0,
        ],
        fireIntervalMs: 1100,
        isMissile: true,
    },
    [CellKind.NovaGun]: {
        bulletAngles: createArray(8, (index) => (index * Math.PI) / 4),
        fireIntervalMs: 900,
    },
    /** Lasers fire a beam instead of bullets. */
    [CellKind.Laser]: undefined,
};

/** Each laser's beam is on for the first `laserFiringMs` of every `laserCycleMs`. */
export const laserCycleMs = 3000;
export const laserFiringMs = 1500;
/** While a beam is on, the first thing it touches takes the laser's level in damage this often. */
export const laserPulseMs = 150;

export function isLaserFiring(gunElapsedMs: number) {
    return gunElapsedMs % laserCycleMs < laserFiringMs;
}

const baseMagnetRangePx = 180;
const magnetRangePxPerLevel = 120;

/** How far away the ship's cockpit pulls in fragments. Each magnet level reaches further. */
export function getMagnetRangePx(grid: Readonly<ShipGrid>) {
    return (
        baseMagnetRangePx +
        magnetRangePxPerLevel *
            sumShipCellLevels({
                grid,
                kind: CellKind.Magnet,
            })
    );
}

const baseShipSpeedPxPerMs = 0.25;
const thrusterSpeedPxPerMs = 0.05;
/** Thrusters stop adding speed past this, so a ship full of them can still make small moves. */
const maxShipSpeedPxPerMs = 0.6;
const flyStartDistanceFromBottom = 160;

export const shipFlyShape = defineShape({
    /** Time spent flying this wave. Each gun fires whenever this crosses a multiple of its interval. */
    gunElapsedMs: 0,
    /** Each laser cell that is firing, with how far its beam reaches. */
    laserBeams: [
        {
            lengthPx: 0,
            x: 0,
            y: 0,
        },
    ],
    /** One entry for each shield cell, once the ship has started flying. */
    shields: [
        shieldStateShape,
    ],
    /** Each axis is between -1 and 1. +y points down the screen. */
    steering: {
        x: 0,
        y: 0,
    },
    /** World position of the ship grid's center. */
    x: 0,
    y: 0,
});

export type ShipFly = typeof shipFlyShape.runtimeType;

/** Clamps each axis to [-1, 1] and rounds it so steering packets stay small and exact. */
export function sanitizeSteering(steering: Readonly<Coords>) {
    return {
        x:
            Math.round(
                clamp(steering.x, {
                    max: 1,
                    min: -1,
                }) * 100,
            ) / 100,
        y:
            Math.round(
                clamp(steering.y, {
                    max: 1,
                    min: -1,
                }) * 100,
            ) / 100,
    };
}

export function getShipSpeedPxPerMs(grid: Readonly<ShipGrid>) {
    return Math.min(
        maxShipSpeedPxPerMs,
        baseShipSpeedPxPerMs +
            thrusterSpeedPxPerMs *
                sumShipCellLevels({
                    grid,
                    kind: CellKind.Thruster,
                }),
    );
}

/** Moves the ship by its steering for one frame, keeping the whole grid inside the game world. */
export function moveShip({
    fly,
    frameMs,
    grid,
}: Readonly<{
    fly: Readonly<ShipFly>;
    frameMs: number;
    grid: Readonly<ShipGrid>;
}>) {
    const distance = getShipSpeedPxPerMs(grid) * frameMs;
    const halfWidth = (shipGridSize.width * flyCellSize) / 2;
    const halfHeight = (shipGridSize.height * flyCellSize) / 2;

    return {
        ...fly,
        x: clamp(fly.x + fly.steering.x * distance, {
            max: gameWorldSize.width - halfWidth,
            min: halfWidth,
        }),
        y: clamp(fly.y + fly.steering.y * distance, {
            max: gameWorldSize.height - halfHeight,
            min: halfHeight,
        }),
    };
}

/**
 * Ship space has +y toward the nose, which points up the screen while flying. A positive `angle`
 * turns the vector clockwise on screen.
 */
export function toWorldVector({angle, direction}: Readonly<{angle: number; direction: Direction}>) {
    const x = directionVectors[direction].x;
    const y = 0 - directionVectors[direction].y;

    return {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle),
    };
}

export function getCellWorldCenter({
    cell,
    fly,
}: Readonly<{
    cell: Readonly<Coords>;
    fly: Readonly<Coords>;
}>) {
    return {
        x: fly.x + (cell.x + 0.5 - shipGridSize.width / 2) * flyCellSize,
        y: fly.y - (cell.y + 0.5 - shipGridSize.height / 2) * flyCellSize,
    };
}

export function findCellAtWorldPoint({
    fly,
    grid,
    point,
}: Readonly<{
    fly: Readonly<Coords>;
    grid: Readonly<ShipGrid>;
    point: Readonly<Coords>;
}>) {
    return findShipCell({
        grid,
        position: {
            x: Math.floor((point.x - fly.x) / flyCellSize + shipGridSize.width / 2),
            y: Math.floor((fly.y - point.y) / flyCellSize + shipGridSize.height / 2),
        },
    });
}

export function isSquareTouchingCircle({
    circle,
    square,
}: Readonly<{
    circle: Readonly<Coords & {radius: number}>;
    /** `x` and `y` are the square's center. */
    square: Readonly<Coords & {size: number}>;
}>) {
    const halfSize = square.size / 2;
    const closestPoint = {
        x: clamp(circle.x, {
            max: square.x + halfSize,
            min: square.x - halfSize,
        }),
        y: clamp(circle.y, {
            max: square.y + halfSize,
            min: square.y - halfSize,
        }),
    };

    return (
        getDistanceSquared({
            first: circle,
            second: closestPoint,
        }) <=
        circle.radius * circle.radius
    );
}

/** Every cell whose square overlaps the given circle, in grid order. */
export function findCellsTouchingCircle({
    circle,
    fly,
    grid,
}: Readonly<{
    circle: Readonly<Coords & {radius: number}>;
    fly: Readonly<Coords>;
    grid: Readonly<ShipGrid>;
}>) {
    return grid.cells.filter((cell) => {
        return isSquareTouchingCircle({
            circle,
            square: {
                ...getCellWorldCenter({
                    cell,
                    fly,
                }),
                size: flyCellSize,
            },
        });
    });
}

/** Ships start spread evenly along the bottom of the screen. */
export function getFlyStartPosition({
    shipCount,
    shipIndex,
}: Readonly<{
    shipCount: number;
    shipIndex: number;
}>) {
    return {
        x: (gameWorldSize.width * (shipIndex + 1)) / (shipCount + 1),
        y: gameWorldSize.height - flyStartDistanceFromBottom,
    };
}
