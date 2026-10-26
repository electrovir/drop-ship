import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {Waveform} from '../synth/synth-patch.js';
import {type SynthScore} from '../synth/synth-score.js';
import {playScoreGraphs} from './play-score-graphs.js';

const sampleRate = 22_050;

const sineScore: SynthScore = {
    durationSeconds: 1,
    isLooped: true,
    tracks: [
        {
            notes: [
                {
                    durationSeconds: 1,
                    midi: 69,
                    startSeconds: 0,
                },
            ],
            patch: {
                amp: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 1,
                    release: 0.01,
                },
                layers: [
                    {
                        oscillators: [
                            {
                                wave: Waveform.Sine,
                            },
                        ],
                    },
                ],
            },
        },
    ],
};

async function renderPlayback({isStopped}: Readonly<{isStopped: boolean}>) {
    const context = new OfflineAudioContext({
        length: sampleRate / 2,
        numberOfChannels: 2,
        sampleRate,
    });
    const silencedGain = context.createGain();

    silencedGain.gain.value = 0;
    silencedGain.connect(context.destination);

    const stop = await playScoreGraphs({
        /** Elementary's types only allow a live context, but it renders offline too. */
        context: context satisfies BaseAudioContext as unknown as AudioContext,
        outputs: [
            {
                destination: silencedGain,
                score: sineScore,
            },
            {
                destination: context.destination,
                score: sineScore,
            },
        ],
    });

    if (isStopped) {
        await stop();
    }

    const rendered = await context.startRendering();

    return rendered.getChannelData(1).reduce((peak, sample) => Math.max(peak, Math.abs(sample)), 0);
}

describe(playScoreGraphs.name, () => {
    it('plays each score into its own destination until stopped', async () => {
        assert.deepEquals(
            [
                await renderPlayback({
                    isStopped: false,
                }),
                await renderPlayback({
                    isStopped: true,
                }),
            ].map((peak) => Math.round(peak * 100) / 100),
            [
                0.89,
                0,
            ],
        );
    });

    it('stops on a closed context', async () => {
        const context = new AudioContext();
        const stop = await playScoreGraphs({
            context,
            outputs: [
                {
                    destination: context.destination,
                    score: sineScore,
                },
            ],
        });

        await context.close();

        assert.strictEquals(
            await Promise.race([
                stop().then(() => 'stopped'),
                wait({
                    seconds: 2,
                }).then(() => 'hung'),
            ]),
            'stopped',
        );
    });
});
