import {SeededRandom} from '@augment-vir/common';
import {gameWorldSize} from '../game-state/game-world.js';

/**
 * The size and spot of a system's star. The returned `random` has already rolled them, so the rest
 * of the system's scenery keeps rolling from it.
 */
export function createSystemStar({
    galaxySeed,
    starIndex,
}: Readonly<{
    galaxySeed: string;
    starIndex: number;
}>) {
    const random = SeededRandom.fromSeed(
        [
            galaxySeed,
            starIndex,
            'planets',
        ].join(':'),
    );
    const radius = 40 + random.next() * 30;

    return {
        radius,
        random,
        x: gameWorldSize.width * (0.3 + random.next() * 0.4),
    };
}
