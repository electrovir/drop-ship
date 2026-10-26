import {createMultiplayerPlayerId, type ClientId} from '@antha/multiplayer-core';
import {isMultiplayerRoomConnected} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {check} from '@augment-vir/assert';
import {getObjectTypedEntries} from '@augment-vir/common';
import {type FullGameState} from '../game-state/game-state.js';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity, type RunEntity} from '../run/run.entity.js';
import {findShip} from '../ship/ship.entity.js';
import {type PilotProgress} from './pilot-progress.js';

function createSavedProgress({
    localClientId,
    playerPosition,
    progress,
    run,
}: Readonly<{
    localClientId: ClientId;
    playerPosition: LocalPlayerPosition;
    progress: Readonly<PilotProgress>;
    run: RunEntity;
}>): PilotProgress {
    const ship = findShip({
        entityStore: run.entityStore,
        playerId: createMultiplayerPlayerId({
            clientId: localClientId,
            playerPosition,
        }),
    });

    return {
        run:
            playerPosition === LocalPlayerPosition.One
                ? {
                      earnedPieces: [
                          ...run.params.earnedPieces,
                      ],
                      galaxySeed: run.params.galaxySeed,
                      partProgress: [
                          ...run.params.partProgress,
                      ],
                      systemsCleared: run.params.waveIndex,
                      visitedStarIndexes: [
                          ...run.params.visitedStarIndexes,
                      ],
                  }
                : progress.run,
        shipGrid: ship
            ? {
                  cells: [
                      ...ship.params.grid.cells,
                  ],
              }
            : progress.shipGrid,
    };
}

/**
 * Whether {@link savePilotProgress} saves during each phase. Leaving a run in any other phase loses
 * progress.
 */
export const isProgressSavedInPhase: Readonly<Record<RunPhase, boolean>> = {
    [RunPhase.Build]: false,
    [RunPhase.Fly]: false,
    [RunPhase.GalaxyMap]: true,
    [RunPhase.Jump]: false,
    [RunPhase.ToFly]: false,
    [RunPhase.Wrecked]: false,
    [RunPhase.Reward]: false,
    [RunPhase.Depart]: false,
};

/**
 * Saves each local pilot's progress whenever the galaxy map is open, so quitting mid-level loses
 * only that level. The run belongs to player one's pilot. Other local pilots only keep their ship.
 * Multiplayer runs aren't saved because they belong to the whole room.
 */
export function savePilotProgress({
    localClientId,
    state,
}: Readonly<{
    localClientId: ClientId;
    state: Partial<FullGameState>;
}>) {
    const run = state.entityStore && findRunEntity(state.entityStore);

    if (
        !run ||
        !state.saveState ||
        isMultiplayerRoomConnected(state) ||
        !isProgressSavedInPhase[run.params.phase]
    ) {
        return;
    }

    const savedProgressById = getObjectTypedEntries(state.localProfileIds || {}).flatMap(
        ([
            playerPosition,
            profileId,
        ]) => {
            const profile = state.saveState?.profiles.find(({id}) => id === profileId);

            if (!profile) {
                return [];
            }

            const progress = createSavedProgress({
                localClientId,
                playerPosition,
                progress: profile.progress,
                run,
            });

            return check.jsonEquals(progress, profile.progress)
                ? []
                : [
                      {
                          profileId: profile.id,
                          progress,
                      },
                  ];
        },
    );

    if (savedProgressById.length) {
        state.saveState.profiles = state.saveState.profiles.map((profile) => {
            const saved = savedProgressById.find(({profileId}) => profileId === profile.id);

            return saved
                ? {
                      ...profile,
                      progress: saved.progress,
                  }
                : profile;
        });
    }
}
