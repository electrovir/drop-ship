import {type PartialWithUndefined} from '@augment-vir/common';
import {css, defineElement, html} from 'element-vir';
import {ViraIcon, type ViraIconSvg} from 'vira';

export const controlIconSize = 36;

/** A binding's icons followed by what the binding does. */
export type ControlHint = {
    icons: ReadonlyArray<Readonly<ViraIconSvg>>;
    label: string;
} & PartialWithUndefined<{
    /** Draws attention to the hint, for when it's the only thing left to do. */
    isFlashing: boolean;
}>;

export type ControlHintRow = {
    hints: ReadonlyArray<Readonly<ControlHint>>;
    opacity: number;
    /** Game world position of the row's top center. */
    x: number;
    y: number;
};

/** Lays out rows of control hints over the game, in game world coordinates. */
export const GameControlHints = defineElement<{
    rows: ReadonlyArray<Readonly<ControlHintRow>>;
}>()({
    tagName: 'game-control-hints',
    styles: css`
        :host {
            color: white;
            font-family: sans-serif;
            inset: 0;
            pointer-events: none;
            position: fixed;
            z-index: 1;
        }

        .row {
            display: flex;
            gap: 24px;
            position: absolute;
            transform: translateX(-50%);
            white-space: nowrap;
        }

        .hint {
            align-items: center;
            display: flex;
            font-size: 24px;
            gap: 4px;
            padding: 4px 8px;

            &.flashing {
                animation: flash 1s ease-in-out infinite;
            }
        }

        ${ViraIcon} {
            height: ${controlIconSize}px;
            width: ${controlIconSize}px;
        }

        @keyframes flash {
            50% {
                background-color: #ffd60a;
                color: black;
            }
        }
    `,
    render({inputs}) {
        return inputs.rows.map((row) => {
            return html`
                <div
                    class="row"
                    style=${css`
                        left: ${row.x}px;
                        opacity: ${row.opacity};
                        top: ${row.y}px;
                    `}
                >
                    ${row.hints.map((hint) => {
                        return html`
                            <span class="hint ${hint.isFlashing ? 'flashing' : ''}">
                                ${hint.icons.map((icon) => {
                                    return html`
                                        <${ViraIcon.assign({
                                            fitContainer: true,
                                            icon,
                                        })}></${ViraIcon}>
                                    `;
                                })}
                                ${hint.label}
                            </span>
                        `;
                    })}
                </div>
            `;
        });
    },
});
