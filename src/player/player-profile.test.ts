import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {createPlayerProfile, isDefaultPlayerProfileName} from './player-profile.js';

describe(isDefaultPlayerProfileName.name, () => {
    it('matches the names given to new profiles', () => {
        assert.isTrue(isDefaultPlayerProfileName(createPlayerProfile([]).name));
    });

    it('does not match a renamed profile', () => {
        assert.isFalse(isDefaultPlayerProfileName('Pilot 1derp'));
    });
});
