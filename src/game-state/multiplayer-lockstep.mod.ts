import {createAnthaMultiplayerP2pLockStepMod} from '@antha/multiplayer-p2p-lock-step';
import {hashObject} from '@antha/util';
import {ensureErrorAndPrependMessage, log} from '@augment-vir/common';
import {assertValidShape} from 'object-shape-tester';
import {isGamePaused, type FullGameState} from './game-state.js';
import {
    createStateSync,
    isPacketAllowedWhilePaused,
    loadStateSync,
    multiplayerPacketHandlers,
    multiplayerPacketShape,
    MultiplayerPacketType,
    type MultiplayerPacket,
    type MultiplayerStateForSync,
} from './multiplayer-packet.js';

/** Applies each synchronized multiplayer frame, then runs entity updates for that frame. */
export const multiplayerLockstepMod = createAnthaMultiplayerP2pLockStepMod<
    MultiplayerPacket,
    FullGameState,
    MultiplayerStateForSync
>({
    gameId: 'drop-ship',
    desyncCheck: {
        interval: {
            seconds: 1,
        },
        createStateHash({state}) {
            if (!state.entityStore || !state.seededRandom) {
                return undefined;
            }

            return hashObject([
                state.entityStore.hashEntities(),
                state.pausingPlayerIds || [],
                state.seededRandom.exportState(),
            ]);
        },
    },
    stateSync: {
        createStateSync({state}) {
            return createStateSync(state);
        },
        loadStateSync,
        resyncOnDesync: true,
    },
    async handlePacket({packet, state}) {
        try {
            assertValidShape(packet.packet, multiplayerPacketShape);

            if (isGamePaused(state) && !isPacketAllowedWhilePaused[packet.packet.type]) {
                return;
            }

            await multiplayerPacketHandlers[packet.packet.type]({
                detail: packet,
                state,
            });
        } catch (error) {
            log.error(
                ensureErrorAndPrependMessage(
                    error,
                    `Failed to handle '${packet.packet.type}' multiplayer packet.`,
                ),
            );
        }
    },
    handleClientStatus({event, multiplayerController}) {
        if (multiplayerController.isHost() && 'lostMember' in event.detail) {
            multiplayerController.act({
                clientId: event.detail.lostMember,
                type: MultiplayerPacketType.DespawnPlayers,
            });
        }
    },
    async runFrameUpdate(frameUpdateParams) {
        if (isGamePaused(frameUpdateParams.state)) {
            return;
        }

        await frameUpdateParams.state.entityStore?.updateAllEntities(frameUpdateParams);
    },
});
