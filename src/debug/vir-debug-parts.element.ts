import {type EmptyFunction} from '@augment-vir/common';
import {css, defineElement, html, onDomCreated} from 'element-vir';

/** A local debug overlay showing every part with its stats, guns firing like they do in game. */
export const VirDebugParts = defineElement()({
    tagName: 'vir-debug-parts',
    styles: css`
        :host {
            align-items: center;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
        }

        .canvas-parent {
            display: flex;

            & canvas {
                max-height: 100%;
                max-width: 100%;
            }
        }
    `,
    state() {
        return {
            destroyScene: undefined as undefined | EmptyFunction,
            isDestroyed: false,
        };
    },
    cleanup({state, updateState}) {
        state.destroyScene?.();
        updateState({
            isDestroyed: true,
        });
    },
    render({state, updateState}) {
        return html`
            <div
                class="canvas-parent"
                ${onDomCreated(async (element) => {
                    /** Imported here so the debug scene stays out of the main bundle. */
                    const {createDebugPartsScene} = await import('./debug-parts-scene.js');
                    const destroyScene = await createDebugPartsScene(element);

                    /** The overlay can close while the scene is still starting up. */
                    if (state.isDestroyed) {
                        destroyScene();
                    } else {
                        updateState({
                            destroyScene,
                        });
                    }
                })}
            ></div>
        `;
    },
});
