import {defineAnthaMod} from '@antha/engine';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity} from '../run/run.entity.js';
import {InputConsumer, type FullGameState} from './game-state.js';

const phaseInputConsumers: Readonly<Record<RunPhase, InputConsumer>> = {
    [RunPhase.Build]: InputConsumer.Build,
    [RunPhase.Fly]: InputConsumer.Fly,
    [RunPhase.GalaxyMap]: InputConsumer.GalaxyMap,
    [RunPhase.Jump]: InputConsumer.GalaxyMap,
    [RunPhase.ToFly]: InputConsumer.Fly,
    [RunPhase.Wrecked]: InputConsumer.Fly,
    [RunPhase.Reward]: InputConsumer.Fly,
    [RunPhase.Depart]: InputConsumer.Fly,
};

/**
 * Gives each mode its own input consumer so a press that ends one mode doesn't also act in the
 * next. Runs last because raw inputs are tagged with the consumer when they're read at the start of
 * the next frame. The menu mod's own consumer switch only happens on the frame after a menu closes,
 * which is too late.
 */
export const inputConsumerMod = defineAnthaMod<FullGameState>({
    modName: 'input-consumer',
    execute({state}) {
        state.rawInputConsumer = getInputConsumer(state);
    },
});

/** The input consumer for the mode the game is in right now. */
export function getInputConsumer(
    state: Readonly<Partial<Pick<FullGameState, 'entityStore' | 'menuState'>>>,
) {
    const run = state.entityStore && findRunEntity(state.entityStore);

    return state.menuState || !run ? InputConsumer.Menu : phaseInputConsumers[run.params.phase];
}
