import {type ModExecuteParams} from '@antha/engine';
import {type ViewCreation2d} from '@antha/entity-2d';
import {Graphics} from '@antha/graphics-2d';
import {defineShape} from 'object-shape-tester';
import {defineEntity} from '../game-state/game-entity.mod.js';
import {flyCellSize} from './ship-fly.js';

export const debrisLifetimeMs = 1200;
const debrisSpinRadiansPerMs = 0.006;

/** A cell knocked off a ship. It drifts and fades without touching anything. */
export class DebrisEntity extends defineEntity({
    key: 'DebrisEntity',
    paramsShape: defineShape({
        ageMs: 0,
        color: '',
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
                .rect(-flyCellSize / 2, -flyCellSize / 2, flyCellSize, flyCellSize)
                .fill({
                    color: this.params.color,
                }),
        };
    }

    public override update({msSinceLastExecute}: Readonly<ModExecuteParams>) {
        this.params.ageMs += msSinceLastExecute;
        this.params.x += this.params.velocityX * msSinceLastExecute;
        this.params.y += this.params.velocityY * msSinceLastExecute;

        if (this.params.ageMs >= debrisLifetimeMs) {
            this.immediatelyDestroy();
        }
    }

    public override render() {
        this.view.alpha = 1 - this.params.ageMs / debrisLifetimeMs;
        this.view.rotation = this.params.ageMs * debrisSpinRadiansPerMs;
    }
}
