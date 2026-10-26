import {createAnthaAssetMod, createAnthaBootstrapMod} from '@antha/asset';
import {AnthaEngine, AnthaUi} from '@antha/engine';
import {type EmptyFunction} from '@augment-vir/common';
import {css, defineElement, defineElementEvent, html, listen, nothing} from 'element-vir';
import {VirDebugParts} from '../debug/vir-debug-parts.element.js';
import {deployEnv, DeployEnv} from '../game-state/deploy-env.js';
import {type FullGameState} from '../game-state/game-state.js';
import {gameWorldSize} from '../game-state/game-world.js';

/** An element that wraps the game engine and its render target. */
export const VirGame = defineElement()({
    tagName: 'vir-game',
    events: {
        loadingScreenRendered: defineElementEvent<void>(),
    },
    styles: css`
        :host {
            background: black;
            display: block;
            height: 100%;
            overflow: hidden;
            position: relative;
            width: 100%;
        }

        ${AnthaUi} {
            display: block;
            height: 100%;
            padding: 0;
            position: relative;
            width: 100%;
        }

        .debug-buttons {
            bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            left: 8px;
            position: absolute;
            z-index: 10;
        }

        ${VirDebugParts} {
            inset: 0;
            position: absolute;
            z-index: 9;
        }
    `,
    state() {
        return {
            engine: new AnthaEngine<FullGameState>({
                mods: [
                    createAnthaAssetMod({
                        loadingScreenFadeMs: 500,
                        virtualHeight: gameWorldSize.height,
                        virtualWidth: gameWorldSize.width,
                    }),
                    createAnthaBootstrapMod<FullGameState>()({
                        assetName: 'Game code',
                        async loadModule() {
                            return await import('../game-state/load-game.js');
                        },
                        bootstrap({assetLoader, engine, loadSession, module, state}) {
                            return module.bootstrapGame({
                                assetLoader,
                                engine,
                                loadSession,
                                state,
                            });
                        },
                    }),
                ],
            }),
            cleanup: undefined as undefined | EmptyFunction,
            isDebugViewOpen: false,
        };
    },
    init({dispatch, events, state, updateState}) {
        const removeEngineObservableListener = state.engine.observable.listen(false, () => {
            removeEngineObservableListener();
            dispatch(
                new events.loadingScreenRendered({
                    detail: undefined,
                }),
            );
        });

        updateState({
            cleanup: removeEngineObservableListener,
        });
    },
    cleanup({state}) {
        state.cleanup?.();
    },
    render({state, updateState}) {
        return html`
            <${AnthaUi.assign({
                engine: state.engine,
            })}></${AnthaUi}>
            ${deployEnv === DeployEnv.Dev && state.isDebugViewOpen
                ? html`
                      <${VirDebugParts}></${VirDebugParts}>
                  `
                : nothing}
            ${deployEnv === DeployEnv.Dev
                ? html`
                      <div class="debug-buttons">
                          <button
                              ${listen('click', () => {
                                  updateState({
                                      isDebugViewOpen: !state.isDebugViewOpen,
                                  });
                              })}
                          >
                              Debug
                          </button>
                          <button
                              ${listen('click', async () => {
                                  /**
                                   * Imported here so the save code stays out of the loading
                                   * screen's bundle.
                                   */
                                  const {createDefaultGameSaveState, persistSaveState} =
                                      await import('../game-state/save-data.js');
                                  const saveState = createDefaultGameSaveState();

                                  /**
                                   * The autosave that runs before the reload then saves the reset
                                   * state instead of the old one.
                                   */
                                  state.engine.state.saveState = saveState;
                                  await persistSaveState({
                                      engine: state.engine,
                                      saveState,
                                  });
                                  globalThis.location.reload();
                              })}
                          >
                              Reset all state
                          </button>
                      </div>
                  `
                : nothing}
        `;
    },
});
