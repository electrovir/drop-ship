import {assert, assertWrap} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {CellKind, Direction, maxCellHp, type ShipCell} from './ship-cell.js';
import {
    cockpitPosition,
    createStarterShipGrid,
    damageShipCell,
    findDetachedCells,
    fullGridCoreLevel,
    getShipGridBounds,
    isPieceInShipGrid,
    lockPiece,
    shipGridSize,
} from './ship-grid.js';

function createCell({
    kind = CellKind.Hull,
    x,
    y,
}: Readonly<Pick<ShipCell, 'x' | 'y'> & Partial<Pick<ShipCell, 'kind'>>>) {
    return {
        facing: Direction.Forward,
        hp: maxCellHp[kind],
        kind,
        level: 1,
        x,
        y,
    } satisfies ShipCell;
}

const singleCellPiece = {
    cells: [
        {
            facing: Direction.Forward,
            kind: CellKind.Hull,
            x: 0,
            y: 0,
        },
    ],
};

/** Cockpit with a column of hull going forward from it, and one cell branching right. */
function createColumnShipGrid() {
    return {
        cells: [
            createCell({
                ...cockpitPosition,
                kind: CellKind.Cockpit,
            }),
            createCell({
                x: cockpitPosition.x,
                y: cockpitPosition.y + 1,
            }),
            createCell({
                x: cockpitPosition.x,
                y: cockpitPosition.y + 2,
            }),
            createCell({
                x: cockpitPosition.x + 1,
                y: cockpitPosition.y + 2,
            }),
        ],
    };
}

/** A lone core that can build on the whole grid. */
const maxCoreGrid = {
    cells: [
        {
            ...createCell({
                ...cockpitPosition,
                kind: CellKind.Cockpit,
            }),
            level: fullGridCoreLevel,
        },
    ],
};

describe(isPieceInShipGrid.name, () => {
    it('allows in-bounds positions, even over existing cells', () => {
        assert.deepEquals(
            [
                {
                    x: 0,
                    y: 0,
                },
                cockpitPosition,
            ].map((position) => {
                return isPieceInShipGrid({
                    grid: maxCoreGrid,
                    piece: singleCellPiece,
                    position,
                });
            }),
            [
                true,
                true,
            ],
        );
    });

    it('rejects out-of-bounds positions', () => {
        assert.deepEquals(
            [
                {
                    x: -1,
                    y: 0,
                },
                {
                    x: shipGridSize.width,
                    y: 0,
                },
                {
                    x: 0,
                    y: shipGridSize.height,
                },
            ].map((position) => {
                return isPieceInShipGrid({
                    grid: maxCoreGrid,
                    piece: singleCellPiece,
                    position,
                });
            }),
            [
                false,
                false,
                false,
            ],
        );
    });

    it('limits a level 1 core to a smaller part of the grid', () => {
        assert.deepEquals(
            [
                {
                    x: 0,
                    y: 0,
                },
                cockpitPosition,
            ].map((position) => {
                return isPieceInShipGrid({
                    grid: createStarterShipGrid(),
                    piece: singleCellPiece,
                    position,
                });
            }),
            [
                false,
                true,
            ],
        );
    });

    it('counts two level 1 cores the same as one level 2 core', () => {
        const coreCell = createCell({
            ...cockpitPosition,
            kind: CellKind.Cockpit,
        });

        assert.deepEquals(
            getShipGridBounds({
                cells: [
                    coreCell,
                    {
                        ...coreCell,
                        y: cockpitPosition.y + 1,
                    },
                ],
            }),
            getShipGridBounds({
                cells: [
                    {
                        ...coreCell,
                        level: 2,
                    },
                ],
            }),
        );
    });
});

describe(lockPiece.name, () => {
    it('adds connected pieces at full hp', () => {
        assert.deepEquals(
            lockPiece({
                grid: createStarterShipGrid(),
                piece: singleCellPiece,
                position: {
                    x: cockpitPosition.x,
                    y: cockpitPosition.y - 1,
                },
            }),
            {
                cells: [
                    ...createStarterShipGrid().cells,
                    createCell({
                        x: cockpitPosition.x,
                        y: cockpitPosition.y - 1,
                    }),
                ],
            },
        );
    });

    it('levels up and heals a cell of the same kind', () => {
        const grid = createColumnShipGrid();
        const position = {
            x: cockpitPosition.x,
            y: cockpitPosition.y + 1,
        };
        const lockedGrid = assertWrap.isDefined(
            lockPiece({
                grid: assertWrap.isDefined(
                    damageShipCell({
                        damage: 1,
                        grid,
                        position,
                    }),
                ).grid,
                piece: singleCellPiece,
                position,
            }),
        );

        assert.deepEquals(
            {
                cellCount: lockedGrid.cells.length,
                leveledCell: lockedGrid.cells[1],
            },
            {
                cellCount: grid.cells.length,
                leveledCell: {
                    ...createCell(position),
                    hp: maxCellHp[CellKind.Hull] * 2,
                    level: 2,
                },
            },
        );
    });

    it('rejects landing on a different kind of cell', () => {
        assert.isUndefined(
            lockPiece({
                grid: createColumnShipGrid(),
                piece: singleCellPiece,
                position: cockpitPosition,
            }),
        );
    });

    it('replaces a hull cell with a special part placed on it', () => {
        const grid = createColumnShipGrid();
        const position = {
            x: cockpitPosition.x,
            y: cockpitPosition.y + 1,
        };

        assert.deepEquals(
            lockPiece({
                grid,
                piece: {
                    cells: [
                        {
                            facing: Direction.Forward,
                            kind: CellKind.Gun,
                            x: 0,
                            y: 0,
                        },
                    ],
                },
                position,
            }),
            {
                cells: [
                    ...grid.cells.filter((cell) => cell.x !== position.x || cell.y !== position.y),
                    createCell({
                        ...position,
                        kind: CellKind.Gun,
                    }),
                ],
            },
        );
    });

    it('keeps leveling up a cell with no max level', () => {
        const highLevel = 10;
        const position = {
            x: cockpitPosition.x,
            y: cockpitPosition.y + 1,
        };
        const lockedGrid = assertWrap.isDefined(
            lockPiece({
                grid: {
                    cells: createColumnShipGrid().cells.map((cell) => {
                        return {
                            ...cell,
                            level: highLevel,
                        };
                    }),
                },
                piece: singleCellPiece,
                position,
            }),
        );

        assert.strictEquals(lockedGrid.cells[1]?.level, highLevel + 1);
    });

    it('rejects pieces that do not touch the ship', () => {
        assert.isUndefined(
            lockPiece({
                grid: createStarterShipGrid(),
                piece: singleCellPiece,
                position: {
                    x: 0,
                    y: shipGridSize.height - 1,
                },
            }),
        );
    });

    it('rejects diagonal-only contact', () => {
        assert.isUndefined(
            lockPiece({
                grid: createStarterShipGrid(),
                piece: singleCellPiece,
                position: {
                    x: cockpitPosition.x + 1,
                    y: cockpitPosition.y - 1,
                },
            }),
        );
    });
});

describe(findDetachedCells.name, () => {
    it('finds nothing in a connected ship', () => {
        assert.isLengthExactly(findDetachedCells(createColumnShipGrid()), 0);
    });

    it('detaches every cell when there is no cockpit', () => {
        const grid = createColumnShipGrid();

        assert.deepEquals(
            findDetachedCells({
                cells: grid.cells.filter((cell) => cell.kind !== CellKind.Cockpit),
            }),
            grid.cells.filter((cell) => cell.kind !== CellKind.Cockpit),
        );
    });
});

describe(damageShipCell.name, () => {
    it('reduces hp without removing a surviving cell', () => {
        const damageResult = assertWrap.isDefined(
            damageShipCell({
                damage: 1,
                grid: createColumnShipGrid(),
                position: {
                    x: cockpitPosition.x,
                    y: cockpitPosition.y + 1,
                },
            }),
        );

        assert.deepEquals(
            {
                hp: damageResult.grid.cells[1]?.hp,
                removedCells: damageResult.removedCells,
            },
            {
                hp: maxCellHp[CellKind.Hull] - 1,
                removedCells: [],
            },
        );
    });

    it('removes a destroyed cell and every cell it held onto the cockpit', () => {
        const grid = createColumnShipGrid();
        const damageResult = assertWrap.isDefined(
            damageShipCell({
                damage: maxCellHp[CellKind.Hull],
                grid,
                position: {
                    x: cockpitPosition.x,
                    y: cockpitPosition.y + 1,
                },
            }),
        );

        assert.deepEquals(damageResult, {
            grid: {
                cells: grid.cells.slice(0, 1),
            },
            removedCells: grid.cells.slice(1),
        });
    });

    it('ignores positions without a cell', () => {
        assert.isUndefined(
            damageShipCell({
                damage: 1,
                grid: createColumnShipGrid(),
                position: {
                    x: 0,
                    y: 0,
                },
            }),
        );
    });
});
