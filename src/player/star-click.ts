import {extractMultiplayerPlayerIdParts} from '@antha/multiplayer-core';
import {type Coords} from '@augment-vir/common';
import {findConnectedStarNear} from '../galaxy/galaxy.js';
import {type FullGameState} from '../game-state/game-state.js';
import {MultiplayerPacketType} from '../game-state/multiplayer-packet.js';
import {RunPhase} from '../run/run-phase.js';
import {type RunEntity} from '../run/run.entity.js';
import {type ShipEntity} from '../ship/ship.entity.js';

/**
 * Travels to a connected star the mouse clicked on. The mouse has no player of its own, so the
 * click is sent as the first local player.
 */
export function sendStarClicks({
    clickedPositions,
    localShips,
    run,
    state,
}: Readonly<{
    /** Galaxy space positions. */
    clickedPositions: ReadonlyArray<Readonly<Coords>>;
    localShips: ReadonlyArray<Readonly<ShipEntity>>;
    run: Readonly<RunEntity>;
    state: Partial<Pick<FullGameState, 'menuState' | 'multiplayerP2pLockStep'>>;
}>) {
    const firstLocalShip = localShips[0];
    const starIndex = clickedPositions
        .map((position) => {
            return findConnectedStarNear({
                currentStarIndex: run.params.currentStarIndex,
                galaxy: run.getGalaxy(),
                position,
            });
        })
        .findLast((clickedStarIndex) => clickedStarIndex != undefined);

    if (
        starIndex == undefined ||
        !firstLocalShip ||
        state.menuState ||
        run.params.phase !== RunPhase.GalaxyMap
    ) {
        return;
    }

    const playerPosition = extractMultiplayerPlayerIdParts({
        playerId: firstLocalShip.params.playerId,
    }).playerPosition;

    state.multiplayerP2pLockStep?.multiplayerController.act([
        {
            playerPosition,
            starIndex,
            type: MultiplayerPacketType.StarSelect,
        },
        {
            playerPosition,
            type: MultiplayerPacketType.StarTravel,
        },
    ]);
}
