import {type ViewCreation2d} from '@antha/entity-2d';
import {Graphics} from '@antha/graphics-2d';
import {normalizeVector2d} from '@antha/util';
import {type Coords, type SeededRandom} from '@augment-vir/common';
import {defineShape, enumShape} from 'object-shape-tester';
import {defineEntity} from '../game-state/game-entity.mod.js';
import {gameWorldSize} from '../game-state/game-world.js';
import {getCellColor} from '../ship/cell-color.js';
import {CellKind} from '../ship/ship-cell.js';

const fragmentSize = 8;
/** Fragments aren't owned by one pilot, so hull gets a neutral color. */
const fragmentHullColor = '#c8d2e6';
const fragmentDriftPxPerMs = 0.06;
const fragmentScatterPxPerMs = 0.15;
/** How much of a fragment's scatter velocity is lost each millisecond. */
const fragmentDragPerMs = 0.004;
const magnetPullPxPerMs = 0.5;
const fragmentSpinRadiansPerMs = 0.004;

/** A random velocity for a fragment that just broke off. */
export function createFragmentScatterVelocity(random: Readonly<Pick<SeededRandom, 'next'>>) {
    return {
        velocityX: (random.next() * 2 - 1) * fragmentScatterPxPerMs,
        velocityY: (random.next() * 2 - 1) * fragmentScatterPxPerMs,
    };
}

/**
 * A piece of a broken enemy part. It drifts down the screen until a ship's magnet pulls it in.
 * `RunEntity` steps it and collects it.
 */
export class FragmentEntity extends defineEntity({
    key: 'FragmentEntity',
    paramsShape: defineShape({
        ageMs: 0,
        /** Sent out by a cleared system's star. These only fill their own kind's progress. */
        isReward: false,
        kind: enumShape(CellKind),
        /** Pixels per millisecond. */
        velocityX: 0,
        velocityY: 0,
        x: 0,
        y: 0,
    }),
    paramsMap: {
        view: {
            x: true,
            y: true,
        },
    },
}) {
    public override createView(): ViewCreation2d {
        return {
            view: new Graphics()
                .poly([
                    0,
                    -fragmentSize,
                    fragmentSize,
                    0,
                    0,
                    fragmentSize,
                    -fragmentSize,
                    0,
                ])
                .fill({
                    color: getCellColor({
                        hullColor: fragmentHullColor,
                        kind: this.params.kind,
                    }),
                })
                .stroke({
                    color: '#111111',
                    width: 2,
                }),
        };
    }

    /** Fragments are stepped by `RunEntity`. */
    public override update() {}

    public override render() {
        this.view.rotation = this.params.ageMs * fragmentSpinRadiansPerMs;
    }

    /** Moves toward `magnetTarget` when one is given. Otherwise slows down and drifts down. */
    public step({
        frameMs,
        magnetTarget,
    }: Readonly<{
        frameMs: number;
        magnetTarget: Readonly<Coords> | undefined;
    }>) {
        const drag = Math.min(1, fragmentDragPerMs * frameMs);
        const pullDirection =
            magnetTarget &&
            normalizeVector2d({
                x: magnetTarget.x - this.params.x,
                y: magnetTarget.y - this.params.y,
            });

        this.params.velocityX = pullDirection
            ? pullDirection.x * magnetPullPxPerMs
            : this.params.velocityX * (1 - drag);
        this.params.velocityY = pullDirection
            ? pullDirection.y * magnetPullPxPerMs
            : this.params.velocityY + (fragmentDriftPxPerMs - this.params.velocityY) * drag;
        this.params.ageMs += frameMs;
        this.params.x += this.params.velocityX * frameMs;
        this.params.y += this.params.velocityY * frameMs;

        if (this.params.y > gameWorldSize.height + fragmentSize) {
            this.immediatelyDestroy();
        }
    }
}
