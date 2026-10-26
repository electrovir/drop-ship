import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {gameWorldSize} from '../game-state/game-world.js';
import {shipGridSize} from '../ship/ship-grid.js';
import {shipViewCellSize} from '../ship/ship.entity.js';
import {getBuildPanelLayout, getBuildPanelRects} from './scene-layout.js';

describe(getBuildPanelRects.name, () => {
    it('gives a single player the whole screen', () => {
        assert.deepEquals(getBuildPanelRects(1), [
            {
                height: gameWorldSize.height,
                width: gameWorldSize.width,
                x: 0,
                y: 0,
            },
        ]);
    });

    it('fills a 2×2 grid row by row for three players', () => {
        const width = gameWorldSize.width / 2;
        const height = gameWorldSize.height / 2;

        assert.deepEquals(getBuildPanelRects(3), [
            {
                height,
                width,
                x: 0,
                y: 0,
            },
            {
                height,
                width,
                x: width,
                y: 0,
            },
            {
                height,
                width,
                x: 0,
                y: height,
            },
        ]);
    });
});

describe(getBuildPanelLayout.name, () => {
    it('keeps the board inside its panel', () => {
        getBuildPanelRects(4).forEach((panel) => {
            const layout = getBuildPanelLayout(panel);
            const halfBoardWidth = (shipGridSize.width * shipViewCellSize * layout.board.scale) / 2;

            assert.isAtLeast(layout.boardTop, panel.y);
            assert.isAtMost(layout.boardBottom, panel.y + panel.height);
            assert.isAtLeast(layout.board.x - halfBoardWidth, panel.x);
            assert.isAtMost(layout.board.x + halfBoardWidth, panel.x + panel.width);
        });
    });
});
