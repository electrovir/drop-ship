import {assert, assertWrap} from '@augment-vir/assert';
import {createArray, selectFrom} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {
    canPlaceActivePiece,
    createFinishedShipBuild,
    getShipBuildPieces,
    moveActivePiece,
    placeActivePiece,
    rotateActivePiece,
    startShipBuild,
    swapActivePiece,
    type ShipBuild,
} from './ship-build.js';
import {CellKind, Direction} from './ship-cell.js';
import {
    cockpitPosition,
    createStarterShipGrid,
    fullGridCoreLevel,
    shipGridSize,
} from './ship-grid.js';

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

const verticalPairPiece = {
    cells: [
        {
            facing: Direction.Forward,
            kind: CellKind.Hull,
            x: 0,
            y: 0,
        },
        {
            facing: Direction.Forward,
            kind: CellKind.Hull,
            x: 0,
            y: 1,
        },
    ],
};

/** A build whose active piece is a single cell at `x` and `y`. */
function createSingleCellBuild({
    x,
    y,
}: Readonly<{
    x: number;
    y: number;
}>) {
    return {
        activePiece: {
            piece: singleCellPiece,
            position: {
                x,
                y,
            },
        },
        offers: [
            singleCellPiece,
            verticalPairPiece,
        ],
        isReady: false,
        selectedOfferIndex: 0,
        undoSteps: [],
    } satisfies ShipBuild;
}

describe(startShipBuild.name, () => {
    it('offers the pieces with the first one already somewhere it can be placed', () => {
        const grid = createStarterShipGrid();
        const build = startShipBuild({
            grid,
            pieces: [
                singleCellPiece,
                verticalPairPiece,
            ],
        });

        assert.deepEquals(
            {
                canPlace: canPlaceActivePiece({
                    build,
                    grid,
                }),
                offers: build.offers,
            },
            {
                canPlace: true,
                offers: [
                    singleCellPiece,
                    verticalPairPiece,
                ],
            },
        );
    });

    it('finishes right away when nothing fits anywhere', () => {
        const fullGrid = {
            cells: createArray(shipGridSize.width * shipGridSize.height, (index) => {
                return {
                    facing: Direction.Forward,
                    hp: 1,
                    kind: CellKind.Cockpit,
                    level: fullGridCoreLevel,
                    x: index % shipGridSize.width,
                    y: Math.floor(index / shipGridSize.width),
                };
            }),
        };

        assert.deepEquals(
            startShipBuild({
                grid: fullGrid,
                pieces: [
                    singleCellPiece,
                ],
            }),
            createFinishedShipBuild(),
        );
    });
});

describe(getShipBuildPieces.name, () => {
    it('adds a free gun only when neither the ship nor the pieces have a gun', () => {
        const gunlessGrid = {
            cells: createStarterShipGrid().cells.filter((cell) => cell.kind === CellKind.Cockpit),
        };

        assert.deepEquals(
            [
                getShipBuildPieces({
                    grid: gunlessGrid,
                    pieces: [
                        singleCellPiece,
                    ],
                }),
                getShipBuildPieces({
                    grid: createStarterShipGrid(),
                    pieces: [
                        singleCellPiece,
                    ],
                }),
            ],
            [
                [
                    singleCellPiece,
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
                [
                    singleCellPiece,
                ],
            ],
        );
    });
});

describe(moveActivePiece.name, () => {
    it('moves over ship cells and rejects moves out of the grid', () => {
        assert.deepEquals(
            [
                moveActivePiece({
                    build: createSingleCellBuild({
                        x: cockpitPosition.x - 1,
                        y: cockpitPosition.y,
                    }),
                    direction: Direction.Right,
                    grid: createStarterShipGrid(),
                })?.activePiece.position,
                moveActivePiece({
                    build: createSingleCellBuild({
                        x: 0,
                        y: 5,
                    }),
                    direction: Direction.Left,
                    grid: createStarterShipGrid(),
                }),
            ],
            [
                cockpitPosition,
                undefined,
            ],
        );
    });
});

describe(rotateActivePiece.name, () => {
    it('nudges a rotated piece away from a wall', () => {
        const build = assertWrap.isDefined(
            rotateActivePiece({
                build: {
                    ...createSingleCellBuild({
                        x: shipGridSize.width - 1,
                        y: 5,
                    }),
                    activePiece: {
                        piece: verticalPairPiece,
                        position: {
                            x: shipGridSize.width - 1,
                            y: 5,
                        },
                    },
                },
                /** A max level core can build out to the grid's walls. */
                grid: {
                    cells: createStarterShipGrid().cells.map((cell) => {
                        return {
                            ...cell,
                            level: fullGridCoreLevel,
                        };
                    }),
                },
                isClockwise: true,
            }),
        );

        assert.deepEquals(build.activePiece.position, {
            x: shipGridSize.width - 2,
            y: 5,
        });
    });
});

describe(swapActivePiece.name, () => {
    it('cycles through the offers, wrapping around', () => {
        const swapped = assertWrap.isDefined(
            swapActivePiece({
                build: createSingleCellBuild({
                    x: 3,
                    y: 4,
                }),
                grid: createStarterShipGrid(),
            }),
        );
        const swappedBack = assertWrap.isDefined(
            swapActivePiece({
                build: swapped,
                grid: createStarterShipGrid(),
            }),
        );

        assert.deepEquals(
            [
                selectFrom(swapped, {
                    activePiece: {
                        piece: true,
                    },
                    selectedOfferIndex: true,
                }),
                selectFrom(swappedBack, {
                    activePiece: {
                        piece: true,
                    },
                    selectedOfferIndex: true,
                }),
            ],
            [
                {
                    activePiece: {
                        piece: verticalPairPiece,
                    },
                    selectedOfferIndex: 1,
                },
                {
                    activePiece: {
                        piece: singleCellPiece,
                    },
                    selectedOfferIndex: 0,
                },
            ],
        );
    });
});

describe(placeActivePiece.name, () => {
    it('adds the piece and moves on to the next offered piece', () => {
        const placed = assertWrap.isDefined(
            placeActivePiece({
                build: createSingleCellBuild({
                    x: cockpitPosition.x,
                    y: cockpitPosition.y - 1,
                }),
                grid: createStarterShipGrid(),
            }),
        );

        assert.deepEquals(
            {
                cellCount: placed.grid.cells.length,
                offers: placed.build.offers,
            },
            {
                cellCount: createStarterShipGrid().cells.length + 1,
                offers: [
                    verticalPairPiece,
                ],
            },
        );
    });

    it('rejects a piece that does not touch the ship', () => {
        assert.isUndefined(
            placeActivePiece({
                build: createSingleCellBuild({
                    x: 0,
                    y: shipGridSize.height - 1,
                }),
                grid: createStarterShipGrid(),
            }),
        );
    });

    it('finishes the build after the last piece', () => {
        assert.deepEquals(
            placeActivePiece({
                build: {
                    ...createSingleCellBuild({
                        x: cockpitPosition.x,
                        y: cockpitPosition.y - 1,
                    }),
                    offers: [
                        singleCellPiece,
                    ],
                },
                grid: createStarterShipGrid(),
            })?.build,
            createFinishedShipBuild(),
        );
    });
});
