import {type Coords} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {pieceCellShape, rotateDirectionClockwise} from './ship-cell.js';

export const pieceShape = defineShape({
    cells: [
        pieceCellShape,
    ],
});

export type Piece = typeof pieceShape.runtimeType;

/** Rotates around the piece's origin. Each cell's `facing` rotates along with it. */
export function rotatePieceClockwise(piece: Readonly<Piece>) {
    return {
        cells: piece.cells.map((cell) => {
            return {
                ...cell,
                facing: rotateDirectionClockwise(cell.facing),
                x: cell.y,
                /**
                 * `0 - x` instead of `-x` so a 0 offset doesn't become `-0`, which `deepEquals`
                 * treats as different from `0`.
                 */
                y: 0 - cell.x,
            };
        }),
    };
}

export function rotatePieceCounterclockwise(piece: Readonly<Piece>) {
    return rotatePieceClockwise(rotatePieceClockwise(rotatePieceClockwise(piece)));
}

/** Converts a piece's cell offsets into ship grid coordinates. */
export function getPlacedPieceCells({
    piece,
    position,
}: Readonly<{
    piece: Readonly<Piece>;
    position: Readonly<Coords>;
}>) {
    return piece.cells.map((cell) => {
        return {
            ...cell,
            x: position.x + cell.x,
            y: position.y + cell.y,
        };
    });
}
