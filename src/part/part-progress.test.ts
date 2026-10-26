// cspell:word tetromino
import {assert, assertWrap} from '@augment-vir/assert';
import {SeededRandom} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {CellKind, Direction} from '../ship/ship-cell.js';
import {
    addFragment,
    createPartProgress,
    getFragmentsNeeded,
    specialFragmentWeight,
    type PartProgress,
} from './part-progress.js';

function createProgress({gun, hull}: Readonly<{gun: number; hull: number}>) {
    const partProgress = createPartProgress({
        random: SeededRandom.fromSeed('part-progress'),
        saved: [],
    });
    const fragmentsByKind: Partial<Record<CellKind, number>> = {
        [CellKind.Gun]: gun,
        [CellKind.Hull]: hull,
    };

    return partProgress.map((progress) => {
        return {
            ...progress,
            fragments: fragmentsByKind[progress.kind] ?? progress.fragments,
        };
    });
}

function findProgress({
    kind,
    partProgress,
}: Readonly<{
    kind: CellKind;
    partProgress: ReadonlyArray<Readonly<PartProgress>>;
}>) {
    return assertWrap.isDefined(partProgress.find((progress) => progress.kind === kind));
}

describe(addFragment.name, () => {
    it('fills the special bar by the special weight and the hull bar once, but no others', () => {
        assert.deepEquals(
            addFragment({
                kind: CellKind.Gun,
                partProgress: createProgress({
                    gun: 0,
                    hull: 0,
                }),
                random: SeededRandom.fromSeed('next'),
            }),
            {
                earnedPieces: [],
                partProgress: createProgress({
                    gun: specialFragmentWeight,
                    hull: 1,
                }),
            },
        );
    });

    it('earns a single cell and starts over when a special bar fills', () => {
        const gunProgress = findProgress({
            kind: CellKind.Gun,
            partProgress: createProgress({
                gun: 0,
                hull: 0,
            }),
        });
        const result = addFragment({
            kind: CellKind.Gun,
            partProgress: createProgress({
                gun: getFragmentsNeeded(gunProgress) - 2,
                hull: 0,
            }),
            random: SeededRandom.fromSeed('next'),
        });

        assert.deepEquals(
            {
                earnedPieces: result.earnedPieces,
                fragments: findProgress({
                    kind: CellKind.Gun,
                    partProgress: result.partProgress,
                }).fragments,
            },
            {
                earnedPieces: [
                    {
                        cells: [
                            {
                                facing: Direction.Forward,
                                kind: CellKind.Gun,
                                x: 0,
                                y: 0,
                            },
                        ],
                    },
                ],
                fragments: specialFragmentWeight - 2,
            },
        );
    });

    it('earns the hull tetromino when the hull bar fills', () => {
        const hullProgress = findProgress({
            kind: CellKind.Hull,
            partProgress: createProgress({
                gun: 0,
                hull: 0,
            }),
        });

        assert.deepEquals(
            addFragment({
                kind: CellKind.Thruster,
                partProgress: createProgress({
                    gun: 0,
                    hull: getFragmentsNeeded(hullProgress) - 1,
                }),
                random: SeededRandom.fromSeed('next'),
            }).earnedPieces,
            [
                hullProgress.piece,
            ],
        );
    });
});
