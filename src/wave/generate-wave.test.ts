import {assert} from '@augment-vir/assert';
import {createArray} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {EnemyKind} from '../enemy/enemy-kind.js';
import {generateWave, isBossWave} from './generate-wave.js';

const baseWaveParams = {
    playerCount: 1,
    runSeed: 'test run',
    difficulty: 0,
};

describe(generateWave.name, () => {
    it('generates the same wave for the same inputs', () => {
        assert.deepEquals(generateWave(baseWaveParams), generateWave(baseWaveParams));
    });

    it('generates different waves for different run seeds', () => {
        assert.notDeepEquals(
            generateWave(baseWaveParams),
            generateWave({
                ...baseWaveParams,
                runSeed: 'other run',
            }),
        );
    });

    it('only spawns straight-flyers and a few shooters in the easiest systems', () => {
        assert.deepEquals(
            [
                0,
                1,
            ].map((difficulty) => {
                const enemyKinds = generateWave({
                    ...baseWaveParams,
                    difficulty,
                }).spawns.map((spawn) => spawn.enemyKind);

                return {
                    hasOnlyEasyKinds: enemyKinds.every((enemyKind) => {
                        return enemyKind === EnemyKind.Straight || enemyKind === EnemyKind.Shooter;
                    }),
                    hasShooters: enemyKinds.includes(EnemyKind.Shooter),
                    isMostlyStraight:
                        enemyKinds.filter((enemyKind) => enemyKind === EnemyKind.Straight).length >
                        enemyKinds.length / 2,
                };
            }),
            createArray(2, () => {
                return {
                    hasOnlyEasyKinds: true,
                    hasShooters: true,
                    isMostlyStraight: true,
                };
            }),
        );
    });

    it('spawns more enemies in later waves and with more players', () => {
        const firstWaveCount = generateWave(baseWaveParams).spawns.length;

        assert.deepEquals(
            {
                laterWave:
                    generateWave({
                        ...baseWaveParams,
                        difficulty: 3,
                    }).spawns.length > firstWaveCount,
                morePlayers:
                    generateWave({
                        ...baseWaveParams,
                        playerCount: 4,
                    }).spawns.length > firstWaveCount,
            },
            {
                laterWave: true,
                morePlayers: true,
            },
        );
    });

    it('spawns in time order', () => {
        const spawnTimes = generateWave({
            ...baseWaveParams,
            difficulty: 5,
        }).spawns.map((spawn) => spawn.atMs);

        assert.deepEquals(
            spawnTimes,
            spawnTimes.toSorted((first, second) => first - second),
        );
    });

    it('ends boss waves with the only boss', () => {
        const bossWaveIndex = 4;
        const bossKinds = [
            generateWave({
                ...baseWaveParams,
                difficulty: bossWaveIndex - 1,
            }),
            generateWave({
                ...baseWaveParams,
                difficulty: bossWaveIndex,
            }),
        ].map((wave) => {
            return wave.spawns
                .map((spawn) => spawn.enemyKind)
                .filter((enemyKind) => enemyKind === EnemyKind.Boss);
        });

        assert.deepEquals(
            {
                bossKinds,
                isBossWave: isBossWave(bossWaveIndex),
                lastKind: generateWave({
                    ...baseWaveParams,
                    difficulty: bossWaveIndex,
                }).spawns.at(-1)?.enemyKind,
            },
            {
                bossKinds: [
                    [],
                    [
                        EnemyKind.Boss,
                    ],
                ],
                isBossWave: true,
                lastKind: EnemyKind.Boss,
            },
        );
    });
});
