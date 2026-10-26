import {createArray} from '@augment-vir/common';
import WebRenderer from '@elemaudio/web-renderer';
import {type SynthScore} from '../synth/synth-score.js';
import {buildScoreGraph} from './score-graph.js';

/**
 * Plays every score on repeat, live, each into its own destination, all starting together from
 * their beginnings. Resolves once they're playing, to a function that stops them.
 */
export async function playScoreGraphs({
    context,
    outputs,
}: Readonly<{
    context: AudioContext;
    outputs: ReadonlyArray<
        Readonly<{
            destination: AudioNode;
            score: SynthScore;
        }>
    >;
}>) {
    const renderer = new WebRenderer();
    const channelCount = outputs.length * 2;
    const node = await renderer.initialize(context, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [
            channelCount,
        ],
    });
    const splitter = context.createChannelSplitter(channelCount);
    const mergers = outputs.map(({destination}, index) => {
        const merger = context.createChannelMerger(2);

        splitter.connect(merger, index * 2, 0);
        splitter.connect(merger, index * 2 + 1, 1);
        merger.connect(destination);

        return merger;
    });

    node.connect(splitter);
    await renderer.render(
        ...outputs.flatMap(({score}, index) => {
            return buildScoreGraph({
                name: String(index),
                sampleRate: context.sampleRate,
                score,
            });
        }),
    );

    return async () => {
        [
            node,
            splitter,
            ...mergers,
        ].forEach((audioNode) => {
            audioNode.disconnect();
        });

        /**
         * A disconnected worklet keeps computing its graph until its context closes. Once it's
         * closed there's nothing left to stop, and Chromium never answers a render.
         */
        if (context.state !== 'closed') {
            await renderer.render(...createArray(channelCount, () => 0));
        }
    };
}
