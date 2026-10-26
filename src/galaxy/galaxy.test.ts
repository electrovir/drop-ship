import {assert, assertWrap} from '@augment-vir/assert';
import {type Coords} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {
    findConnectedStarClosestToCenter,
    galaxyCenter,
    generateGalaxy,
    getConnectedStarIndexes,
    isGalaxyRoute,
    maxStarDifficulty,
    pickConnectedStarInDirection,
    pickConnectedStarToward,
} from './galaxy.js';

describe(generateGalaxy.name, () => {
    it('generates the same galaxy from the same seed', () => {
        assert.deepEquals(
            structuredClone(generateGalaxy('test galaxy')),
            structuredClone(generateGalaxy('test galaxy')),
        );
    });

    it('connects every star to the start star', () => {
        const galaxy = generateGalaxy('test galaxy');

        /** The return type is annotated because the function is recursive. */
        function expandReached(reached: ReadonlySet<number>): ReadonlySet<number> {
            const expanded = new Set([
                ...reached,
                ...galaxy.hyperlanes.flatMap((hyperlane) => {
                    return hyperlane.some((starIndex) => reached.has(starIndex)) ? hyperlane : [];
                }),
            ]);

            return expanded.size === reached.size ? reached : expandReached(expanded);
        }

        assert.strictEquals(
            expandReached(new Set([galaxy.startStarIndex])).size,
            galaxy.stars.length,
        );
    });

    it('has hundreds of stars', () => {
        assert.isAbove(generateGalaxy('test galaxy').stars.length, 300);
    });

    it('makes stars harder closer to the core', () => {
        const galaxy = generateGalaxy('test galaxy');
        const difficulties = galaxy.stars.map((star) => star.difficulty);

        assert.deepEquals(
            {
                maxDifficulty: Math.max(...difficulties) > maxStarDifficulty / 2,
                startDifficulty: assertWrap.isDefined(galaxy.stars[galaxy.startStarIndex])
                    .difficulty,
            },
            {
                maxDifficulty: true,
                startDifficulty: 0,
            },
        );
    });
});

describe(pickConnectedStarInDirection.name, () => {
    const galaxy = generateGalaxy('test galaxy');
    const currentStarIndex = galaxy.startStarIndex;
    const connectedStarIndexes = getConnectedStarIndexes({
        galaxy,
        starIndex: currentStarIndex,
    });

    function pressRepeatedly(direction: Readonly<Coords>) {
        return connectedStarIndexes.reduce<number[]>(
            (visited) => {
                return [
                    ...visited,
                    assertWrap.isDefined(
                        pickConnectedStarInDirection({
                            currentStarIndex,
                            direction,
                            galaxy,
                            selectedStarIndex: assertWrap.isDefined(visited.at(-1)),
                        }),
                    ),
                ];
            },
            [
                assertWrap.isDefined(connectedStarIndexes[0]),
            ],
        );
    }

    it('visits every connected star when one direction is pressed repeatedly', () => {
        const visited = pressRepeatedly({
            x: 1,
            y: 0,
        });

        assert.deepEquals(visited.at(-1), visited[0]);
        assert.deepEquals(
            visited.slice(1).toSorted((first, second) => first - second),
            connectedStarIndexes.toSorted((first, second) => first - second),
        );
    });

    it('steps the opposite way for the opposite direction', () => {
        assert.deepEquals(
            pressRepeatedly({
                x: -1,
                y: 0,
            }),
            pressRepeatedly({
                x: 1,
                y: 0,
            }).toReversed(),
        );
    });
});

describe(pickConnectedStarToward.name, () => {
    it('picks each connected star when pointed straight at it', () => {
        const galaxy = generateGalaxy('test galaxy');
        const currentStar = assertWrap.isDefined(galaxy.stars[galaxy.startStarIndex]);
        const connectedStarIndexes = getConnectedStarIndexes({
            galaxy,
            starIndex: galaxy.startStarIndex,
        });

        assert.deepEquals(
            connectedStarIndexes.map((starIndex) => {
                const star = assertWrap.isDefined(galaxy.stars[starIndex]);

                return pickConnectedStarToward({
                    currentStarIndex: galaxy.startStarIndex,
                    direction: {
                        x: star.x - currentStar.x,
                        y: star.y - currentStar.y,
                    },
                    galaxy,
                });
            }),
            connectedStarIndexes,
        );
    });
});

describe(isGalaxyRoute.name, () => {
    const galaxy = generateGalaxy('test galaxy');
    const firstJumpStarIndex = assertWrap.isDefined(
        getConnectedStarIndexes({
            galaxy,
            starIndex: galaxy.startStarIndex,
        })[0],
    );

    it('accepts hyperlane jumps from the start star', () => {
        assert.isTrue(
            isGalaxyRoute({
                galaxy,
                starIndexes: [
                    galaxy.startStarIndex,
                    firstJumpStarIndex,
                ],
            }),
        );
    });

    it('rejects a route between unconnected stars', () => {
        const unconnectedStarIndex = galaxy.stars.findIndex((star, starIndex) => {
            return (
                starIndex !== galaxy.startStarIndex &&
                !getConnectedStarIndexes({
                    galaxy,
                    starIndex: galaxy.startStarIndex,
                }).includes(starIndex)
            );
        });

        assert.isFalse(
            isGalaxyRoute({
                galaxy,
                starIndexes: [
                    galaxy.startStarIndex,
                    unconnectedStarIndex,
                ],
            }),
        );
    });
});

describe(findConnectedStarClosestToCenter.name, () => {
    it('picks the connected star closest to the center', () => {
        const galaxy = generateGalaxy('test galaxy');
        const distances = getConnectedStarIndexes({
            galaxy,
            starIndex: galaxy.startStarIndex,
        }).map((starIndex) => {
            const star = assertWrap.isDefined(galaxy.stars[starIndex]);

            return Math.hypot(star.x - galaxyCenter.x, star.y - galaxyCenter.y);
        });
        const selectedStar = assertWrap.isDefined(
            galaxy.stars[
                findConnectedStarClosestToCenter({
                    galaxy,
                    starIndex: galaxy.startStarIndex,
                })
            ],
        );

        assert.strictEquals(
            Math.hypot(selectedStar.x - galaxyCenter.x, selectedStar.y - galaxyCenter.y),
            Math.min(...distances),
        );
    });
});
