import {type Coords} from '@augment-vir/common';

/**
 * Squared distance between two points. Compare against a squared radius to avoid `Math.sqrt` in the
 * simulation.
 */
export function getDistanceSquared({
    first,
    second,
}: Readonly<{
    first: Readonly<Coords>;
    second: Readonly<Coords>;
}>) {
    const offsetX = first.x - second.x;
    const offsetY = first.y - second.y;

    /**
     * Multiplication instead of `**`, which uses `Math.pow` and isn't guaranteed to round the same
     * in every browser.
     */
    return offsetX * offsetX + offsetY * offsetY;
}
