import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {CellKind, Direction} from './ship-cell.js';
import {getPlacedPieceCells, rotatePieceClockwise} from './ship-piece.js';

const gunTipPiece = {
    cells: [
        {
            facing: Direction.Forward,
            kind: CellKind.Hull,
            x: 0,
            y: 0,
        },
        {
            facing: Direction.Forward,
            kind: CellKind.Gun,
            x: 0,
            y: 1,
        },
    ],
};

describe(rotatePieceClockwise.name, () => {
    it('rotates offsets and facing together', () => {
        assert.deepEquals(rotatePieceClockwise(gunTipPiece), {
            cells: [
                {
                    facing: Direction.Right,
                    kind: CellKind.Hull,
                    x: 0,
                    y: 0,
                },
                {
                    facing: Direction.Right,
                    kind: CellKind.Gun,
                    x: 1,
                    y: 0,
                },
            ],
        });
    });

    it('returns to the original piece after four rotations', () => {
        assert.deepEquals(
            rotatePieceClockwise(
                rotatePieceClockwise(rotatePieceClockwise(rotatePieceClockwise(gunTipPiece))),
            ),
            gunTipPiece,
        );
    });
});

describe(getPlacedPieceCells.name, () => {
    it('offsets cells by the piece position', () => {
        assert.deepEquals(
            getPlacedPieceCells({
                piece: gunTipPiece,
                position: {
                    x: 4,
                    y: 6,
                },
            }).map(({x, y}) => {
                return {
                    x,
                    y,
                };
            }),
            [
                {
                    x: 4,
                    y: 6,
                },
                {
                    x: 4,
                    y: 7,
                },
            ],
        );
    });
});
