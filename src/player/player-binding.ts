import {type MenuNavBinding} from '@antha/input';

/**
 * Directions are screen directions. On the galaxy map, they pick the next star. While building,
 * they move the active piece. While flying, they steer the ship.
 */
export enum PlayerBinding {
    PlayerLeft = 'player-left',
    PlayerRight = 'player-right',
    PlayerUp = 'player-up',
    PlayerDown = 'player-down',
    PieceRotate = 'piece-rotate',
    PieceRotateCounterclockwise = 'piece-rotate-counterclockwise',
    PiecePlace = 'piece-place',
    PieceSwap = 'piece-swap',
    /** Takes back the last piece placed this build. */
    PieceUndo = 'piece-undo',
    /** Finishes building and starts the level once every pilot has pressed it. */
    Launch = 'launch',
    /** Travels to the selected star on the galaxy map. */
    Travel = 'travel',
}

export type GameBinding = PlayerBinding | MenuNavBinding;
