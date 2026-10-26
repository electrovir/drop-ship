import {createSaveGameSuite} from '@antha/asset';
import {LocalPlayerPosition} from '@antha/util';
import {defineShape, enumShape, exactShape, recordShape} from 'object-shape-tester';
import {
    defaultGameAudioVolumeByChannel,
    defaultGameMasterVolume,
    GameAudioChannel,
} from '../audio/game-audio.js';
import {playerInputDeviceShape} from '../player/input-device.js';
import {createPlayerProfile, playerProfileShape} from '../player/player-profile.js';

export const defaultJoystickDeadZone = 0.25;

const savedGameStateShape = defineShape({
    joystickDeadZone: -1,
    /** The device each local player last used, so control hints match it. */
    lastInputDevices: recordShape({
        keys: enumShape(LocalPlayerPosition),
        partial: true,
        values: playerInputDeviceShape,
    }),
    /** Player one starts as this profile. */
    lastProfileId: '',
    masterVolume: -1,
    profiles: [
        playerProfileShape,
    ],
    version: exactShape(1),
    volume: recordShape({
        keys: enumShape(GameAudioChannel),
        values: -1,
    }),
});

type SavedGameState = typeof savedGameStateShape.runtimeType;
export type GameSaveState = Omit<SavedGameState, 'version'>;

export function createDefaultGameSaveState(): GameSaveState {
    return {
        joystickDeadZone: defaultJoystickDeadZone,
        lastInputDevices: {},
        lastProfileId: '',
        masterVolume: defaultGameMasterVolume,
        profiles: [
            createPlayerProfile([]),
        ],
        volume: {
            ...defaultGameAudioVolumeByChannel,
        },
    };
}

export const {anthaAutosaveMod, loadSaveDataAsset, persistSaveState} = createSaveGameSuite({
    fallbackState: createDefaultGameSaveState,
    deserialize(savedGameState: SavedGameState | undefined): GameSaveState {
        if (savedGameState) {
            return {
                joystickDeadZone: savedGameState.joystickDeadZone,
                lastInputDevices: savedGameState.lastInputDevices,
                lastProfileId: savedGameState.lastProfileId,
                masterVolume: savedGameState.masterVolume,
                profiles: savedGameState.profiles.length
                    ? savedGameState.profiles
                    : [
                          createPlayerProfile([]),
                      ],
                volume: savedGameState.volume,
            };
        } else {
            return createDefaultGameSaveState();
        }
    },
    serialize({
        joystickDeadZone,
        lastInputDevices,
        lastProfileId,
        masterVolume,
        profiles,
        volume,
    }: GameSaveState): SavedGameState {
        return {
            joystickDeadZone,
            lastInputDevices,
            lastProfileId,
            masterVolume,
            profiles,
            version: 1,
            volume,
        };
    },
    storedSaveStateShape: savedGameStateShape,
});
