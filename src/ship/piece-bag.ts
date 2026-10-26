// cspell:word tetromino tetrominoes
import {assertWrap} from '@augment-vir/assert';
import {type Coords, type SeededRandom} from '@augment-vir/common';
import {defaultCellFacings, type CellKind} from './ship-cell.js';
import {type Piece} from './ship-piece.js';

/** Each tetromino's cell offsets, defined around its rotation origin. */
export const tetrominoShapes: ReadonlyArray<ReadonlyArray<Readonly<Coords>>> = [
    /** I */
    [
        {
            x: 0,
            y: -1,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
        {
            x: 0,
            y: 2,
        },
    ],
    /** O */
    [
        {
            x: 0,
            y: 0,
        },
        {
            x: 1,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
        {
            x: 1,
            y: 1,
        },
    ],
    /** T */
    [
        {
            x: -1,
            y: 0,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 1,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
    ],
    /** S */
    [
        {
            x: -1,
            y: 0,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
        {
            x: 1,
            y: 1,
        },
    ],
    /** Z */
    [
        {
            x: 1,
            y: 0,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
        {
            x: -1,
            y: 1,
        },
    ],
    /** J */
    [
        {
            x: -1,
            y: -1,
        },
        {
            x: 0,
            y: -1,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
    ],
    /** L */
    [
        {
            x: 1,
            y: -1,
        },
        {
            x: 0,
            y: -1,
        },
        {
            x: 0,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
    ],
];

/** A random tetromino with every cell of `kind`. */
export function createRandomPiece({
    kind,
    random,
}: Readonly<{
    kind: CellKind;
    random: Readonly<Pick<SeededRandom, 'next'>>;
}>) {
    return {
        cells: assertWrap
            .isDefined(tetrominoShapes[Math.floor(random.next() * tetrominoShapes.length)])
            .map((offset) => {
                return {
                    facing: defaultCellFacings[kind],
                    kind,
                    x: offset.x,
                    y: offset.y,
                };
            }),
    } satisfies Piece;
}
