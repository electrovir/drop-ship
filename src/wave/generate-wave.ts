import {createStableRandom, stableRandomInteger, type SeededRandom} from '@antha/util';
import {assertWrap} from '@augment-vir/assert';
import {createArray, getEnumValues} from '@augment-vir/common';
import {EnemyKind} from '../enemy/enemy-kind.js';
import {gameWorldSize} from '../game-state/game-world.js';

const enemySpawnMargin = 80;
const formationSpacingPx = 70;
/** Every this many difficulty levels, the wave ends with a boss. */
const bossWaveInterval = 5;
/** How fast the ships close in on the system's star. */
export const systemTravelPxPerMs = 0.1;
/** Time after the last spawn for slow enemies to cross the screen before the star passes. */
const starPassMarginMs = 10_000;

/** How many enemies spawn side by side when a kind spawns as a formation. */
const formationSizes: Readonly<Record<EnemyKind, number>> = {
    [EnemyKind.Straight]: 3,
    [EnemyKind.Shooter]: 1,
    [EnemyKind.Tank]: 1,
    [EnemyKind.Weaver]: 3,
    [EnemyKind.Diver]: 1,
    [EnemyKind.Boss]: 1,
};
const formationChance = 0.5;

/** Formations start as pairs in the easiest systems and grow every few difficulty levels. */
function getMaxFormationSize(difficulty: number) {
    return 2 + Math.floor(difficulty / 3);
}

/**
 * Each enemy kind's chance to spawn, relative to the others, for a given difficulty. Easy systems
 * mostly have simple enemies, and each more complex kind joins at a higher difficulty.
 */
const enemyKindWeights: Readonly<Record<EnemyKind, (difficulty: number) => number>> = {
    [EnemyKind.Straight]() {
        return 6;
    },
    [EnemyKind.Weaver](difficulty) {
        return difficulty >= 2 ? 3 : 0;
    },
    /** A few shooters show up from the start so gun fragments can be collected early. */
    [EnemyKind.Shooter](difficulty) {
        return difficulty >= 3 ? difficulty - 1 : 2;
    },
    [EnemyKind.Tank](difficulty) {
        return difficulty >= 5 ? difficulty - 4 : 0;
    },
    [EnemyKind.Diver](difficulty) {
        return difficulty >= 7 ? 1 + (difficulty - 6) / 2 : 0;
    },
    /** Bosses only spawn at the end of a boss wave. */
    [EnemyKind.Boss]() {
        return 0;
    },
};

function pickEnemyKind({
    random,
    difficulty,
}: Readonly<{
    random: Readonly<SeededRandom>;
    difficulty: number;
}>) {
    const weightedKinds = getEnumValues(EnemyKind).map((enemyKind) => {
        return {
            enemyKind,
            weight: enemyKindWeights[enemyKind](difficulty),
        };
    });
    const totalWeight = weightedKinds.reduce((sum, {weight}) => sum + weight, 0);
    const roll = random.next() * totalWeight;

    return assertWrap.isDefined(
        weightedKinds.find((_weightedKind, index) => {
            return (
                weightedKinds.slice(0, index + 1).reduce((sum, {weight}) => sum + weight, 0) > roll
            );
        }),
    ).enemyKind;
}

export function isBossWave(difficulty: number) {
    return (difficulty + 1) % bossWaveInterval === 0;
}

/**
 * Lists every enemy spawn in a wave. Higher difficulty and more players mean more enemies, spawned
 * closer together and moving faster. Some enemies spawn side by side in formations, and every boss
 * wave ends with a boss. The same inputs always generate the same wave.
 */
export function generateWave({
    playerCount,
    runSeed,
    difficulty,
}: Readonly<{
    playerCount: number;
    runSeed: string;
    difficulty: number;
}>) {
    const random = createStableRandom(
        [
            runSeed,
            'wave',
            difficulty,
        ].join(':'),
    );
    const groupCount = 20 + difficulty * 9 + (playerCount - 1) * 10;
    const spawnIntervalMs = Math.max(200, 800 - difficulty * 60);
    const groups = createArray(groupCount, (index) => {
        const atMs =
            index * spawnIntervalMs +
            stableRandomInteger({
                max: spawnIntervalMs / 2,
                min: 0,
                random,
            });
        const enemyKind = pickEnemyKind({
            random,
            difficulty,
        });
        const size =
            random.next() < formationChance
                ? Math.min(formationSizes[enemyKind], getMaxFormationSize(difficulty))
                : 1;
        const firstX = stableRandomInteger({
            max: gameWorldSize.width - enemySpawnMargin - (size - 1) * formationSpacingPx,
            min: enemySpawnMargin,
            random,
        });

        return createArray(size, (formationIndex) => {
            return {
                atMs,
                enemyKind,
                x: firstX + formationIndex * formationSpacingPx,
            };
        });
    }).flat();
    /** Boss waves cut the regular enemies in half to make room for the boss. */
    const regularSpawns = isBossWave(difficulty)
        ? groups.slice(0, Math.ceil(groups.length / 2))
        : groups;

    const spawns = isBossWave(difficulty)
        ? [
              ...regularSpawns,
              {
                  atMs: (regularSpawns.at(-1)?.atMs ?? 0) + spawnIntervalMs,
                  enemyKind: EnemyKind.Boss,
                  x: gameWorldSize.width / 2,
              },
          ]
        : regularSpawns;

    return {
        enemySpeedMultiplier: 1 + difficulty * 0.1,
        spawns,
        /**
         * How far the ships start from the system's star. The wave ends when the star passes the
         * bottom of the screen, so this sets the wave's length.
         */
        starDistancePx: ((spawns.at(-1)?.atMs ?? 0) + starPassMarginMs) * systemTravelPxPerMs,
    };
}
