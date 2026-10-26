import {type SoundEffectConfig} from './playback/sound-effect-player.js';

/**
 * Every sound effect in the game. Their sounds are defined in `sound-effect-scores.ts`. The synth
 * worker imports this file, so it must not import anything that touches the DOM.
 */
export enum SoundEffect {
    GunShot = 'gun-shot',
    RapidGunShot = 'rapid-gun-shot',
    SpreadGunShot = 'spread-gun-shot',
    EnemyShot = 'enemy-shot',
    EnemyHit = 'enemy-hit',
    EnemyDestroyed = 'enemy-destroyed',
    LargeEnemyDestroyed = 'large-enemy-destroyed',
    BossDestroyed = 'boss-destroyed',
    BossWarning = 'boss-warning',
    ShipHit = 'ship-hit',
    ShipCellDestroyed = 'ship-cell-destroyed',
    ShipWrecked = 'ship-wrecked',
    PieceMove = 'piece-move',
    PieceRotate = 'piece-rotate',
    PieceSwap = 'piece-swap',
    PiecePlace = 'piece-place',
    /** A build action or menu move that can't happen. */
    Denied = 'denied',
    /** The camera diving into a hyperlane after a star system is picked on the galaxy map. */
    HyperspaceJump = 'hyperspace-jump',
    WaveCleared = 'wave-cleared',
    LifeLost = 'life-lost',
    GameOver = 'game-over',
    MenuMove = 'menu-move',
    MenuSelect = 'menu-select',
    MenuBack = 'menu-back',
}

/**
 * Effects that fire many times a second get several variants, played in turn, so they don't sound
 * like a machine gun of identical samples, and a minimum interval so a burst doesn't stack into a
 * wall of noise.
 */
export const soundEffectConfigs: Readonly<Record<SoundEffect, SoundEffectConfig>> = {
    [SoundEffect.GunShot]: {
        variantCount: 4,
        minIntervalMs: 45,
    },
    [SoundEffect.RapidGunShot]: {
        variantCount: 4,
        minIntervalMs: 45,
    },
    [SoundEffect.SpreadGunShot]: {
        variantCount: 3,
        minIntervalMs: 60,
    },
    [SoundEffect.EnemyShot]: {
        variantCount: 3,
        minIntervalMs: 50,
    },
    [SoundEffect.EnemyHit]: {
        variantCount: 4,
        minIntervalMs: 35,
    },
    [SoundEffect.EnemyDestroyed]: {
        variantCount: 4,
        minIntervalMs: 40,
    },
    [SoundEffect.LargeEnemyDestroyed]: {
        variantCount: 2,
        minIntervalMs: 80,
    },
    [SoundEffect.BossDestroyed]: {},
    [SoundEffect.BossWarning]: {},
    [SoundEffect.ShipHit]: {
        variantCount: 3,
        minIntervalMs: 50,
    },
    [SoundEffect.ShipCellDestroyed]: {
        variantCount: 3,
        minIntervalMs: 50,
    },
    [SoundEffect.ShipWrecked]: {
        minIntervalMs: 200,
    },
    [SoundEffect.PieceMove]: {
        variantCount: 2,
        minIntervalMs: 25,
    },
    [SoundEffect.PieceRotate]: {
        minIntervalMs: 25,
    },
    [SoundEffect.PieceSwap]: {
        minIntervalMs: 25,
    },
    [SoundEffect.PiecePlace]: {
        variantCount: 2,
        minIntervalMs: 25,
    },
    [SoundEffect.Denied]: {
        minIntervalMs: 120,
    },
    [SoundEffect.HyperspaceJump]: {
        minIntervalMs: 500,
    },
    [SoundEffect.WaveCleared]: {
        minIntervalMs: 500,
    },
    [SoundEffect.LifeLost]: {
        minIntervalMs: 500,
    },
    [SoundEffect.GameOver]: {
        minIntervalMs: 500,
    },
    [SoundEffect.MenuMove]: {
        minIntervalMs: 25,
    },
    [SoundEffect.MenuSelect]: {
        minIntervalMs: 25,
    },
    [SoundEffect.MenuBack]: {
        minIntervalMs: 25,
    },
};
