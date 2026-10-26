import {StableMath} from '@antha/util';
import {type Coords} from '@augment-vir/common';

/**
 * How far along the ray it first touches the axis-aligned square, or `undefined` when it misses.
 * `direction` must be a unit vector. A ray starting inside the square touches it at 0.
 */
export function getRayDistanceToSquare({
    direction,
    origin,
    square,
}: Readonly<{
    direction: Readonly<Coords>;
    origin: Readonly<Coords>;
    /** `x` and `y` are the square's center. */
    square: Readonly<Coords & {size: number}>;
}>) {
    const halfSize = square.size / 2;
    const ranges = (
        [
            'x',
            'y',
        ] as const
    ).map((axis) => {
        const min = square[axis] - halfSize - origin[axis];
        const max = square[axis] + halfSize - origin[axis];

        if (!direction[axis]) {
            return min <= 0 && max >= 0
                ? {
                      enter: -Infinity,
                      exit: Infinity,
                  }
                : undefined;
        }

        const first = min / direction[axis];
        const second = max / direction[axis];

        return {
            enter: Math.min(first, second),
            exit: Math.max(first, second),
        };
    });

    if (ranges.some((range) => !range)) {
        return undefined;
    }

    const enter = Math.max(0, ...ranges.map((range) => range?.enter ?? 0));
    const exit = Math.min(...ranges.map((range) => range?.exit ?? 0));

    return exit < enter ? undefined : enter;
}

/**
 * How far along the ray it first touches the circle, or `undefined` when it misses. `direction`
 * must be a unit vector. A ray starting inside the circle touches it at 0.
 */
export function getRayDistanceToCircle({
    circle,
    direction,
    origin,
}: Readonly<{
    circle: Readonly<Coords & {radius: number}>;
    direction: Readonly<Coords>;
    origin: Readonly<Coords>;
}>) {
    const offsetX = origin.x - circle.x;
    const offsetY = origin.y - circle.y;
    const along = offsetX * direction.x + offsetY * direction.y;
    const outside = offsetX * offsetX + offsetY * offsetY - circle.radius * circle.radius;

    if (outside <= 0) {
        return 0;
    }

    const discriminant = along * along - outside;

    if (along > 0 || discriminant < 0) {
        return undefined;
    }

    return -along - StableMath.sqrt(discriminant);
}
