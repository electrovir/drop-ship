import {defineAnthaMod} from '@antha/engine';
import {markBindingActed, MenuNavBinding} from '@antha/input';
import {
    createMultiplayerPlayerId,
    extractMultiplayerPlayerIdParts,
    type ClientId,
} from '@antha/multiplayer-core';
import {LocalPlayerPosition} from '@antha/util';
import {check} from '@augment-vir/assert';
import {
    arrayToObject,
    getEnumValues,
    getObjectTypedEntries,
    typedObjectFromEntries,
} from '@augment-vir/common';
import {findNewestInputDevice} from '../player/input-device.js';
import {sendLocalControls} from '../player/local-controls.js';
import {savePilotProgress} from '../player/save-pilot-progress.js';
import {findShip} from '../ship/ship.entity.js';
import {GameMenuKey, type FullGameState} from './game-state.js';
import {MultiplayerPacketType} from './multiplayer-packet.js';
import {findLocalProfile, startLocalGame} from './multiplayer-session.js';
import {type GameSaveState} from './save-data.js';

/** The local player choosing a profile. Menus opened by code are player one's. */
export function getProfileSelectPosition(state: Partial<Pick<FullGameState, 'menuState'>>) {
    return state.menuState?.openedBy?.playerPosition ?? LocalPlayerPosition.One;
}

function hasLocalShip({
    localClientId,
    playerPosition,
    state,
}: Readonly<{
    localClientId: ClientId | undefined;
    playerPosition: LocalPlayerPosition;
    state: Partial<FullGameState>;
}>) {
    return (
        !!localClientId &&
        !!state.entityStore &&
        !!findShip({
            entityStore: state.entityStore,
            playerId: createMultiplayerPlayerId({
                clientId: localClientId,
                playerPosition,
            }),
        })
    );
}

/**
 * Only the player choosing a profile can use the profile menu. Otherwise, player one can always use
 * menus and other local players can use them once they've joined.
 */
function getAllowedPlayerMenuNavigation({
    localClientId,
    state,
}: Readonly<{
    localClientId: ClientId | undefined;
    state: Partial<FullGameState>;
}>) {
    const isSelectingProfile = state.menuState?.menuHistory.at(-1) === GameMenuKey.ProfileSelect;

    return arrayToObject(getEnumValues(LocalPlayerPosition), (playerPosition) => {
        return {
            key: playerPosition,
            value: isSelectingProfile
                ? playerPosition === getProfileSelectPosition(state)
                : playerPosition === LocalPlayerPosition.One ||
                  hasLocalShip({
                      localClientId,
                      playerPosition,
                      state,
                  }),
        };
    });
}

/**
 * Opens the profile menu for player one until they've picked a profile, or for another local player
 * that presses enter to join.
 */
function openProfileSelect({
    localClientId,
    state,
}: Readonly<{
    localClientId: ClientId;
    state: Partial<FullGameState>;
}>) {
    if (state.menuState) {
        return;
    } else if (
        !findLocalProfile({
            playerPosition: LocalPlayerPosition.One,
            state,
        })
    ) {
        state.menuState = {
            menuHistory: [
                GameMenuKey.ProfileSelect,
            ],
            openedBy: undefined,
        };
        return;
    }

    const joiningPlayerPosition = getEnumValues(LocalPlayerPosition).find((playerPosition) => {
        const menuEnterBinding = state.activeBindings?.[playerPosition]?.[MenuNavBinding.MenuEnter];

        return (
            playerPosition !== LocalPlayerPosition.One &&
            !!menuEnterBinding &&
            !menuEnterBinding.actCount &&
            !hasLocalShip({
                localClientId,
                playerPosition,
                state,
            })
        );
    });
    const menuEnterBinding =
        joiningPlayerPosition &&
        state.activeBindings?.[joiningPlayerPosition]?.[MenuNavBinding.MenuEnter];

    if (!joiningPlayerPosition || !menuEnterBinding) {
        return;
    }

    /** The press that opens the menu would otherwise also press the menu's first button. */
    markBindingActed(menuEnterBinding);
    state.menuState = {
        menuHistory: [
            GameMenuKey.ProfileSelect,
        ],
        openedBy: {
            activeBinding: menuEnterBinding,
            playerPosition: joiningPlayerPosition,
        },
    };
}

/** Whether each menu, when it's the first one opened, pauses the game for every peer. */
const isPausingMenu: Readonly<Record<GameMenuKey, boolean>> = {
    [GameMenuKey.MultiplayerRooms]: false,
    [GameMenuKey.Options]: false,
    [GameMenuKey.Pause]: true,
    /** A joining player picks their profile while everyone waits. */
    [GameMenuKey.ProfileSelect]: true,
};

/**
 * Asks every peer to pause while a local player has a pausing menu open, and to resume once it
 * closes. Pausing goes through the lockstep frames, so every peer pauses on the same frame.
 */
function requestLocalPause({
    localClientId,
    state,
}: Readonly<{
    localClientId: ClientId;
    state: Partial<FullGameState>;
}>) {
    const rootMenu = state.menuState?.menuHistory[0];
    const positions = rootMenu && isPausingMenu[rootMenu] ? [getProfileSelectPosition(state)] : [];
    const syncedPositions = (state.pausingPlayerIds || []).flatMap((playerId) => {
        const playerIdParts = extractMultiplayerPlayerIdParts({
            playerId,
        });

        return playerIdParts.clientId === localClientId ? [playerIdParts.playerPosition] : [];
    });
    const isAlreadyRequested =
        !!state.pauseRequest &&
        check.deepEquals(state.pauseRequest.positions, positions) &&
        check.deepEquals(state.pauseRequest.syncedPositions, syncedPositions);

    if (check.deepEquals(positions, syncedPositions) || isAlreadyRequested) {
        return;
    }

    state.pauseRequest = {
        positions,
        syncedPositions,
    };
    state.multiplayerP2pLockStep?.multiplayerController.act({
        playerPositions: positions,
        type: MultiplayerPacketType.PauseSet,
    });
}

/**
 * Remembers each local player's device until they press something on another one. The object is
 * only replaced when a device changes, since the menu re-renders whenever it's replaced.
 */
function updateLastInputDevices({
    activeBindings,
    saveState,
}: Readonly<{
    activeBindings: FullGameState['activeBindings'] | undefined;
    saveState: GameSaveState;
}>) {
    const lastInputDevices: GameSaveState['lastInputDevices'] = {
        ...saveState.lastInputDevices,
        ...typedObjectFromEntries(
            getObjectTypedEntries(activeBindings || {}).flatMap(
                ([
                    playerPosition,
                    activeBindings,
                ]) => {
                    const device = findNewestInputDevice(activeBindings);

                    return device
                        ? [
                              [
                                  playerPosition,
                                  device,
                              ] as const,
                          ]
                        : [];
                },
            ),
        ),
    };

    if (!check.deepEquals(lastInputDevices, saveState.lastInputDevices)) {
        saveState.lastInputDevices = lastInputDevices;
    }
}

/** Coordinates game state and local players. */
export const gameUpdateMod = defineAnthaMod<
    FullGameState & {
        hasStartedInitialGame: boolean;
    }
>({
    modName: 'game-update',
    execute({state}) {
        if (state.saveState) {
            if (state.deviceHandler) {
                state.deviceHandler.globalDeadZone = state.saveState.joystickDeadZone;
            }

            state.audioChannelVolume = {
                channels: state.saveState.volume,
                master: state.saveState.masterVolume,
            };
            updateLastInputDevices({
                activeBindings: state.activeBindings,
                saveState: state.saveState,
            });
        }

        state.allowedPlayerMenuNavigation = getAllowedPlayerMenuNavigation({
            localClientId: state.multiplayerP2pLockStep?.multiplayerController.getClientId(),
            state,
        });

        if (!state.multiplayerP2pLockStep || !state.pixi?.pixiApplication?.screen) {
            return;
        }

        const localClientId = state.multiplayerP2pLockStep.multiplayerController.getClientId();

        if (localClientId) {
            openProfileSelect({
                localClientId,
                state,
            });
            requestLocalPause({
                localClientId,
                state,
            });
            sendLocalControls({
                localClientId,
                state,
            });
            savePilotProgress({
                localClientId,
                state,
            });
        }

        if (!state.hasStartedInitialGame && state.entityStore) {
            startLocalGame(state);
            state.hasStartedInitialGame = true;
        }
    },
});
