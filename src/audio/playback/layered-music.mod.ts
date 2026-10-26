// cspell:word crossfades lowpasses
import {type AnthaAudioState, type AudioPlayer} from '@antha/audio';
import {defineAnthaMod} from '@antha/engine';
import {arrayToObject, getOrSet, log, type AnyObject} from '@augment-vir/common';

/** What the music should be doing right now. */
export type MusicMix<Layer extends string> = Readonly<{
    /** `undefined` fades every layer out. */
    layer: Layer | undefined;
    /** Lowpasses and ducks the music, for pause menus and game over screens. */
    isMuffled: boolean;
}>;

const muffleTimeConstant = 0.12;

/**
 * Plays every layer of a song in sync and crossfades to whichever layer `selectMix` picks, with
 * each crossfade starting on the next `quantizeSeconds` boundary (a bar, usually) so the switch
 * lands on the beat.
 *
 * Unlike `AudioPlayer.play`, which can only play a file from its start, this needs every layer
 * playing in sync and scheduled gain ramps, so `startLayers` plays straight onto the player's own
 * context, routed through `audioChannel`'s gain node to keep channel volumes working.
 *
 * Every layer starts once per `AudioPlayer`.
 */
export function createLayeredMusicMod<const Layer extends string, State extends AnyObject>({
    audioChannel,
    fadeSeconds,
    layers,
    quantizeSeconds,
    startLayers,
    selectMix,
}: Readonly<{
    audioChannel: string;
    layers: ReadonlyArray<Layer>;
    /**
     * Starts every layer playing, in sync, each into its own destination. Resolves once they're
     * playing, to a function that stops them.
     */
    startLayers: (
        params: Readonly<{
            context: AudioContext;
            destinations: Readonly<Record<Layer, AudioNode>>;
        }>,
    ) => Promise<() => Promise<void>>;
    selectMix: (state: Partial<State & AnthaAudioState>) => MusicMix<Layer>;
    quantizeSeconds: number;
    fadeSeconds: number;
}>) {
    const runtime: {
        audioPlayer: AudioPlayer | undefined;
        graph:
            | {
                  filter: BiquadFilterNode;
                  bus: GainNode;
              }
            | undefined;
        /** Context time at which every layer's loop began, once they're playing. */
        startTime: number | undefined;
        gains: Readonly<Record<Layer, GainNode>> | undefined;
        mix: MusicMix<Layer> | undefined;
        /** Resolves to a function that stops the layers. */
        starting: Promise<(() => Promise<void>) | undefined> | undefined;
    } = {
        audioPlayer: undefined,
        gains: undefined,
        graph: undefined,
        mix: undefined,
        startTime: undefined,
        starting: undefined,
    };

    async function teardown() {
        const starting = runtime.starting;

        layers.forEach((layer) => {
            runtime.gains?.[layer].disconnect();
        });
        runtime.graph?.filter.disconnect();
        runtime.graph?.bus.disconnect();
        runtime.audioPlayer = undefined;
        runtime.gains = undefined;
        runtime.graph = undefined;
        runtime.mix = undefined;
        runtime.startTime = undefined;
        runtime.starting = undefined;

        const stop = await starting;

        await stop?.();
    }

    async function startPlaying({
        context,
        destinations,
    }: Readonly<{
        context: AudioContext;
        destinations: Readonly<Record<Layer, AudioNode>>;
    }>) {
        try {
            const stop = await startLayers({
                context,
                destinations,
            });

            /** A teardown while starting leaves this start time belonging to nothing. */
            if (runtime.gains === destinations) {
                runtime.startTime = context.currentTime;
            }

            return stop;
        } catch (error) {
            log.error(error);
            return undefined;
        }
    }

    function setup(audioPlayer: AudioPlayer) {
        const context = audioPlayer.audioContext;
        const filter = context.createBiquadFilter();
        const bus = context.createGain();
        /** The same lazily created channel node `AudioPlayer.play` uses, which is protected. */
        const channelNode = getOrSet(audioPlayer.audioChannelNodes, audioChannel, () => {
            const node = context.createGain();

            node.connect(audioPlayer.outputNode);

            return node;
        });

        filter.type = 'lowpass';
        filter.frequency.value = context.sampleRate / 2;
        filter.connect(bus).connect(channelNode);
        runtime.audioPlayer = audioPlayer;
        runtime.graph = {
            bus,
            filter,
        };

        const gains = arrayToObject(
            layers,
            (layer) => {
                const gain = context.createGain();

                gain.gain.value = 0;
                gain.connect(filter);

                return {
                    key: layer,
                    value: gain,
                };
            },
            {
                useRequired: true,
            },
        );

        runtime.gains = gains;
        runtime.starting = startPlaying({
            context,
            destinations: gains,
        });
    }

    function applyMix({
        audioPlayer,
        mix,
    }: Readonly<{audioPlayer: AudioPlayer; mix: MusicMix<Layer>}>) {
        const previousMix = runtime.mix;
        const graph = runtime.graph;

        if (
            !graph ||
            (previousMix?.layer === mix.layer && previousMix?.isMuffled === mix.isMuffled)
        ) {
            return;
        }

        const now = audioPlayer.audioContext.currentTime;

        runtime.mix = mix;

        if (previousMix?.layer !== mix.layer) {
            const fadeStart =
                runtime.startTime == undefined
                    ? now
                    : runtime.startTime +
                      Math.ceil(Math.max(0, now - runtime.startTime) / quantizeSeconds) *
                          quantizeSeconds;

            layers.forEach((layer) => {
                const layerGain = runtime.gains?.[layer].gain;

                if (!layerGain) {
                    return;
                }

                /** Read before cancelling, which drops any ramp in progress. */
                const currentGain = layerGain.value;
                const targetGain = layer === mix.layer ? 1 : 0;

                layerGain.cancelScheduledValues(now);

                if (previousMix) {
                    layerGain.setValueAtTime(currentGain, now);
                    layerGain.setValueAtTime(currentGain, fadeStart);
                    layerGain.linearRampToValueAtTime(targetGain, fadeStart + fadeSeconds);
                } else {
                    layerGain.setValueAtTime(targetGain, now);
                }
            });
        }

        if (previousMix?.isMuffled !== mix.isMuffled) {
            graph.filter.frequency.setTargetAtTime(
                mix.isMuffled ? 700 : audioPlayer.audioContext.sampleRate / 2,
                now,
                muffleTimeConstant,
            );
            graph.bus.gain.setTargetAtTime(mix.isMuffled ? 0.6 : 1, now, muffleTimeConstant);
        }
    }

    return defineAnthaMod<State & AnthaAudioState>({
        modName: 'layered-music',
        async cleanup() {
            await teardown();
        },
        async execute({state}) {
            const audioPlayer = state.audioPlayer;

            if (runtime.audioPlayer !== audioPlayer) {
                await teardown();
            }

            if (!audioPlayer || audioPlayer.isDestroyed) {
                return;
            } else if (!runtime.audioPlayer) {
                setup(audioPlayer);
            }

            applyMix({
                audioPlayer,
                mix: selectMix(state),
            });
        },
    });
}
