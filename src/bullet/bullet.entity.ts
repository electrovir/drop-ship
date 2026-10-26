import {type ModExecuteParams} from '@antha/engine';
import {type ViewCreation2d} from '@antha/entity-2d';
import {Graphics} from '@antha/graphics-2d';
import {normalizeVector2d, StableMath} from '@antha/util';
import {type Coords} from '@augment-vir/common';
import {defineShape, enumShape} from 'object-shape-tester';
import {defineEntity} from '../game-state/game-entity.mod.js';
import {gameWorldSize} from '../game-state/game-world.js';

export enum BulletSide {
    Enemy = 'enemy',
    Player = 'player',
}

export const bulletRadius = 4;
/** Missiles fly slower than the side's bullets. */
export const missileSpeedFactor = 0.55;
/** How fast a missile turns toward its target, as a share of its speed each millisecond. */
const missileTurnPerMs = 0.004;
/** Missiles that never find a target run out of fuel instead of circling forever. */
const missileLifetimeMs = 4000;
const missileLength = 12;

const bulletColors: Readonly<Record<BulletSide, string>> = {
    [BulletSide.Enemy]: '#ff375f',
    [BulletSide.Player]: '#fffbe6',
};

/** Missiles are drawn pointing along +x, so their rotation is their heading. */
export function createBulletGraphics({
    isMissile,
    side,
}: Readonly<{isMissile: boolean; side: BulletSide}>) {
    return isMissile
        ? new Graphics()
              .poly([
                  missileLength / 2,
                  0,
                  -missileLength / 2,
                  -bulletRadius,
                  -missileLength / 2,
                  bulletRadius,
              ])
              .fill({
                  color: bulletColors[side],
              })
              .stroke({
                  color: '#ffd60a',
                  width: 1,
              })
        : new Graphics().circle(0, 0, bulletRadius).fill({
              color: bulletColors[side],
          });
}

/** The missile's velocity turned part of the way toward `target`, keeping its speed. */
export function steerMissile({
    frameMs,
    missile,
    target,
}: Readonly<{
    frameMs: number;
    missile: Readonly<Coords & {velocityX: number; velocityY: number}>;
    target: Readonly<Coords>;
}>) {
    const speed = StableMath.hypot([
        missile.velocityX,
        missile.velocityY,
    ]);
    const heading = normalizeVector2d({
        x: missile.velocityX,
        y: missile.velocityY,
    });
    const toTarget = normalizeVector2d({
        x: target.x - missile.x,
        y: target.y - missile.y,
    });
    const turn = Math.min(1, missileTurnPerMs * frameMs);
    const direction = normalizeVector2d({
        x: heading.x + (toTarget.x - heading.x) * turn,
        y: heading.y + (toTarget.y - heading.y) * turn,
    });

    return {
        velocityX: direction.x * speed,
        velocityY: direction.y * speed,
    };
}

/** A bullet only hits the other side. Hits are resolved by `RunEntity`. */
export class BulletEntity extends defineEntity({
    key: 'BulletEntity',
    paramsShape: defineShape({
        ageMs: 0,
        damage: 0,
        /** Missiles are steered toward the closest target by `RunEntity`. */
        isMissile: false,
        side: enumShape(BulletSide),
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
            view: createBulletGraphics(this.params),
        };
    }

    public override render() {
        if (this.params.isMissile) {
            this.view.rotation = Math.atan2(this.params.velocityY, this.params.velocityX);
        }
    }

    public override update({msSinceLastExecute}: Readonly<ModExecuteParams>) {
        this.params.x += this.params.velocityX * msSinceLastExecute;
        this.params.y += this.params.velocityY * msSinceLastExecute;
        this.params.ageMs += msSinceLastExecute;

        if (
            (this.params.isMissile && this.params.ageMs >= missileLifetimeMs) ||
            this.params.x < -bulletRadius ||
            this.params.y < -bulletRadius ||
            this.params.x > gameWorldSize.width + bulletRadius ||
            this.params.y > gameWorldSize.height + bulletRadius
        ) {
            this.immediatelyDestroy();
        }
    }
}
