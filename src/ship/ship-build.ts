import {check} from '@augment-vir/assert';
import {createArray, type Coords} from '@augment-vir/common';
import {defineShape, nullableShape} from 'object-shape-tester';
import {getDistanceSquared} from '../util/distance.js';
import {CellKind, Direction, directionVectors} from './ship-cell.js';
import {gunStats} from './ship-fly.js';
import {
    cockpitPosition,
    isPieceInShipGrid,
    lockPiece,
    shipGridShape,
    shipGridSize,
    type ShipGrid,
} from './ship-grid.js';
import {
    pieceShape,
    rotatePieceClockwise,
    rotatePieceCounterclockwise,
    type Piece,
} from './ship-piece.js';

/** Piece cell offsets stay within this many cells of the piece's position. */
const maxPieceReach = 2;

/** When a rotated or swapped piece leaves the grid, these nudges are tried in order. */
const fitNudges: ReadonlyArray<Readonly<Coords>> = [
    {
        x: 0,
        y: 0,
    },
    {
        x: -1,
        y: 0,
    },
    {
        x: 1,
        y: 0,
    },
    {
        x: 0,
        y: -1,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: -2,
        y: 0,
    },
    {
        x: 2,
        y: 0,
    },
    {
        x: 0,
        y: -2,
    },
    {
        x: 0,
        y: 2,
    },
];

const activePieceShape = defineShape({
    piece: pieceShape,
    position: {
        x: 0,
        y: 0,
    },
});

export const shipBuildShape = defineShape({
    /** Missing once every offered piece is placed or none of them fit anywhere. */
    activePiece: nullableShape(activePieceShape),
    /**
     * Pieces left to place, each one known to fit somewhere. The active piece is the selected one,
     * maybe rotated.
     */
    offers: [
        pieceShape,
    ],
    selectedOfferIndex: 0,
    /** The pilot is done building. The run launches once every pilot is. */
    isReady: false,
    /** The build and grid from before each piece placed this build, oldest first. */
    undoSteps: [
        {
            activePiece: nullableShape(activePieceShape),
            grid: shipGridShape,
            offers: [
                pieceShape,
            ],
            selectedOfferIndex: 0,
        },
    ],
});

export type ShipBuild = typeof shipBuildShape.runtimeType;

/** A build state with no piece left to place. */
export function createFinishedShipBuild() {
    return {
        activePiece: undefined,
        isReady: false,
        offers: [],
        selectedOfferIndex: 0,
        undoSteps: [],
    };
}

function getPieceRotations(piece: Readonly<Piece>) {
    const once = rotatePieceClockwise(piece);
    const twice = rotatePieceClockwise(once);

    return [
        piece,
        once,
        twice,
        rotatePieceClockwise(twice),
    ];
}

/** Every position where `piece`, as rotated, could be placed. */
function findValidPositions({
    grid,
    piece,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    piece: Readonly<Piece>;
}>) {
    return createArray(shipGridSize.height + maxPieceReach * 2, (yIndex) => {
        return createArray(shipGridSize.width + maxPieceReach * 2, (xIndex) => {
            return {
                x: xIndex - maxPieceReach,
                y: yIndex - maxPieceReach,
            };
        });
    })
        .flat()
        .filter((position) => {
            return !!lockPiece({
                grid,
                piece,
                position,
            });
        });
}

/**
 * Starts a piece at a valid spot nearest the ship's nose, in the first rotation that fits anywhere.
 * Returns `undefined` when no rotation fits.
 */
function findStartPlacement({
    grid,
    piece,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    piece: Readonly<Piece>;
}>) {
    const target = {
        x: cockpitPosition.x,
        y: Math.max(...grid.cells.map((cell) => cell.y), cockpitPosition.y) + 2,
    };

    return getPieceRotations(piece)
        .map((rotatedPiece) => {
            const position = findValidPositions({
                grid,
                piece: rotatedPiece,
            }).reduce<Coords | undefined>((closest, candidate) => {
                return !closest ||
                    getDistanceSquared({
                        first: candidate,
                        second: target,
                    }) <
                        getDistanceSquared({
                            first: closest,
                            second: target,
                        })
                    ? candidate
                    : closest;
            }, undefined);

            return (
                position && {
                    piece: rotatedPiece,
                    position,
                }
            );
        })
        .find(check.isDefined);
}

/**
 * The pieces a ship gets to build with: `pieces`, plus a free single gun when neither the ship nor
 * `pieces` has any gun, so every ship can always shoot.
 */
export function getShipBuildPieces({
    grid,
    pieces,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    pieces: ReadonlyArray<Readonly<Piece>>;
}>) {
    const hasGun = [
        ...grid.cells,
        ...pieces.flatMap((piece) => piece.cells),
    ].some((cell) => !!gunStats[cell.kind]);

    return hasGun
        ? [
              ...pieces,
          ]
        : [
              ...pieces,
              {
                  cells: [
                      {
                          facing: Direction.Forward,
                          kind: CellKind.Gun,
                          x: 0,
                          y: 0,
                      },
                  ],
              } satisfies Piece,
          ];
}

/**
 * Offers every piece that fits somewhere on the ship and activates the first one. Pieces that don't
 * fit anywhere are dropped.
 */
export function startShipBuild({
    grid,
    pieces,
}: Readonly<{
    grid: Readonly<ShipGrid>;
    pieces: ReadonlyArray<Readonly<Piece>>;
}>) {
    const placeablePieces = pieces
        .map((piece) => {
            return {
                piece,
                startPlacement: findStartPlacement({
                    grid,
                    piece,
                }),
            };
        })
        .filter(({startPlacement}) => !!startPlacement);

    return placeablePieces[0]?.startPlacement
        ? {
              activePiece: placeablePieces[0].startPlacement,
              isReady: false,
              offers: placeablePieces.map(({piece}) => piece),
              selectedOfferIndex: 0,
              undoSteps: [],
          }
        : createFinishedShipBuild();
}

/** Puts `piece` at `position`, nudged back into the grid if needed. */
function fitActivePiece({
    build,
    grid,
    piece,
    position,
}: Readonly<{
    build: Readonly<ShipBuild>;
    grid: Readonly<ShipGrid>;
    piece: Readonly<Piece>;
    position: Readonly<Coords>;
}>) {
    const fitPosition = fitNudges
        .map((nudge) => {
            return {
                x: position.x + nudge.x,
                y: position.y + nudge.y,
            };
        })
        .find((candidate) => {
            return isPieceInShipGrid({
                grid,
                piece,
                position: candidate,
            });
        });

    return fitPosition
        ? {
              ...build,
              activePiece: {
                  piece,
                  position: fitPosition,
              },
          }
        : undefined;
}

/**
 * Moves the active piece one cell. It can pass over the ship's cells, so it only has to stay in the
 * grid. Returns `undefined` when the piece can't move there.
 */
export function moveActivePiece({
    build,
    direction,
    grid,
}: Readonly<{
    build: Readonly<ShipBuild>;
    direction: Direction;
    grid: Readonly<ShipGrid>;
}>) {
    if (!build.activePiece) {
        return undefined;
    }

    const position = {
        x: build.activePiece.position.x + directionVectors[direction].x,
        y: build.activePiece.position.y + directionVectors[direction].y,
    };

    return isPieceInShipGrid({
        grid,
        piece: build.activePiece.piece,
        position,
    })
        ? {
              ...build,
              activePiece: {
                  piece: build.activePiece.piece,
                  position,
              },
          }
        : undefined;
}

/** Returns `undefined` when no nudge keeps the rotated piece in the grid. */
export function rotateActivePiece({
    build,
    grid,
    isClockwise,
}: Readonly<{
    build: Readonly<ShipBuild>;
    grid: Readonly<ShipGrid>;
    isClockwise: boolean;
}>) {
    return build.activePiece
        ? fitActivePiece({
              build,
              grid,
              piece: isClockwise
                  ? rotatePieceClockwise(build.activePiece.piece)
                  : rotatePieceCounterclockwise(build.activePiece.piece),
              position: build.activePiece.position,
          })
        : undefined;
}

/** Swaps the active piece for the next offered piece, keeping its position. */
export function swapActivePiece({
    build,
    grid,
}: Readonly<{
    build: Readonly<ShipBuild>;
    grid: Readonly<ShipGrid>;
}>) {
    const selectedOfferIndex = (build.selectedOfferIndex + 1) % build.offers.length;
    const piece = build.offers[selectedOfferIndex];

    if (!build.activePiece || !piece) {
        return undefined;
    }

    const swappedBuild = fitActivePiece({
        build,
        grid,
        piece,
        position: build.activePiece.position,
    });

    return (
        swappedBuild && {
            ...swappedBuild,
            selectedOfferIndex,
        }
    );
}

/** Whether placing the active piece where it is now would work. */
export function canPlaceActivePiece({
    build,
    grid,
}: Readonly<{
    build: Readonly<ShipBuild>;
    grid: Readonly<ShipGrid>;
}>) {
    return (
        !!build.activePiece &&
        !!lockPiece({
            grid,
            piece: build.activePiece.piece,
            position: build.activePiece.position,
        })
    );
}

/**
 * Adds the active piece to the ship and moves on to the next offered piece. Returns `undefined`
 * when the piece can't be placed where it is.
 */
export function placeActivePiece({
    build,
    grid,
}: Readonly<{
    build: Readonly<ShipBuild>;
    grid: Readonly<ShipGrid>;
}>) {
    const lockedGrid =
        build.activePiece &&
        lockPiece({
            grid,
            piece: build.activePiece.piece,
            position: build.activePiece.position,
        });

    return lockedGrid
        ? {
              build: startShipBuild({
                  grid: lockedGrid,
                  pieces: build.offers.toSpliced(build.selectedOfferIndex, 1),
              }),
              grid: lockedGrid,
          }
        : undefined;
}
