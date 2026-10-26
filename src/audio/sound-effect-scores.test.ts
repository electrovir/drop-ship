// cspell:word unclipped
import {assert} from '@augment-vir/assert';
import {getEnumValues} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {soundEffectScores} from './sound-effect-scores.js';
import {SoundEffect} from './sound-effect.js';
import {renderScore} from './synth/synth-score.js';

describe('soundEffectScores', () => {
    it('renders every effect to audible, unclipped audio', () => {
        const badEffects = getEnumValues(SoundEffect).filter((effect) => {
            const [
                left,
                right,
            ] = renderScore({
                sampleRate: 22_050,
                score: soundEffectScores[effect](0),
            }).channels;
            const peak = [
                ...left,
                ...right,
            ].reduce((max, sample) => Math.max(max, Math.abs(sample)), 0);

            return !(peak > 0.05 && peak <= 1);
        });

        assert.isEmpty(badEffects);
    });
});
