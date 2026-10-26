import {type Coords} from '@augment-vir/common';
import {defineShape, enumShape, intersectShape} from 'object-shape-tester';

/** Ship-space directions. Forward points toward the ship's nose. */
export enum Direction {
    Forward = 'forward',
    Right = 'right',
    Backward = 'backward',
    Left = 'left',
}

/** One step in ship space for each direction, with +y pointing toward the ship's nose. */
export const directionVectors: Readonly<Record<Direction, Readonly<Coords>>> = {
    [Direction.Forward]: {
        x: 0,
        y: 1,
    },
    [Direction.Right]: {
        x: 1,
        y: 0,
    },
    [Direction.Backward]: {
        x: 0,
        y: -1,
    },
    [Direction.Left]: {
        x: -1,
        y: 0,
    },
};

const clockwiseDirections: Readonly<Record<Direction, Direction>> = {
    [Direction.Forward]: Direction.Right,
    [Direction.Right]: Direction.Backward,
    [Direction.Backward]: Direction.Left,
    [Direction.Left]: Direction.Forward,
};

export function rotateDirectionClockwise(direction: Direction) {
    return clockwiseDirections[direction];
}

export enum CellKind {
    Hull = 'hull',
    Cockpit = 'cockpit',
    Gun = 'gun',
    RapidGun = 'rapid-gun',
    Shield = 'shield',
    SpreadGun = 'spread-gun',
    Thruster = 'thruster',
    Magnet = 'magnet',
    MissileLauncher = 'missile-launcher',
    NovaGun = 'nova-gun',
    Laser = 'laser',
}

/** A cell's max hp at level 1. Each level adds this much again. */
export const maxCellHp: Readonly<Record<CellKind, number>> = {
    [CellKind.Hull]: 2,
    [CellKind.Cockpit]: 5,
    [CellKind.Gun]: 2,
    [CellKind.RapidGun]: 2,
    [CellKind.Shield]: 1,
    [CellKind.SpreadGun]: 2,
    [CellKind.Thruster]: 1,
    [CellKind.Magnet]: 1,
    [CellKind.MissileLauncher]: 2,
    [CellKind.NovaGun]: 2,
    [CellKind.Laser]: 2,
};

/** Thrusters push from the back of the ship. Everything else faces the nose. */
export const defaultCellFacings: Readonly<Record<CellKind, Direction>> = {
    [CellKind.Hull]: Direction.Forward,
    [CellKind.Cockpit]: Direction.Forward,
    [CellKind.Gun]: Direction.Forward,
    [CellKind.RapidGun]: Direction.Forward,
    [CellKind.Shield]: Direction.Forward,
    [CellKind.SpreadGun]: Direction.Forward,
    [CellKind.Thruster]: Direction.Backward,
    [CellKind.Magnet]: Direction.Forward,
    [CellKind.MissileLauncher]: Direction.Forward,
    [CellKind.NovaGun]: Direction.Forward,
    [CellKind.Laser]: Direction.Forward,
};

export function getMaxCellHp({kind, level}: Readonly<Pick<ShipCell, 'kind' | 'level'>>) {
    return maxCellHp[kind] * level;
}

/** A piece cell's `x` and `y` are offsets from the piece's position. */
export const pieceCellShape = defineShape({
    facing: enumShape(Direction),
    kind: enumShape(CellKind),
    x: 0,
    y: 0,
});

export type PieceCell = typeof pieceCellShape.runtimeType;

/** A ship cell's `x` and `y` are its column and row in the ship grid. */
export const shipCellShape = intersectShape(pieceCellShape, {
    hp: 0,
    level: 0,
});

export type ShipCell = typeof shipCellShape.runtimeType;
