import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {damageShield, getShieldCapacity, ShieldOwner, stepShields} from './shield.js';
import {CellKind, Direction} from './ship-cell.js';

const shieldCells = [
    {
        facing: Direction.Forward,
        hp: 1,
        kind: CellKind.Shield,
        level: 1,
        x: 2,
        y: 3,
    },
];

const playerCapacity = getShieldCapacity({
    level: 1,
    owner: ShieldOwner.Player,
});

function createDamagedShields(damage: number) {
    return damageShield({
        damage,
        index: 0,
        shields: stepShields({
            cells: shieldCells,
            frameMs: 0,
            owner: ShieldOwner.Player,
            shields: [],
        }),
    });
}

describe(stepShields.name, () => {
    it('recharges a damaged shield fully after a short break', () => {
        const shields = stepShields({
            cells: shieldCells,
            frameMs: 4000,
            owner: ShieldOwner.Player,
            shields: createDamagedShields(1),
        });

        assert.deepEquals(
            shields.map(({energy, isBroken}) => {
                return {
                    energy,
                    isBroken,
                };
            }),
            [
                {
                    energy: playerCapacity,
                    isBroken: false,
                },
            ],
        );
    });

    it('keeps a broken shield down until its slower recharge finishes', () => {
        const brokenShields = createDamagedShields(playerCapacity);
        const afterBreak = stepShields({
            cells: shieldCells,
            frameMs: 4000,
            owner: ShieldOwner.Player,
            shields: brokenShields,
        });
        const afterFullRecharge = stepShields({
            cells: shieldCells,
            frameMs: 4000,
            owner: ShieldOwner.Player,
            shields: afterBreak,
        });

        assert.deepEquals(
            [
                brokenShields,
                afterBreak,
                afterFullRecharge,
            ].map((shields) => shields[0]?.isBroken),
            [
                true,
                true,
                false,
            ],
        );
    });
});
