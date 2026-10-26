import {MenuNavBinding} from '@antha/input';
import {listenToObject} from '@antha/util';
import {type EmptyFunction} from '@augment-vir/common';
import {css, defineElement, html, nothing} from 'element-vir';
import {ViraIcon} from 'vira';
import {GameMenuKey, type FullGameState} from '../game-state/game-state.js';
import {getProfileSelectPosition} from '../game-state/game-update.mod.js';
import {getBindingIcon} from '../player/input-device.js';
import {GameMultiplayerRooms} from './game-multiplayer-rooms.element.js';
import {GameOptionsMenu} from './game-options-menu.element.js';
import {GamePauseMenu} from './game-pause-menu.element.js';
import {GameProfileSelect} from './game-profile-select.element.js';

/**
 * Whether backing out of each menu does anything when it's the only one open. The game reopens
 * player one's first pilot pick as soon as it closes.
 */
function canGoBack(menuState: Readonly<NonNullable<FullGameState['menuState']>>) {
    const rootMenuCanClose: Readonly<Record<GameMenuKey, boolean>> = {
        [GameMenuKey.MultiplayerRooms]: true,
        [GameMenuKey.Options]: true,
        [GameMenuKey.Pause]: true,
        [GameMenuKey.ProfileSelect]: !!menuState.openedBy,
    };
    const rootMenu = menuState.menuHistory[0];

    return menuState.menuHistory.length > 1 || (!!rootMenu && rootMenuCanClose[rootMenu]);
}

/** Shows the icons for selecting and going back on the menu player's last used device. */
function renderControlHints(gameState: Partial<FullGameState>) {
    const playerPosition = getProfileSelectPosition(gameState);
    const hints = [
        {
            bindingName: MenuNavBinding.MenuEnter,
            isShown: true,
            label: 'Select',
        },
        {
            bindingName: MenuNavBinding.MenuExit,
            isShown: !!gameState.menuState && canGoBack(gameState.menuState),
            label: 'Back',
        },
    ];

    return html`
        <div class="control-hints">
            ${hints
                .filter((hint) => hint.isShown)
                .map((hint) => {
                    const icon = getBindingIcon({
                        bindingAssignments: gameState.bindingAssignments?.[playerPosition],
                        bindingName: hint.bindingName,
                        device: gameState.saveState?.lastInputDevices[playerPosition],
                    });

                    return html`
                        <span class="control-hint">
                            ${icon
                                ? html`
                                      <${ViraIcon.assign({
                                          icon,
                                      })}></${ViraIcon}>
                                  `
                                : nothing}
                            ${hint.label}
                        </span>
                    `;
                })}
        </div>
    `;
}

/** Renders the active game overlay so menu state appears consistently above the game. */
export const GameMenu = defineElement<{
    gameState: Partial<FullGameState>;
}>()({
    tagName: 'game-menu',
    state({inputs}) {
        return {
            cleanup: undefined as undefined | EmptyFunction[],
            activeMenu: inputs.gameState.menuState?.menuHistory.at(-1),
        };
    },
    hostClasses: {
        'game-menu-visible'({state}) {
            return !!state.activeMenu;
        },
    },
    styles({hostClasses}) {
        return css`
            :host {
                align-items: center;
                backdrop-filter: blur(3px);
                background: rgba(0, 0, 0, 0.4);
                box-sizing: border-box;
                color: white;
                display: none;
                flex-direction: column;
                inset: 0;
                justify-content: center;
                padding: 16px;
                position: fixed;
                z-index: 2;
            }

            ${hostClasses['game-menu-visible'].selector} {
                display: flex;
            }

            .control-hints {
                bottom: 16px;
                display: flex;
                gap: 24px;
                left: 50%;
                position: absolute;
                transform: translateX(-50%);
            }

            .control-hint {
                align-items: center;
                display: flex;
                font-size: 24px;
                gap: 6px;
            }
        `;
    },
    init({host, inputs, updateState}) {
        updateState({
            cleanup: [
                listenToObject(inputs.gameState, 'menuState', (menuState) => {
                    updateState({
                        activeMenu: menuState?.menuHistory.at(-1),
                    });
                    host.requestUpdate();
                }),
                ...(inputs.gameState.saveState
                    ? [
                          listenToObject(inputs.gameState.saveState, 'lastInputDevices', () => {
                              host.requestUpdate();
                          }),
                      ]
                    : []),
            ],
        });
    },
    cleanup({state}) {
        state.cleanup?.forEach((cleanup) => cleanup());
    },
    render({inputs, state}) {
        if (!state.activeMenu) {
            return nothing;
        }

        const menus = {
            [GameMenuKey.MultiplayerRooms]: html`
                <${GameMultiplayerRooms.assign({
                    gameState: inputs.gameState,
                })}></${GameMultiplayerRooms}>
            `,
            [GameMenuKey.Options]: html`
                <${GameOptionsMenu.assign({
                    gameState: inputs.gameState,
                })}></${GameOptionsMenu}>
            `,
            [GameMenuKey.Pause]: html`
                <${GamePauseMenu.assign({
                    gameState: inputs.gameState,
                })}></${GamePauseMenu}>
            `,
            [GameMenuKey.ProfileSelect]: html`
                <${GameProfileSelect.assign({
                    gameState: inputs.gameState,
                })}></${GameProfileSelect}>
            `,
        } satisfies Record<GameMenuKey, ReturnType<typeof html>>;

        return html`
            ${menus[state.activeMenu]} ${renderControlHints(inputs.gameState)}
        `;
    },
});
