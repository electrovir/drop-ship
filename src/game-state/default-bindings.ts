import {KnownInput} from '@antha/gamepad-type';
import {createDefaultLocalPlayerBindings} from '@antha/input';
import {PlayerBinding, type GameBinding} from '../player/player-binding.js';

/**
 * Provides movement, piece, and menu controls for every local player when a game starts. Only
 * player one gets keyboard controls.
 */
export const defaultBindings = createDefaultLocalPlayerBindings<GameBinding>({
    buttonBindings: {
        [PlayerBinding.PiecePlace]: {
            gamepadInputNames: [
                KnownInput.FaceAccept,
            ],
            keyboardInputNames: [
                'button-Space',
            ],
        },
        [PlayerBinding.PieceRotate]: {
            gamepadInputNames: [
                KnownInput.FaceAlt1,
            ],
            keyboardInputNames: [
                'button-KeyE',
            ],
        },
        [PlayerBinding.PieceRotateCounterclockwise]: {
            gamepadInputNames: [],
            keyboardInputNames: [
                'button-KeyQ',
            ],
        },
        [PlayerBinding.Launch]: {
            gamepadInputNames: [
                KnownInput.Start,
            ],
            keyboardInputNames: [
                'button-Enter',
                'button-NumpadEnter',
            ],
        },
        [PlayerBinding.Travel]: {
            gamepadInputNames: [
                KnownInput.FaceAccept,
            ],
            keyboardInputNames: [
                'button-Enter',
                'button-NumpadEnter',
            ],
        },
        [PlayerBinding.PieceUndo]: {
            gamepadInputNames: [
                KnownInput.FaceCancel,
            ],
            keyboardInputNames: [
                'button-Escape',
            ],
        },
        [PlayerBinding.PieceSwap]: {
            gamepadInputNames: [
                KnownInput.FaceAlt2,
            ],
            keyboardInputNames: [
                'button-ShiftLeft',
                'button-ShiftRight',
            ],
        },
    },
    directionalBindingNames: {
        down: PlayerBinding.PlayerDown,
        left: PlayerBinding.PlayerLeft,
        right: PlayerBinding.PlayerRight,
        up: PlayerBinding.PlayerUp,
    },
});
