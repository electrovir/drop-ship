import {BulletEntity} from '../bullet/bullet.entity.js';
import {EnemyEntity} from '../enemy/enemy.entity.js';
import {RunEntity} from '../run/run.entity.js';
import {DebrisEntity} from '../ship/debris.entity.js';
import {ShipEntity} from '../ship/ship.entity.js';

/** Every entity class, so each one can be loaded up front and deserialized from a state sync. */
export const gameEntities = [
    BulletEntity,
    DebrisEntity,
    EnemyEntity,
    RunEntity,
    ShipEntity,
];
