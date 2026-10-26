// cspell:word tetromino
import {getEnumValues, type PartialWithUndefined, type SeededRandom} from '@augment-vir/common';
import {defineShape, enumShape} from 'object-shape-tester';
import {createRandomPiece} from '../ship/piece-bag.js';
import {CellKind, defaultCellFacings} from '../ship/ship-cell.js';
import {pieceShape, type Piece} from '../ship/ship-piece.js';

const fragmentsPerSpecialCell = 40;
/** How many fragments each cell of a part's piece costs. */
const fragmentsPerCell: Readonly<Record<CellKind, number>> = {
    [CellKind.Hull]: 15,
    /** Every enemy drops a core fragment, so a new core takes many systems' worth of kills. */
    [CellKind.Cockpit]: 1000,
    [CellKind.Gun]: fragmentsPerSpecialCell,
    [CellKind.RapidGun]: fragmentsPerSpecialCell,
    [CellKind.Shield]: fragmentsPerSpecialCell,
    [CellKind.SpreadGun]: fragmentsPerSpecialCell,
    [CellKind.Thruster]: fragmentsPerSpecialCell * 2,
    [CellKind.Magnet]: fragmentsPerSpecialCell,
    [CellKind.MissileLauncher]: fragmentsPerSpecialCell,
    [CellKind.NovaGun]: fragmentsPerSpecialCell,
    [CellKind.Laser]: fragmentsPerSpecialCell,
};
/** Hull is common, so every other part's fragment fills its own bar this much. */
export const specialFragmentWeight = 9;

export const progressKinds = getEnumValues(CellKind);

/**
 * Collected fragments working toward `piece`. Hull progress works toward a hull tetromino and is
 * filled by every fragment. Every other kind works toward a single cell of that kind and is only
 * filled by fragments of that kind.
 */
export const partProgressShape = defineShape({
    fragments: 0,
    kind: enumShape(CellKind),
    piece: pieceShape,
});

export type PartProgress = typeof partProgressShape.runtimeType;

export function getFragmentsNeeded({kind, piece}: Readonly<Pick<PartProgress, 'kind' | 'piece'>>) {
    return piece.cells.length * fragmentsPerCell[kind];
}

function createProgressPiece({
    kind,
    random,
}: Readonly<{
    kind: CellKind;
    random: Readonly<Pick<SeededRandom, 'next'>>;
}>) {
    return kind === CellKind.Hull
        ? createRandomPiece({
              kind,
              random,
          })
        : ({
              cells: [
                  {
                      facing: defaultCellFacings[kind],
                      kind,
                      x: 0,
                      y: 0,
                  },
              ],
          } satisfies Piece);
}

/** Progress for every kind, keeping `saved` progress and rolling a piece for the rest. */
export function createPartProgress({
    random,
    saved,
}: Readonly<{
    random: Readonly<Pick<SeededRandom, 'next'>>;
    saved: ReadonlyArray<Readonly<PartProgress>>;
}>) {
    return progressKinds.map((kind) => {
        return (
            saved.find((progress) => progress.kind === kind) || {
                fragments: 0,
                kind,
                piece: createProgressPiece({
                    kind,
                    random,
                }),
            }
        );
    });
}

/**
 * Adds one fragment of `kind` to its own progress and, unless `isOwnKindOnly`, to the hull
 * progress. Toward its own bar, a non-hull fragment counts as `specialFragmentWeight` fragments.
 * Filling a bar earns its piece and rolls the next piece of that kind, keeping any extra
 * fragments.
 */
export function addFragment({
    isOwnKindOnly,
    kind,
    partProgress,
    random,
}: Readonly<
    {
        kind: CellKind;
        partProgress: ReadonlyArray<Readonly<PartProgress>>;
        random: Readonly<Pick<SeededRandom, 'next'>>;
    } & PartialWithUndefined<{
        isOwnKindOnly: boolean;
    }>
>) {
    return partProgress.reduce<{
        earnedPieces: Piece[];
        partProgress: PartProgress[];
    }>(
        (result, progress) => {
            const fragments =
                progress.fragments +
                (progress.kind === kind
                    ? kind === CellKind.Hull
                        ? 1
                        : specialFragmentWeight
                    : progress.kind === CellKind.Hull && !isOwnKindOnly
                      ? 1
                      : 0);
            const fragmentsNeeded = getFragmentsNeeded(progress);

            return fragments < fragmentsNeeded
                ? {
                      ...result,
                      partProgress: [
                          ...result.partProgress,
                          {
                              ...progress,
                              fragments,
                          },
                      ],
                  }
                : {
                      earnedPieces: [
                          ...result.earnedPieces,
                          progress.piece,
                      ],
                      partProgress: [
                          ...result.partProgress,
                          {
                              fragments: fragments - fragmentsNeeded,
                              kind: progress.kind,
                              piece: createProgressPiece({
                                  kind: progress.kind,
                                  random,
                              }),
                          },
                      ],
                  };
        },
        {
            earnedPieces: [],
            partProgress: [],
        },
    );
}
