import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {CellKind, Direction, maxCellHp} from './ship-cell.js';
import {getShipSpeedPxPerMs} from './ship-fly.js';
import {cockpitPosition, createStarterShipGrid} from './ship-grid.js';

function createThrusterGrid(level: number) {
    return {
        cells: [
            ...createStarterShipGrid().cells,
            {
                facing: Direction.Forward,
                hp: maxCellHp[CellKind.Thruster],
                kind: CellKind.Thruster,
                level,
                x: cockpitPosition.x,
                y: cockpitPosition.y - 1,
            },
        ],
    };
}

describe(getShipSpeedPxPerMs.name, () => {
    it('speeds up with thrusters', () => {
        assert.isAbove(
            getShipSpeedPxPerMs(createThrusterGrid(1)),
            getShipSpeedPxPerMs(createStarterShipGrid()),
        );
    });

    it('stops speeding up past the max speed', () => {
        assert.strictEquals(
            getShipSpeedPxPerMs(createThrusterGrid(40)),
            getShipSpeedPxPerMs(createThrusterGrid(20)),
        );
    });
});
