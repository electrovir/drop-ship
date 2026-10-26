import {randomString} from '@augment-vir/common';
import {defineShape} from 'object-shape-tester';
import {partProgressShape} from '../part/part-progress.js';
import {createStarterShipGrid, shipGridShape} from '../ship/ship-grid.js';
import {pieceShape} from '../ship/ship-piece.js';

/** The parts of a pilot's progress that the whole run shares. */
export const runProgressShape = defineShape({
    /** Pieces earned since the last build phase. */
    earnedPieces: [
        pieceShape,
    ],
    /** Each pilot keeps their galaxy until they leave it. */
    galaxySeed: '',
    partProgress: [
        partProgressShape,
    ],
    systemsCleared: 0,
    /** Every star traveled to, in order, ending with the current star. Empty before the first jump. */
    visitedStarIndexes: [
        0,
    ],
});

export type RunProgress = typeof runProgressShape.runtimeType;

/** Saved each time the galaxy map opens, so quitting mid-level loses only that level. */
export const pilotProgressShape = defineShape({
    run: runProgressShape,
    shipGrid: shipGridShape,
});

export type PilotProgress = typeof pilotProgressShape.runtimeType;

/** A run starting from the galaxy's edge, in a new galaxy unless `galaxySeed` is given. */
export function createNewPilotProgress(galaxySeed = randomString()) {
    return {
        run: {
            earnedPieces: [],
            galaxySeed,
            partProgress: [],
            systemsCleared: 0,
            visitedStarIndexes: [],
        },
        shipGrid: createStarterShipGrid(),
    } satisfies PilotProgress;
}
