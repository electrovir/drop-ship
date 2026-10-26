import {
    defaultMultiplayerApiOrigin,
    type MultiplayerConnectionTimeoutOptions,
} from '@antha/multiplayer-core';
import {LocalPlayerPosition} from '@antha/util';
import {
    ensureErrorAndPrependMessage,
    getEnumValues,
    randomString,
    selectFrom,
} from '@augment-vir/common';
import {buildUrl} from 'url-vir';
import {createNewPilotProgress} from '../player/pilot-progress.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {DeployEnv, deployEnv} from './deploy-env.js';
import {type FullGameState} from './game-state.js';
import {MultiplayerPacketType, type MultiplayerPacket} from './multiplayer-packet.js';

const multiplayerBackendOriginByDeployEnv: Readonly<Record<DeployEnv, string>> = {
    [DeployEnv.Dev]: buildUrl(defaultMultiplayerApiOrigin, {
        hostname: globalThis.location.hostname,
    }).origin,
    [DeployEnv.Prod]: 'https://backend.mp.electrovir.com',
};

/** Keeps a failing multiplayer connection from spinning forever. */
export const multiplayerConnectionTimeoutOptions: MultiplayerConnectionTimeoutOptions = {
    timeout: {
        seconds: 30,
    },
};

/** The saved profile a local player picked, if they've picked one that still exists. */
export function findLocalProfile({
    playerPosition,
    state,
}: Readonly<{
    playerPosition: LocalPlayerPosition;
    state: Partial<Pick<FullGameState, 'localProfileIds' | 'saveState'>>;
}>) {
    const profileId = state.localProfileIds?.[playerPosition];

    return profileId
        ? state.saveState?.profiles.find((profile) => profile.id === profileId)
        : undefined;
}

/**
 * Spawn packets for every local player that has picked a profile. Only a single player game starts
 * pilots with their saved ships. Everywhere else they start with a starter ship.
 */
export function createLocalSpawnPackets({
    isUsingSavedShips,
    state,
}: Readonly<{
    isUsingSavedShips?: boolean | undefined;
    state: Partial<Pick<FullGameState, 'localProfileIds' | 'saveState'>>;
}>) {
    return getEnumValues(LocalPlayerPosition).flatMap((playerPosition) => {
        const profile = findLocalProfile({
            playerPosition,
            state,
        });

        return profile
            ? [
                  {
                      grid: isUsingSavedShips ? profile.progress.shipGrid : createStarterShipGrid(),
                      playerPosition,
                      profile: selectFrom(profile, {
                          color: true,
                          name: true,
                      }),
                      type: MultiplayerPacketType.SpawnPlayer,
                  } satisfies MultiplayerPacket,
              ]
            : [];
    });
}

/** Resumes player one's saved run, or starts a fresh run when player one has no pilot yet. */
export function createStartRunPacket(
    state: Partial<Pick<FullGameState, 'localProfileIds' | 'saveState'>>,
) {
    return {
        progress: (
            findLocalProfile({
                playerPosition: LocalPlayerPosition.One,
                state,
            })?.progress || createNewPilotProgress()
        ).run,
        runSeed: randomString(),
        type: MultiplayerPacketType.StartRun,
    } satisfies MultiplayerPacket;
}

/** Starts or resumes a local run with every local player that has picked a profile. */
export function startLocalGame(state: Partial<FullGameState>) {
    const multiplayerController = getMultiplayerController(state);

    if (multiplayerController.isConnected()) {
        multiplayerController.leaveRoom();
    }

    state.entityStore?.destroyAllEntities();
    multiplayerController.startSingleplayer();

    state.menuState = undefined;
    state.pausingPlayerIds = [];
    state.pauseRequest = undefined;
    multiplayerController.act([
        ...createLocalSpawnPackets({
            isUsingSavedShips: true,
            state,
        }),
        createStartRunPacket(state),
    ]);
}

/** Queues this client's local players for the multiplayer session. */
export function startMultiplayerGame(state: Partial<FullGameState>) {
    const spawnPackets = createLocalSpawnPackets({
        state,
    });

    if (spawnPackets.length) {
        getMultiplayerController(state).act(spawnPackets);
    }
}

/** Converts an unknown multiplayer failure into an Error with a concise UI-facing prefix. */
export function createMultiplayerError(error: unknown) {
    return ensureErrorAndPrependMessage(error, 'Multiplayer failed.');
}

function getMultiplayerController(state: Partial<FullGameState>) {
    if (!state.multiplayerP2pLockStep) {
        throw new Error('Cannot manage multiplayer: multiplayer mod is missing.');
    }

    return state.multiplayerP2pLockStep.multiplayerController;
}

/** Initializes multiplayer API access and returns the active game controller. */
export async function initializeMultiplayer(state: Partial<FullGameState>) {
    const multiplayerController = getMultiplayerController(state);

    if (!multiplayerController.multiplayerApiClient) {
        await multiplayerController.initMultiplayer({
            backendOrigin: multiplayerBackendOriginByDeployEnv[deployEnv],
            portScanOptions: false,
            stunServerUrls: [
                'stun.cloudflare.com:3478',
            ],
            roomUpdateInterval: {
                seconds: 1,
            },
            ...multiplayerConnectionTimeoutOptions,
        });
    }

    return multiplayerController;
}
