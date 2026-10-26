import {AnthaKeyboard, AnthaKeyboardSpecialKey, nav} from '@antha/input';
import {isMultiplayerRoomConnected} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {getObjectTypedValues, selectFrom} from '@augment-vir/common';
import {css, defineElement, html, listen, nothing, testId, unsafeCSS} from 'element-vir';
import {noNativeSpacing, viraTheme} from 'vira';
import {type FullGameState} from '../game-state/game-state.js';
import {getProfileSelectPosition} from '../game-state/game-update.mod.js';
import {MultiplayerPacketType} from '../game-state/multiplayer-packet.js';
import {startLocalGame} from '../game-state/multiplayer-session.js';
import {
    createPlayerProfile,
    getNextPlayerColor,
    isDefaultPlayerProfileName,
    maxPlayerProfileNameLength,
    sanitizePlayerProfileName,
    type PlayerProfile,
} from '../player/player-profile.js';
import {isProgressSavedInPhase} from '../player/save-pilot-progress.js';
import {findRunEntity} from '../run/run.entity.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {VirGameButton} from './vir-game-button.element.js';

function updateProfiles({
    gameState,
    updateProfile,
}: Readonly<{
    gameState: Partial<FullGameState>;
    updateProfile: (profile: Readonly<PlayerProfile>) => PlayerProfile;
}>) {
    if (gameState.saveState) {
        gameState.saveState.profiles = gameState.saveState.profiles.map(updateProfile);
    }
}

/** Shows only the saved profiles that no local player, including the one choosing, is flying. */
function getAvailableProfiles(gameState: Partial<FullGameState>) {
    const takenProfileIds = getObjectTypedValues(gameState.localProfileIds || {});

    return (gameState.saveState?.profiles || []).filter(
        (profile) => !takenProfileIds.includes(profile.id),
    );
}

function chooseProfile({
    gameState,
    playerPosition,
    profile,
}: Readonly<{
    gameState: Partial<FullGameState>;
    playerPosition: LocalPlayerPosition;
    profile: Readonly<PlayerProfile>;
}>) {
    gameState.localProfileIds = {
        ...gameState.localProfileIds,
        [playerPosition]: profile.id,
    };

    if (playerPosition === LocalPlayerPosition.One && gameState.saveState) {
        gameState.saveState.lastProfileId = profile.id;
    }

    if (playerPosition === LocalPlayerPosition.One && !isMultiplayerRoomConnected(gameState)) {
        /** Player one's pilot owns the run, so their saved run replaces the current one. */
        startLocalGame(gameState);
        return;
    }

    gameState.multiplayerP2pLockStep?.multiplayerController.act({
        grid: createStarterShipGrid(),
        playerPosition,
        profile: selectFrom(profile, {
            color: true,
            name: true,
        }),
        type: MultiplayerPacketType.SpawnPlayer,
    });
    gameState.menuState = undefined;
}

/** Lets a local player pick, recolor, rename, or create the saved profile they play as. */
export const GameProfileSelect = defineElement<{
    gameState: Partial<FullGameState>;
}>()({
    tagName: 'game-profile-select',
    testIds: [
        'newProfileButton',
    ],
    state() {
        return {
            nameDraft: '',
            renamingProfileId: undefined as PlayerProfile['id'] | undefined,
        };
    },
    styles: css`
        :host,
        ul {
            align-items: center;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        h1,
        p,
        ul {
            ${noNativeSpacing}
        }

        h1 {
            font-size: 48px;
        }

        ul {
            gap: 8px;
            list-style: none;
        }

        li {
            display: flex;
            gap: 8px;
        }

        .warning {
            color: ${viraTheme.colors['vira-red-foreground-non-body'].foreground.value};
            font-weight: bold;
        }

        .color-swatch {
            border-radius: 50%;
            display: inline-block;
            height: 16px;
            margin-right: 8px;
            width: 16px;
        }
    `,
    render({host, inputs, state, testIds, updateState}) {
        const navController = inputs.gameState.navController;

        if (!navController) {
            return nothing;
        }

        const playerPosition = getProfileSelectPosition(inputs.gameState);

        if (state.renamingProfileId) {
            const renamingProfileId = state.renamingProfileId;

            return html`
                <h1>Rename pilot</h1>
                <${AnthaKeyboard.assign({
                    maxLength: maxPlayerProfileNameLength,
                    navController,
                    value: state.nameDraft,
                })}
                    ${listen(AnthaKeyboard.events.valueChange, (event) => {
                        updateState({
                            nameDraft: event.detail,
                        });
                    })}
                    ${listen(AnthaKeyboard.events.keyPress, (event) => {
                        if (event.detail.special !== AnthaKeyboardSpecialKey.Enter) {
                            return;
                        }

                        updateProfiles({
                            gameState: inputs.gameState,
                            updateProfile(profile) {
                                return profile.id === renamingProfileId
                                    ? {
                                          ...profile,
                                          name: sanitizePlayerProfileName({
                                              fallbackName: profile.name,
                                              name: state.nameDraft,
                                          }),
                                      }
                                    : profile;
                            },
                        });
                        updateState({
                            nameDraft: '',
                            renamingProfileId: undefined,
                        });
                    })}
                ></${AnthaKeyboard}>
            `;
        }

        const profiles = getAvailableProfiles(inputs.gameState);
        const run = inputs.gameState.entityStore
            ? findRunEntity(inputs.gameState.entityStore)
            : undefined;

        return html`
            <h1>Choose pilot</h1>
            <p>Player ${playerPosition}</p>
            ${run && !isProgressSavedInPhase[run.params.phase]
                ? html`
                      <p class="warning">Changing pilot exits the current level.</p>
                  `
                : nothing}
            <ul>
                ${profiles.map((profile, index) => {
                    return html`
                        <li>
                            <${VirGameButton}
                                ${nav(navController, {
                                    autoFocus: !index,
                                    listeners: {
                                        activate({enabled}) {
                                            if (enabled) {
                                                chooseProfile({
                                                    gameState: inputs.gameState,
                                                    playerPosition,
                                                    profile,
                                                });
                                            }
                                        },
                                    },
                                    x: 0,
                                    y: index,
                                })}
                            >
                                <span
                                    class="color-swatch"
                                    style=${css`
                                        background-color: ${unsafeCSS(profile.color)};
                                    `}
                                ></span>
                                ${profile.name}
                            </${VirGameButton}>
                            <${VirGameButton}
                                ${nav(navController, {
                                    listeners: {
                                        activate({enabled}) {
                                            if (enabled) {
                                                updateProfiles({
                                                    gameState: inputs.gameState,
                                                    updateProfile(savedProfile) {
                                                        return savedProfile.id === profile.id
                                                            ? {
                                                                  ...savedProfile,
                                                                  color: getNextPlayerColor(
                                                                      savedProfile.color,
                                                                  ),
                                                              }
                                                            : savedProfile;
                                                    },
                                                });
                                                host.requestUpdate();
                                            }
                                        },
                                    },
                                    x: 1,
                                    y: index,
                                })}
                            >
                                Color
                            </${VirGameButton}>
                            <${VirGameButton}
                                ${nav(navController, {
                                    listeners: {
                                        activate({enabled}) {
                                            if (enabled) {
                                                updateState({
                                                    nameDraft: isDefaultPlayerProfileName(
                                                        profile.name,
                                                    )
                                                        ? ''
                                                        : profile.name,
                                                    renamingProfileId: profile.id,
                                                });
                                            }
                                        },
                                    },
                                    x: 2,
                                    y: index,
                                })}
                            >
                                Rename
                            </${VirGameButton}>
                        </li>
                    `;
                })}
                <li>
                    <${VirGameButton}
                        ${testId(testIds.newProfileButton)}
                        ${nav(navController, {
                            autoFocus: !profiles.length,
                            listeners: {
                                activate({enabled}) {
                                    if (enabled && inputs.gameState.saveState) {
                                        inputs.gameState.saveState.profiles = [
                                            ...inputs.gameState.saveState.profiles,
                                            createPlayerProfile(
                                                inputs.gameState.saveState.profiles,
                                            ),
                                        ];
                                        host.requestUpdate();
                                    }
                                },
                            },
                            y: profiles.length,
                        })}
                    >
                        New pilot
                    </${VirGameButton}>
                </li>
            </ul>
        `;
    },
});
