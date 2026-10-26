// cspell:words kruskal stellaris
import {createStableRandom, StableMath} from '@antha/util';
import {assertWrap} from '@augment-vir/assert';
import {clamp, createArray, type Coords} from '@augment-vir/common';
import {gameWorldSize} from '../game-state/game-world.js';
import {getDistanceSquared} from '../util/distance.js';

export const galaxyCenter: Readonly<Coords> = {
    x: gameWorldSize.width / 2,
    y: gameWorldSize.height / 2 + 10,
};
/** The galaxy is an ellipse so it fills the wide screen. */
export const galaxyRadius: Readonly<Coords> = {
    x: 910,
    y: 480,
};
/** Like the black hole at the center of a Stellaris galaxy, no star is this close to the center. */
export const coreRadiusShare = 0.1;
/** The difficulty of the stars closest to the core. Stars on the edge have a difficulty of 0. */
export const maxStarDifficulty = 12;
const starCount = 420;
const starPlacementAttemptCount = 12_000;
export const minStarSpacingPx = 38;
/** Share of placement attempts that land on a spiral arm rather than anywhere in the disc. */
const armStarShare = 0.35;
/** Any longer and a hyperlane would skip past the stars between its ends. */
const maxHyperlanePx = 90;
/** The spanning tree may need longer hyperlanes to reach isolated stars. */
const maxTreeHyperlanePx = 160;
const extraHyperlaneChance = 0.6;
const maxHyperlanesPerStar = 5;
/** Keeps a hyperlane from passing so close to another star that it looks connected to it. */
const minHyperlaneStarClearancePx = 14;

export type GalaxyStar = Coords & {
    /** Stars closer to the core are harder, from 0 to {@link maxStarDifficulty}. */
    difficulty: number;
};

/** Indexes into {@link Galaxy.stars} of the two stars a hyperlane connects. */
export type Hyperlane = [
    number,
    number,
];

export type Galaxy = {
    hyperlanes: Hyperlane[];
    /** The star on the galaxy's edge where every run starts. */
    startStarIndex: number;
    stars: GalaxyStar[];
};

/** How far out a position is, from 0 at the center to 1 on the galaxy's elliptical edge. */
export function getEdgeShare(position: Readonly<Coords>) {
    return Math.sqrt(
        getDistanceSquared({
            first: {
                x: (position.x - galaxyCenter.x) / galaxyRadius.x,
                y: (position.y - galaxyCenter.y) / galaxyRadius.y,
            },
            second: {
                x: 0,
                y: 0,
            },
        }),
    );
}

/**
 * Natural log from only arithmetic, since `Math.log` isn't guaranteed to round the same in every
 * browser. Accurate enough for positions when `value` is between the core and the edge.
 */
function getStableLog(value: number) {
    const ratio = (value - 1) / (value + 1);
    const ratioSquared = ratio * ratio;

    return (
        2 *
        createArray(40, (termIndex) => termIndex).reduce(
            (accumulated, termIndex) => {
                return {
                    power: accumulated.power * ratioSquared,
                    sum: accumulated.sum + accumulated.power / (2 * termIndex + 1),
                };
            },
            {
                power: ratio,
                sum: 0,
            },
        ).sum
    );
}

/** Seeded per galaxy, from loose two-armed spirals to tightly wound four-armed ones. */
export function getSpiralShape(galaxySeed: string) {
    const random = createStableRandom(
        [
            galaxySeed,
            'arms',
        ].join(':'),
    );

    return {
        armCount: 2 + Math.floor(random.next() * 3),
        /** How far stars stray from the middle of an arm, in radians. Bigger makes thicker arms. */
        armSpread: 0.3 + random.next() * 0.45,
        /**
         * How tightly the arms wind, as the angle they turn per natural log of radius. Real spiral
         * arms are logarithmic spirals.
         */
        winding: 2.2 + random.next() * 2.6,
    };
}

/** The shape of a galaxy's spiral arms, shared by the star layout and the map's glow. */
export type SpiralShape = ReturnType<typeof getSpiralShape>;

/** The angle of spiral arm `armIndex` at a share of the galaxy's radius. */
export function getSpiralArmAngle({
    armIndex,
    radiusShare,
    spiralShape,
}: Readonly<{
    armIndex: number;
    radiusShare: number;
    spiralShape: Readonly<SpiralShape>;
}>) {
    return (
        (armIndex * 2 * Math.PI) / spiralShape.armCount +
        getStableLog(Math.max(radiusShare, coreRadiusShare) / coreRadiusShare) * spiralShape.winding
    );
}

/**
 * Index lists of the stars in each square grid cell, so neighbors are found without checking every
 * star.
 */
type StarGrid = {
    cellSizePx: number;
    starIndexesByCell: Map<string, number[]>;
};

function getGridCellKey({
    cellX,
    cellY,
}: Readonly<{
    cellX: number;
    cellY: number;
}>) {
    return [
        cellX,
        cellY,
    ].join(',');
}

function addToStarGrid({
    grid,
    position,
    starIndex,
}: Readonly<{
    grid: StarGrid;
    position: Readonly<Coords>;
    starIndex: number;
}>) {
    const key = getGridCellKey({
        cellX: Math.floor(position.x / grid.cellSizePx),
        cellY: Math.floor(position.y / grid.cellSizePx),
    });

    grid.starIndexesByCell.set(key, [
        ...(grid.starIndexesByCell.get(key) || []),
        starIndex,
    ]);
}

/** Indexes of the stars in every grid cell within `radiusPx` of `position`. Some may be further. */
function getNearbyStarIndexes({
    grid,
    position,
    radiusPx,
}: Readonly<{
    grid: StarGrid;
    position: Readonly<Coords>;
    radiusPx: number;
}>) {
    const cellRadius = Math.ceil(radiusPx / grid.cellSizePx);
    const centerCellX = Math.floor(position.x / grid.cellSizePx);
    const centerCellY = Math.floor(position.y / grid.cellSizePx);

    return createArray(cellRadius * 2 + 1, (offsetY) => {
        return createArray(cellRadius * 2 + 1, (offsetX) => {
            return (
                grid.starIndexesByCell.get(
                    getGridCellKey({
                        cellX: centerCellX + offsetX - cellRadius,
                        cellY: centerCellY + offsetY - cellRadius,
                    }),
                ) || []
            );
        }).flat();
    }).flat();
}

function createStarGrid(stars: ReadonlyArray<Readonly<Coords>>) {
    const grid: StarGrid = {
        cellSizePx: minStarSpacingPx,
        starIndexesByCell: new Map(),
    };

    stars.forEach((star, starIndex) => {
        addToStarGrid({
            grid,
            position: star,
            starIndex,
        });
    });

    return grid;
}

/**
 * Scatters stars across the whole disc, packed denser along the spiral arms, leaving the core
 * empty. Only stable math is used so every peer places the same stars.
 */
function placeStars(galaxySeed: string) {
    const random = createStableRandom(
        [
            galaxySeed,
            'stars',
        ].join(':'),
    );
    const spiralShape = getSpiralShape(galaxySeed);
    /** Spacing checks only look at nearby stars, which would otherwise be the slowest part. */
    const grid: StarGrid = {
        cellSizePx: minStarSpacingPx,
        starIndexesByCell: new Map(),
    };

    return createArray(starPlacementAttemptCount, () => {
        const isOnArm = random.next() < armStarShare;
        /** The square root spreads disc stars evenly over the disc's area. */
        const radiusShare = coreRadiusShare + (1 - coreRadiusShare) * Math.sqrt(random.next());
        /** A rough bell curve, so arm stars cluster near the arm's middle. */
        const armScatter = random.next() + random.next() + random.next() - 1.5;
        const angle = isOnArm
            ? getSpiralArmAngle({
                  armIndex: Math.floor(random.next() * spiralShape.armCount),
                  radiusShare,
                  spiralShape,
              }) +
              armScatter * spiralShape.armSpread
            : random.next() * 2 * Math.PI;

        return {
            x: galaxyCenter.x + StableMath.cos(angle) * radiusShare * galaxyRadius.x,
            y: galaxyCenter.y + StableMath.sin(angle) * radiusShare * galaxyRadius.y,
        };
    }).reduce<Coords[]>((stars, candidate) => {
        const isTooClose =
            stars.length >= starCount ||
            getNearbyStarIndexes({
                grid,
                position: candidate,
                radiusPx: minStarSpacingPx,
            }).some((starIndex) => {
                return (
                    getDistanceSquared({
                        first: assertWrap.isDefined(stars[starIndex]),
                        second: candidate,
                    }) <
                    minStarSpacingPx * minStarSpacingPx
                );
            });

        if (isTooClose) {
            return stars;
        }

        addToStarGrid({
            grid,
            position: candidate,
            starIndex: stars.length,
        });

        return [
            ...stars,
            candidate,
        ];
    }, []);
}

function getCrossProduct({
    origin,
    first,
    second,
}: Readonly<{
    origin: Readonly<Coords>;
    first: Readonly<Coords>;
    second: Readonly<Coords>;
}>) {
    return (
        (first.x - origin.x) * (second.y - origin.y) - (first.y - origin.y) * (second.x - origin.x)
    );
}

/** Hyperlanes that share a star never count as crossing. */
function doHyperlanesCross({
    first,
    second,
    stars,
}: Readonly<{
    first: Readonly<Hyperlane>;
    second: Readonly<Hyperlane>;
    stars: ReadonlyArray<Readonly<Coords>>;
}>) {
    if (first.some((starIndex) => second.includes(starIndex))) {
        return false;
    }

    const [
        firstStart,
        firstEnd,
        secondStart,
        secondEnd,
    ] = assertWrap.isLengthExactly(
        [
            ...first,
            ...second,
        ].map((starIndex) => assertWrap.isDefined(stars[starIndex])),
        4,
    );

    return (
        getCrossProduct({
            first: firstEnd,
            origin: firstStart,
            second: secondStart,
        }) *
            getCrossProduct({
                first: firstEnd,
                origin: firstStart,
                second: secondEnd,
            }) <
            0 &&
        getCrossProduct({
            first: secondEnd,
            origin: secondStart,
            second: firstStart,
        }) *
            getCrossProduct({
                first: secondEnd,
                origin: secondStart,
                second: firstEnd,
            }) <
            0
    );
}

/** Whether a hyperlane passes too close to a star that isn't one of its ends. */
function doesHyperlaneGrazeStar({
    grid,
    hyperlane,
    stars,
}: Readonly<{
    grid: StarGrid;
    hyperlane: Readonly<Hyperlane>;
    stars: ReadonlyArray<Readonly<Coords>>;
}>) {
    const start = assertWrap.isDefined(stars[hyperlane[0]]);
    const end = assertWrap.isDefined(stars[hyperlane[1]]);
    const lane = {
        x: end.x - start.x,
        y: end.y - start.y,
    };
    const laneLengthSquared = lane.x * lane.x + lane.y * lane.y;

    return getNearbyStarIndexes({
        grid,
        position: {
            x: start.x + lane.x / 2,
            y: start.y + lane.y / 2,
        },
        radiusPx: maxTreeHyperlanePx / 2,
    }).some((starIndex) => {
        if (hyperlane.includes(starIndex)) {
            return false;
        }

        const star = assertWrap.isDefined(stars[starIndex]);
        const progress =
            ((star.x - start.x) * lane.x + (star.y - start.y) * lane.y) / laneLengthSquared;

        return (
            progress > 0 &&
            progress < 1 &&
            getDistanceSquared({
                first: star,
                second: {
                    x: start.x + lane.x * progress,
                    y: start.y + lane.y * progress,
                },
            }) <
                minHyperlaneStarClearancePx * minHyperlaneStarClearancePx
        );
    });
}

/** Every pair of stars closer than `maxDistancePx`, shortest first. */
function getSortedStarPairs({
    grid,
    maxDistancePx,
    stars,
}: Readonly<{
    grid: StarGrid;
    maxDistancePx: number;
    stars: ReadonlyArray<Readonly<Coords>>;
}>) {
    return stars
        .flatMap((star, starIndex) => {
            return getNearbyStarIndexes({
                grid,
                position: star,
                radiusPx: maxDistancePx,
            }).flatMap((otherStarIndex) => {
                const distanceSquared = getDistanceSquared({
                    first: star,
                    second: assertWrap.isDefined(stars[otherStarIndex]),
                });

                return otherStarIndex > starIndex &&
                    distanceSquared <= maxDistancePx * maxDistancePx
                    ? [
                          {
                              distanceSquared,
                              hyperlane: [
                                  starIndex,
                                  otherStarIndex,
                              ] satisfies Hyperlane,
                          },
                      ]
                    : [];
            });
        })
        .toSorted((first, second) => {
            return (
                first.distanceSquared - second.distanceSquared ||
                first.hyperlane[0] - second.hyperlane[0] ||
                first.hyperlane[1] - second.hyperlane[1]
            );
        });
}

/**
 * Kruskal's minimum spanning tree over the given pairs. A star with no pair in range stays in its
 * own group.
 */
function createSpanningTree({
    sortedPairs,
    stars,
}: Readonly<{
    sortedPairs: ReadonlyArray<
        Readonly<{
            hyperlane: Readonly<Hyperlane>;
        }>
    >;
    stars: ReadonlyArray<Readonly<Coords>>;
}>) {
    /** Union-find, so joining groups doesn't rewrite every star's group. */
    const parentIndexes = stars.map((_star, starIndex) => starIndex);

    /** The return type is annotated because the function is recursive. */
    function findRoot(starIndex: number): number {
        const parentIndex = assertWrap.isDefined(parentIndexes[starIndex]);

        if (parentIndex === starIndex) {
            return starIndex;
        }

        const rootIndex = findRoot(parentIndex);
        parentIndexes[starIndex] = rootIndex;

        return rootIndex;
    }

    return sortedPairs.flatMap(({hyperlane}) => {
        const firstRoot = findRoot(hyperlane[0]);
        const secondRoot = findRoot(hyperlane[1]);

        if (firstRoot === secondRoot) {
            return [];
        }

        parentIndexes[secondRoot] = firstRoot;

        return [
            [
                ...hyperlane,
            ] satisfies Hyperlane,
        ];
    });
}

/**
 * Connects the stars with a minimum spanning tree, so every star is reachable, then adds most of
 * the remaining short hyperlanes that don't cross another one, so there are many ways across the
 * galaxy.
 */
function connectStars({
    galaxySeed,
    stars,
}: Readonly<{
    galaxySeed: string;
    stars: ReadonlyArray<Readonly<Coords>>;
}>) {
    const random = createStableRandom(
        [
            galaxySeed,
            'hyperlanes',
        ].join(':'),
    );
    const grid = createStarGrid(stars);
    const treeHyperlanes = createSpanningTree({
        sortedPairs: getSortedStarPairs({
            grid,
            maxDistancePx: maxTreeHyperlanePx,
            stars,
        }),
        stars,
    });
    /** Crossing checks only look at hyperlanes from nearby stars, which would otherwise be slow. */
    const hyperlanesByStar = stars.map((): Hyperlane[] => []);

    function addHyperlane(hyperlane: Hyperlane) {
        hyperlane.forEach((starIndex) => {
            assertWrap.isDefined(hyperlanesByStar[starIndex]).push(hyperlane);
        });
    }

    treeHyperlanes.forEach(addHyperlane);

    const extraHyperlanes = getSortedStarPairs({
        grid,
        maxDistancePx: maxHyperlanePx,
        stars,
    }).flatMap(({hyperlane}) => {
        const nearbyHyperlanes = getNearbyStarIndexes({
            grid,
            position: assertWrap.isDefined(stars[hyperlane[0]]),
            radiusPx: maxTreeHyperlanePx + maxHyperlanePx,
        }).flatMap((starIndex) => assertWrap.isDefined(hyperlanesByStar[starIndex]));
        const isEligible =
            random.next() < extraHyperlaneChance &&
            hyperlane.every((starIndex) => {
                return (
                    assertWrap.isDefined(hyperlanesByStar[starIndex]).length < maxHyperlanesPerStar
                );
            }) &&
            !nearbyHyperlanes.some((existing) => {
                return (
                    existing.every((starIndex) => hyperlane.includes(starIndex)) ||
                    doHyperlanesCross({
                        first: existing,
                        second: hyperlane,
                        stars,
                    })
                );
            }) &&
            !doesHyperlaneGrazeStar({
                grid,
                hyperlane,
                stars,
            });

        if (!isEligible) {
            return [];
        }

        addHyperlane(hyperlane);

        return [
            hyperlane,
        ];
    });

    return [
        ...treeHyperlanes,
        ...extraHyperlanes,
    ];
}

/** Every star a hyperlane path reaches from `starIndex`, including itself. */
function findReachableStarIndexes({
    hyperlanes,
    starIndex,
}: Readonly<{
    hyperlanes: ReadonlyArray<Readonly<Hyperlane>>;
    starIndex: number;
}>) {
    const reached = new Set([
        starIndex,
    ]);
    const queue = [
        starIndex,
    ];

    /** A plain breadth-first search: the array-method version is quadratic. */
    for (const current of queue) {
        hyperlanes.forEach((hyperlane) => {
            const otherStarIndex = hyperlane[0] === current ? hyperlane[1] : hyperlane[0];

            if (hyperlane.includes(current) && !reached.has(otherStarIndex)) {
                reached.add(otherStarIndex);
                queue.push(otherStarIndex);
            }
        });
    }

    return reached;
}

const galaxyCache = new Map<string, Galaxy>();

/**
 * Generates a spiral galaxy of stars connected by hyperlanes. The same seed always generates the
 * same galaxy, on every peer.
 */
export function generateGalaxy(galaxySeed: string): Galaxy {
    const cachedGalaxy = galaxyCache.get(galaxySeed);

    if (cachedGalaxy) {
        return cachedGalaxy;
    }

    const placedStars = placeStars(galaxySeed);
    const placedHyperlanes = connectStars({
        galaxySeed,
        stars: placedStars,
    });
    const edgeShares = placedStars.map(getEdgeShare);
    const outermostStarIndex = edgeShares.indexOf(Math.max(...edgeShares));
    /**
     * A star too far from the others for even the spanning tree to reach would be unreachable, so
     * only the stars connected to the outermost star are kept.
     */
    const reachableStarIndexes = findReachableStarIndexes({
        hyperlanes: placedHyperlanes,
        starIndex: outermostStarIndex,
    });
    const keptStarIndexes = placedStars.flatMap((_star, starIndex) => {
        return reachableStarIndexes.has(starIndex) ? [starIndex] : [];
    });
    const stars = keptStarIndexes.map((placedStarIndex) => {
        const position = assertWrap.isDefined(placedStars[placedStarIndex]);

        return {
            ...position,
            difficulty: Math.round(
                clamp((1 - getEdgeShare(position)) / (1 - coreRadiusShare), {
                    max: 1,
                    min: 0,
                }) * maxStarDifficulty,
            ),
        };
    });
    const galaxy = {
        hyperlanes: placedHyperlanes.flatMap((hyperlane) => {
            return reachableStarIndexes.has(hyperlane[0])
                ? [
                      [
                          keptStarIndexes.indexOf(hyperlane[0]),
                          keptStarIndexes.indexOf(hyperlane[1]),
                      ] satisfies Hyperlane,
                  ]
                : [];
        }),
        startStarIndex: keptStarIndexes.indexOf(outermostStarIndex),
        stars,
    };

    galaxyCache.set(galaxySeed, galaxy);

    return galaxy;
}

/**
 * The star sharing a hyperlane with `starIndex` that is closest to the galaxy's center, or
 * `starIndex` itself when it has no hyperlanes.
 */
export function findConnectedStarClosestToCenter({
    galaxy,
    starIndex,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    starIndex: number;
}>) {
    return (
        getConnectedStarIndexes({
            galaxy,
            starIndex,
        })
            .map((connectedStarIndex) => {
                return {
                    distanceSquared: getDistanceSquared({
                        first: assertWrap.isDefined(galaxy.stars[connectedStarIndex]),
                        second: galaxyCenter,
                    }),
                    starIndex: connectedStarIndex,
                };
            })
            .toSorted((first, second) => first.distanceSquared - second.distanceSquared)[0]
            ?.starIndex ?? starIndex
    );
}

/** Indexes of the stars that share a hyperlane with `starIndex`. */
export function getConnectedStarIndexes({
    galaxy,
    starIndex,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    starIndex: number;
}>) {
    return galaxy.hyperlanes.flatMap(
        ([
            firstStarIndex,
            secondStarIndex,
        ]) => {
            if (firstStarIndex === starIndex) {
                return [secondStarIndex];
            } else if (secondStarIndex === starIndex) {
                return [firstStarIndex];
            } else {
                return [];
            }
        },
    );
}

/**
 * Whether `starIndexes` is a route of hyperlane jumps through `galaxy` from its start star. A saved
 * route stops fitting when the galaxy generator changes what a seed produces.
 */
export function isGalaxyRoute({
    galaxy,
    starIndexes,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    starIndexes: ReadonlyArray<number>;
}>) {
    return (
        starIndexes[0] === galaxy.startStarIndex &&
        starIndexes.slice(1).every((starIndex, index) => {
            return getConnectedStarIndexes({
                galaxy,
                starIndex: assertWrap.isDefined(starIndexes[index]),
            }).includes(starIndex);
        })
    );
}

/**
 * The star connected to the current star whose direction from it is closest to `direction`, which
 * doesn't need to be normalized. Returns `undefined` when the current star has no connections.
 */
export function pickConnectedStarToward({
    currentStarIndex,
    direction,
    galaxy,
}: Readonly<{
    currentStarIndex: number;
    direction: Readonly<Coords>;
    galaxy: Readonly<Galaxy>;
}>) {
    const currentStar = assertWrap.isDefined(galaxy.stars[currentStarIndex]);

    return getConnectedStarIndexes({
        galaxy,
        starIndex: currentStarIndex,
    })
        .map((starIndex) => {
            const star = assertWrap.isDefined(galaxy.stars[starIndex]);
            const offset = {
                x: star.x - currentStar.x,
                y: star.y - currentStar.y,
            };

            return {
                alignment:
                    (offset.x * direction.x + offset.y * direction.y) /
                    Math.hypot(offset.x, offset.y),
                starIndex,
            };
        })
        .toSorted((first, second) => second.alignment - first.alignment)[0]?.starIndex;
}

/**
 * Cycles the selection around the stars connected to the current star, ordered by their angle
 * around it. Right and down step clockwise, left and up step counterclockwise, so holding any one
 * direction visits every connected star. When the selection isn't a connected star yet, picks the
 * connected star that best matches the direction instead. Returns `undefined` when the current star
 * has no connections.
 */
export function pickConnectedStarInDirection({
    currentStarIndex,
    direction,
    galaxy,
    selectedStarIndex,
}: Readonly<{
    currentStarIndex: number;
    direction: Readonly<Coords>;
    galaxy: Readonly<Galaxy>;
    selectedStarIndex: number;
}>) {
    const currentStar = assertWrap.isDefined(galaxy.stars[currentStarIndex]);
    const candidates = getConnectedStarIndexes({
        galaxy,
        starIndex: currentStarIndex,
    })
        .map((starIndex) => {
            const star = assertWrap.isDefined(galaxy.stars[starIndex]);
            const offset = {
                x: star.x - currentStar.x,
                y: star.y - currentStar.y,
            };

            return {
                angle: Math.atan2(offset.y, offset.x),
                starIndex,
            };
        })
        .toSorted((first, second) => first.angle - second.angle);
    const selectedCandidateIndex = candidates.findIndex(
        ({starIndex}) => starIndex === selectedStarIndex,
    );

    if (selectedCandidateIndex < 0) {
        return pickConnectedStarToward({
            currentStarIndex,
            direction,
            galaxy,
        });
    }

    const step = direction.x + direction.y > 0 ? 1 : -1;

    return candidates[(selectedCandidateIndex + step + candidates.length) % candidates.length]
        ?.starIndex;
}

/**
 * The connected star nearest a point on the galaxy map, if one is close enough to have been
 * clicked.
 */
export function findConnectedStarNear({
    currentStarIndex,
    galaxy,
    position,
}: Readonly<{
    currentStarIndex: number;
    galaxy: Readonly<Galaxy>;
    position: Readonly<Coords>;
}>) {
    return getConnectedStarIndexes({
        galaxy,
        starIndex: currentStarIndex,
    })
        .map((starIndex) => {
            return {
                distanceSquared: getDistanceSquared({
                    first: assertWrap.isDefined(galaxy.stars[starIndex]),
                    second: position,
                }),
                starIndex,
            };
        })
        .filter(({distanceSquared}) => distanceSquared < minStarSpacingPx * minStarSpacingPx)
        .toSorted((first, second) => first.distanceSquared - second.distanceSquared)[0]?.starIndex;
}
