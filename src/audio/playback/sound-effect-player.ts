import {Codec, type AudioPlayer} from '@antha/audio';
import {createArray, getObjectTypedKeys, log, type PartialWithUndefined} from '@augment-vir/common';
import {createGeneratedAudioUrl, createSoundEffectKey} from './generated-audio-url.js';

export type SoundEffectConfig = Readonly<
    PartialWithUndefined<{
        /** How many renders of the effect exist. They play in turn. Defaults to `1`. */
        variantCount: number;
        /** Plays of the effect closer together than this are dropped. */
        minIntervalMs: number;
    }>
>;

function createSoundEffectFile({effect, variant}: Readonly<{effect: string; variant: number}>) {
    return {
        sources: [
            {
                codec: Codec.wav,
                url: createGeneratedAudioUrl(
                    createSoundEffectKey({
                        effect,
                        variant,
                    }),
                ),
            },
        ],
    };
}

/**
 * Plays generated sound effects through an `AudioPlayer`, rotating through each effect's variants
 * and dropping plays that come faster than its `minIntervalMs`.
 *
 * Play only from code that runs once per real event. In a lockstep or rollback game, that means
 * sounds are local side effects: they must never feed back into simulated state.
 */
export function createSoundEffectPlayer<const Effect extends string>({
    audioChannel,
    effects,
}: Readonly<{
    audioChannel: string;
    effects: Readonly<Record<Effect, SoundEffectConfig>>;
}>) {
    type PlayStates = Partial<
        Record<
            Effect,
            {
                lastPlayedMs: number;
                playCount: number;
            }
        >
    >;

    const playStates = new WeakMap<
        Readonly<Pick<AudioPlayer, 'isDestroyed' | 'play'>>,
        PlayStates
    >();

    return {
        /**
         * Every variant of every effect, for `AudioPlayer.loadFiles` so the first play has no
         * delay.
         */
        getAllFiles() {
            return getObjectTypedKeys(effects).flatMap((effect) => {
                return createArray(effects[effect].variantCount ?? 1, (variant) => {
                    return createSoundEffectFile({
                        effect,
                        variant,
                    });
                });
            });
        },
        /** Does nothing without an `audioPlayer`, so simulations and tests can run silently. */
        play({
            audioPlayer,
            effect,
        }: Readonly<{
            audioPlayer: Readonly<Pick<AudioPlayer, 'isDestroyed' | 'play'>> | undefined;
            effect: Effect;
        }>) {
            if (!audioPlayer || audioPlayer.isDestroyed) {
                return;
            }

            const config = effects[effect];
            const nowMs = performance.now();
            const states: PlayStates = playStates.get(audioPlayer) || {};
            const previous = states[effect];

            if (previous && nowMs - previous.lastPlayedMs < (config.minIntervalMs ?? 0)) {
                return;
            }

            const playCount = previous?.playCount ?? 0;

            playStates.set(audioPlayer, {
                ...states,
                [effect]: {
                    lastPlayedMs: nowMs,
                    playCount: playCount + 1,
                },
            });

            audioPlayer
                .play({
                    ...createSoundEffectFile({
                        effect,
                        variant: playCount % (config.variantCount ?? 1),
                    }),
                    audioChannel,
                })
                .catch((error: unknown) => {
                    log.error(error);
                });
        },
    };
}
