import {assert} from '@augment-vir/assert';
import {SeededRandom} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {createRandomPiece} from './piece-bag.js';
import {CellKind} from './ship-cell.js';

describe(createRandomPiece.name, () => {
    it('creates the same piece from the same seed', () => {
        assert.deepEquals(
            createRandomPiece({
                kind: CellKind.Gun,
                random: SeededRandom.fromSeed('piece'),
            }),
            createRandomPiece({
                kind: CellKind.Gun,
                random: SeededRandom.fromSeed('piece'),
            }),
        );
    });

    it('makes every cell the requested kind', () => {
        assert.deepEquals(
            createRandomPiece({
                kind: CellKind.SpreadGun,
                random: SeededRandom.fromSeed('piece'),
            }).cells.map((cell) => cell.kind),
            [
                CellKind.SpreadGun,
                CellKind.SpreadGun,
                CellKind.SpreadGun,
                CellKind.SpreadGun,
            ],
        );
    });
});
