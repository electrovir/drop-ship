// cspell:word tetromino
import {Container, Graphics, Text} from '@antha/graphics-2d';
import {gameWorldSize} from '../game-state/game-world.js';
import {getFragmentsNeeded} from '../part/part-progress.js';
import {type RunEntity} from '../run/run.entity.js';
import {getCellColor} from '../ship/cell-color.js';
import {CellKind} from '../ship/ship-cell.js';
import {drawShipCells, shipViewCellSize} from '../ship/ship.entity.js';

const previewSlotCellCount = 4;
const previewScale = 0.25;
const previewSize = previewSlotCellCount * shipViewCellSize * previewScale;
const rowGap = 6;
const barWidth = 120;
const barHeight = 10;
const edgeMargin = 16;

/**
 * The hull tetromino's progress, then the progress of each special piece that has any fragments.
 * Each row shows the piece it's working toward, then how close it is.
 */
export function createPartProgressHud() {
    const hud = {
        bars: new Graphics(),
        container: new Container(),
        drawnHullColor: '',
        drawnPartProgress: undefined as RunEntity['params']['partProgress'] | undefined,
        earnedText: new Text({
            style: {
                fill: '#ffffff',
                fontFamily: 'sans-serif',
                fontSize: 20,
            },
            text: '',
        }),
        previews: new Graphics(),
    };

    hud.previews.scale.set(previewScale);
    hud.container.addChild(hud.previews, hud.bars, hud.earnedText);

    return hud;
}

export type PartProgressHud = ReturnType<typeof createPartProgressHud>;

export function updatePartProgressHud({
    hud,
    hullColor,
    run,
}: Readonly<{
    hud: PartProgressHud;
    hullColor: string;
    run: Readonly<RunEntity>;
}>) {
    const earnedCount = run.params.earnedPieces.length;

    hud.earnedText.text = earnedCount
        ? `${earnedCount} new ${earnedCount === 1 ? 'piece' : 'pieces'}`
        : '';

    if (hud.drawnPartProgress === run.params.partProgress && hud.drawnHullColor === hullColor) {
        return;
    }

    hud.drawnPartProgress = run.params.partProgress;
    hud.drawnHullColor = hullColor;
    hud.previews.clear();
    hud.bars.clear();

    const shownProgress = run.params.partProgress.filter((progress) => {
        return progress.kind === CellKind.Hull || progress.fragments > 0;
    });

    shownProgress.forEach((progress, rowIndex) => {
        const rowTop = rowIndex * (previewSize + rowGap);
        const xValues = progress.piece.cells.map((cell) => cell.x);
        const yValues = progress.piece.cells.map((cell) => cell.y);
        /** Ship space has +y up, so the slot's bottom row is negative to sit below `rowTop`. */
        const slotBottom = -rowTop / previewScale / shipViewCellSize - previewSlotCellCount;
        const offset = {
            x: (previewSlotCellCount - Math.min(...xValues) - Math.max(...xValues) - 1) / 2,
            y:
                slotBottom +
                (previewSlotCellCount - Math.min(...yValues) - Math.max(...yValues) - 1) / 2,
        };
        const fill = Math.min(1, progress.fragments / getFragmentsNeeded(progress));
        const barTop = rowTop + (previewSize - barHeight) / 2;
        const barLeft = previewSize + rowGap;

        drawShipCells({
            alpha: 1,
            hullColor,
            cells: progress.piece.cells.map((cell) => {
                return {
                    ...cell,
                    x: cell.x + offset.x,
                    y: cell.y + offset.y,
                };
            }),
            graphics: hud.previews,
        });
        hud.bars
            .rect(barLeft, barTop, barWidth, barHeight)
            .fill({
                color: '#1c2640',
            })
            .rect(barLeft, barTop, barWidth * fill, barHeight)
            .fill({
                color: getCellColor({
                    hullColor,
                    kind: progress.kind,
                }),
            })
            .rect(barLeft, barTop, barWidth, barHeight)
            .stroke({
                color: '#3a4a6b',
                width: 2,
            });
    });

    const rowsHeight = shownProgress.length * (previewSize + rowGap) - rowGap;

    hud.earnedText.position.set(0, rowsHeight + rowGap);
    hud.container.position.set(
        edgeMargin,
        gameWorldSize.height - edgeMargin - rowsHeight - rowGap - hud.earnedText.height,
    );
}
