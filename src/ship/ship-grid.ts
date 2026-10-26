import {assertWrap, check} from '@augment-vir/assert';
import {getObjectTypedValues, type Coords} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {
    CellKind,
    Direction,
    directionVectors,
    getMaxCellHp,
    shipCellShape,
    type ShipCell,
} from './ship-cell.js';
import {getPlacedPieceCells, type Piece} from './ship-piece.js';

/** Odd width so the cockpit sits in the middle column. */
export const shipGridSize = {
    height: 15,
    width: 11,
} as const;

export const cockpitPosition: Readonly<Coords> = {
    x: (shipGridSize.width - 1) / 2,
    y: 1,
};

/** The part of the grid that can be built on, by the summed level of all the ship's cores. */
const coreLevelBounds: ReadonlyArray<Readonly<Coords & {height: number; width: number}>> = [
    {
        height: 6,
        width: 5,
    },
    {
        height: 9,
        width: 7,
    },
    shipGridSize,
].map((bounds) => {
    return {
        ...bounds,
        x: (shipGridSize.width - bounds.width) / 2,
        y: 0,
    };
});
/** Cores whose levels add up to this or higher can build on the whole grid. */
export const fullGridCoreLevel = coreLevelBounds.length;

/** Only filled cells are stored, so the grid serializes as plain JSON. */
export const shipGridShape = defineShape({
    cells: [
        shipCellShape,
    ],
});

export type ShipGrid = typeof shipGridShape.runtimeType;

/** A grid with the cockpit and a gun in front of it. */
export function createStarterShipGrid() {
    return {
        cells: [
            {
                ...cockpitPosition,
                kind: CellKind.Cockpit,
            },
            {
                x: cockpitPosition.x,
                y: cockpitPosition.y + 1,
                kind: CellKind.Gun,
            },
        ].map((cell) => {
            return {
                ...cell,
                facing: Direction.Forward,
                hp: getMaxCellHp({
                    kind: cell.kind,
                    level: 1,
                }),
                level: 1,
            };
        }),
    };
}

/**
 * The part of the grid that the ship's cores can build on, by the sum of every core's level. A ship
 * without a core gets the smallest bounds.
 */
export function getShipGridBounds(grid: Readonly<ShipGrid>) {
    const coreLevel = Math.max(
        1,
        sumShipCellLevels({
            grid,
            kind: CellKind.Cockpit,
        }),
    );

    return assertWrap.isDefined(coreLevelBounds[Math.min(coreLevel, coreLevelBounds.length) - 1]);
}

/** Whether `position` is in the part of the grid that `grid`'s cores can build on. */
export function isInShipGrid({
    grid,
    position,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    position: Readonly<Coords>;
}>) {
    const bounds = getShipGridBounds(grid);

    return (
        position.x >= bounds.x &&
        position.y >= bounds.y &&
        position.x < bounds.x + bounds.width &&
        position.y < bounds.y + bounds.height
    );
}

export function findShipCell({
    grid,
    position,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    position: Readonly<Coords>;
}>) {
    return grid.cells.find((cell) => {
        return cell.x === position.x && cell.y === position.y;
    });
}

/** Adds up the levels of every cell of `kind`, so a level 2 cell counts as two level 1 cells. */
export function sumShipCellLevels({
    grid,
    kind,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    kind: CellKind;
}>) {
    return grid.cells
        .filter((cell) => cell.kind === kind)
        .reduce((sum, cell) => sum + cell.level, 0);
}

/** A ship without a cockpit is wrecked. */
export function hasCockpit(grid: Readonly<ShipGrid>) {
    return grid.cells.some((cell) => cell.kind === CellKind.Cockpit);
}

export function isPieceInShipGrid({
    grid,
    piece,
    position,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    piece: Readonly<Piece>;
    position: Readonly<Coords>;
}>) {
    return getPlacedPieceCells({
        piece,
        position,
    }).every((cell) => {
        return isInShipGrid({
            grid,
            position: cell,
        });
    });
}

function findNeighborCells({
    cell,
    grid,
}: Readonly<{
    cell: Readonly<ShipCell>;
    grid: Readonly<ShipGrid>;
}>) {
    return getObjectTypedValues(directionVectors)
        .map((vector) => {
            return findShipCell({
                grid,
                position: {
                    x: cell.x + vector.x,
                    y: cell.y + vector.y,
                },
            });
        })
        .filter(check.isDefined);
}

/** Return type is required because this function is recursive. */
function floodFillCells({
    connectedCells,
    frontier,
    grid,
}: Readonly<{
    connectedCells: ReadonlyArray<ShipCell>;
    frontier: ReadonlyArray<ShipCell>;
    grid: Readonly<ShipGrid>;
}>): ShipCell[] {
    const newCells = frontier
        .flatMap((cell) => {
            return findNeighborCells({
                cell,
                grid,
            });
        })
        .filter((cell, index, allCells) => {
            return !connectedCells.includes(cell) && allCells.indexOf(cell) === index;
        });

    return newCells.length
        ? floodFillCells({
              connectedCells: [
                  ...connectedCells,
                  ...newCells,
              ],
              frontier: newCells,
              grid,
          })
        : [
              ...connectedCells,
          ];
}

/** Every cell when the cockpit is missing. */
export function findDetachedCells(grid: Readonly<ShipGrid>) {
    const cockpits = grid.cells.filter((cell) => cell.kind === CellKind.Cockpit);
    const connectedCells = floodFillCells({
        connectedCells: cockpits,
        frontier: cockpits,
        grid,
    });

    return grid.cells.filter((cell) => !connectedCells.includes(cell));
}

/**
 * Adds `piece` to the grid. A piece cell placed onto a ship cell of the same kind levels that cell
 * up and fully heals it instead, and one placed onto a hull cell replaces it. Returns `undefined`
 * when the piece leaves the buildable part of the grid, lands on a non-hull cell of a different
 * kind, doesn't touch the ship, or would give the ship more cells than its cores allow.
 */
export function lockPiece({
    grid,
    piece,
    position,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    piece: Readonly<Piece>;
    position: Readonly<Coords>;
}>) {
    const placedCells = getPlacedPieceCells({
        piece,
        position,
    }).map((pieceCell) => {
        return {
            pieceCell,
            shipCell: findShipCell({
                grid,
                position: pieceCell,
            }),
        };
    });
    const canPlace = placedCells.every(({pieceCell, shipCell}) => {
        return (
            isInShipGrid({
                grid,
                position: pieceCell,
            }) &&
            (!shipCell || shipCell.kind === pieceCell.kind || shipCell.kind === CellKind.Hull)
        );
    });
    /**
     * Pieces are connected and the ship always is too, since detached cells are removed when
     * they're knocked off. So the piece connects to the cockpit exactly when one of its cells lands
     * on or next to a ship cell.
     */
    const touchesShip = placedCells.some(({pieceCell, shipCell}) => {
        return (
            !!shipCell ||
            getObjectTypedValues(directionVectors).some((vector) => {
                return !!findShipCell({
                    grid,
                    position: {
                        x: pieceCell.x + vector.x,
                        y: pieceCell.y + vector.y,
                    },
                });
            })
        );
    });

    if (!canPlace || !touchesShip) {
        return undefined;
    }

    const leveledCells = placedCells
        .filter(({pieceCell, shipCell}) => shipCell?.kind === pieceCell.kind)
        .map(({shipCell}) => shipCell);
    const replacedCells = placedCells
        .filter(({pieceCell, shipCell}) => !!shipCell && shipCell.kind !== pieceCell.kind)
        .map(({shipCell}) => shipCell);

    return {
        cells: [
            ...grid.cells
                .filter((cell) => !replacedCells.includes(cell))
                .map((cell) => {
                    if (!leveledCells.includes(cell)) {
                        return cell;
                    }

                    const level = cell.level + 1;

                    return {
                        ...cell,
                        hp: getMaxCellHp({
                            kind: cell.kind,
                            level,
                        }),
                        level,
                    };
                }),
            ...placedCells
                .filter(({shipCell}) => !shipCell || replacedCells.includes(shipCell))
                .map(({pieceCell}) => {
                    return {
                        ...pieceCell,
                        hp: getMaxCellHp({
                            kind: pieceCell.kind,
                            level: 1,
                        }),
                        level: 1,
                    };
                }),
        ],
    };
}

/**
 * Damages the cell at `position`. A destroyed cell is removed along with every cell it was holding
 * onto the cockpit. Returns `undefined` when there's no cell at `position`.
 */
export function damageShipCell({
    damage,
    grid,
    position,
}: Readonly<{
    damage: number;
    grid: Readonly<ShipGrid>;
    position: Readonly<Coords>;
}>) {
    const targetCell = findShipCell({
        grid,
        position,
    });

    if (!targetCell) {
        return undefined;
    }

    const hp = targetCell.hp - damage;

    if (hp > 0) {
        return {
            grid: {
                cells: grid.cells.map((cell) => {
                    return cell === targetCell
                        ? {
                              ...cell,
                              hp,
                          }
                        : cell;
                }),
            },
            removedCells: [],
        };
    }

    const remainingGrid = {
        cells: grid.cells.filter((cell) => cell !== targetCell),
    };
    const detachedCells = findDetachedCells(remainingGrid);

    return {
        grid: {
            cells: remainingGrid.cells.filter((cell) => !detachedCells.includes(cell)),
        },
        removedCells: [
            targetCell,
            ...detachedCells,
        ],
    };
}
