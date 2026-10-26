// cspell:word lufs
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {measureLoudness} from './synth-master.js';
import {Waveform} from './synth-patch.js';
import {renderScore, type SynthTrack} from './synth-score.js';

const sampleRate = 22_050;

const sineTrack: SynthTrack = {
    notes: [
        {
            durationSeconds: 1,
            midi: 57,
            startSeconds: 0,
        },
    ],
    patch: {
        amp: {
            attack: 0.01,
            decay: 0.1,
            sustain: 1,
            release: 0.05,
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
};

describe(renderScore.name, () => {
    it('renders a looped score to exactly its duration', () => {
        const audio = renderScore({
            sampleRate,
            score: {
                durationSeconds: 2,
                isLooped: true,
                tracks: [
                    sineTrack,
                ],
            },
        });

        assert.isLengthExactly(audio.channels[0], 2 * sampleRate);
    });

    it('mixes each track without a bus exactly once', () => {
        const [
            looseTracks,
            busTracks,
        ] = [
            undefined,
            'shared',
        ].map((bus) => {
            return renderScore({
                sampleRate,
                score: {
                    durationSeconds: 2,
                    isLooped: true,
                    tracks: [
                        sineTrack,
                        sineTrack,
                    ].map((track) => {
                        return {
                            ...track,
                            bus,
                        };
                    }),
                },
            }).channels[0];
        });

        assert.deepEquals(looseTracks, busTracks);
    });

    it('trims a one shot once its tail is silent and hits the target loudness', () => {
        const audio = renderScore({
            sampleRate,
            score: {
                durationSeconds: 0,
                isLooped: false,
                master: {
                    targetLufs: -20,
                },
                tracks: [
                    sineTrack,
                ],
            },
        });
        const [
            left,
            right,
        ] = audio.channels;

        assert.isBelow(left.length, 2 * sampleRate);
        assert.isApproximately(
            measureLoudness({
                buffer: {
                    left,
                    right,
                },
                sampleRate,
            }),
            -20,
            0.5,
        );
    });
});
