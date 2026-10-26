import {clamp, createArray, type Coords, type Dimensions} from '@augment-vir/common';
import {gameWorldSize} from '../game-state/game-world.js';
import {flyCellSize} from '../ship/ship-fly.js';
import {shipGridSize} from '../ship/ship-grid.js';
import {shipViewCellSize} from '../ship/ship.entity.js';

const boardCenterPanelShare: Readonly<Coords> = {
    x: 0.42,
    y: 0.5,
};
const boardMaxPanelShare: Readonly<Dimensions> = {
    height: 0.6,
    width: 0.7,
};
const previewCenterPanelShareX = 0.7;
const previewScaleShare = 0.45;

export type PanelRect = Coords & Dimensions;

/** Where a ship view is drawn: the grid's center, its rotation in radians, and its scale. */
export type ShipViewTransform = Coords & {
    rotation: number;
    scale: number;
};

/** Splits the screen into one build panel per local player: side by side for 2, 2×2 for 3 or 4. */
export function getBuildPanelRects(panelCount: number) {
    const columnCount = panelCount > 1 ? 2 : 1;
    const rowCount = panelCount > 2 ? 2 : 1;
    const width = gameWorldSize.width / columnCount;
    const height = gameWorldSize.height / rowCount;

    return createArray(panelCount, (panelIndex) => {
        return {
            height,
            width,
            x: (panelIndex % columnCount) * width,
            y: Math.floor(panelIndex / columnCount) * height,
        };
    });
}

/** Places a build panel's board, upright like the flying ship so the camera never has to turn it. */
export function getBuildPanelLayout(panel: Readonly<PanelRect>) {
    const scale = Math.min(
        (panel.width * boardMaxPanelShare.width) / (shipGridSize.width * shipViewCellSize),
        (panel.height * boardMaxPanelShare.height) / (shipGridSize.height * shipViewCellSize),
    );
    const board = {
        rotation: 0,
        scale,
        x: panel.x + panel.width * boardCenterPanelShare.x,
        y: panel.y + panel.height * boardCenterPanelShare.y,
    };
    const boardHalfHeight = (shipGridSize.height * shipViewCellSize * scale) / 2;

    return {
        board,
        boardBottom: board.y + boardHalfHeight,
        boardTop: board.y - boardHalfHeight,
        preview: {
            rotation: 0,
            scale: scale * previewScaleShare,
            x: panel.x + panel.width * previewCenterPanelShareX,
            y: board.y,
        },
    };
}

export function getFlyTransform(fly: Readonly<Coords>) {
    return {
        rotation: 0,
        scale: flyCellSize / shipViewCellSize,
        x: fly.x,
        y: fly.y,
    };
}

/** Eases `progress` (from 0 to 1) so the camera starts and stops gently. */
export function easeTransition(progress: number) {
    const clampedProgress = clamp(progress, {
        max: 1,
        min: 0,
    });

    return clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
}

export function interpolateShipViewTransform({
    from,
    progress,
    to,
}: Readonly<{
    from: Readonly<ShipViewTransform>;
    /** From 0 (at `from`) to 1 (at `to`). */
    progress: number;
    to: Readonly<ShipViewTransform>;
}>) {
    return {
        rotation: from.rotation + (to.rotation - from.rotation) * progress,
        scale: from.scale + (to.scale - from.scale) * progress,
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
    };
}
