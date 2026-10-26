import {type createAnthaAudioMod} from '@antha/audio';
import {type AnthaModsState} from '@antha/engine';
import {
    type AnthaMenuModState,
    type createAnthaInputBindingsMod,
    type createAnthaMenuMod,
    type createAnthaReadRawInputMod,
} from '@antha/input';
import {type MultiplayerPlayerId} from '@antha/multiplayer-core';
import {type createAnthaMultiplayerP2pLockStepMod} from '@antha/multiplayer-p2p-lock-step';
import {type LocalPlayerPosition} from '@antha/util';
import {type SeededRandom} from '@augment-vir/common';
import {type GameBinding} from '../player/player-binding.js';
import {type PlayerProfile} from '../player/player-profile.js';
import {type updateEntitiesMod} from './game-entity.mod.js';
import {type MultiplayerPacket} from './multiplayer-packet.js';
import {type anthaAutosaveMod, type GameSaveState} from './save-data.js';

export enum InputConsumer {
    Build = 'build',
    Fly = 'fly',
    GalaxyMap = 'galaxy-map',
    Menu = 'menu',
}

/** Names the overlays the game can show so menu navigation uses stable state values. */
export enum GameMenuKey {
    MultiplayerRooms = 'multiplayer-rooms',
    Options = 'options',
    Pause = 'pause',
    ProfileSelect = 'profile-select',
}

/** Holds the game-specific data shared by all engine mods. */
export type GameState = {
    /**
     * The saved profile each local player picked. This never leaves this client: peers only get the
     * profile's name and color when the player spawns.
     */
    localProfileIds: Partial<Record<LocalPlayerPosition, PlayerProfile['id']>>;
    /**
     * Every player, on any peer, with a pause or join menu open. This is synchronized like the
     * entities, so every peer pauses and resumes on the same frame.
     */
    pausingPlayerIds: MultiplayerPlayerId[];
    /**
     * The local positions this client last asked to pause, and its positions in `pausingPlayerIds`
     * at the time, so a request isn't sent again on every update while it's in flight.
     */
    pauseRequest:
        | {
              positions: LocalPlayerPosition[];
              syncedPositions: LocalPlayerPosition[];
          }
        | undefined;
    saveState: GameSaveState | undefined;
    seededRandom: SeededRandom;
} & AnthaMenuModState<GameMenuKey>;

/** Derives complete game state from the mods that create and consume its shared properties. */
export type FullGameState = AnthaModsState<
    [
        typeof anthaAutosaveMod,
        ReturnType<typeof createAnthaAudioMod>,
        ReturnType<typeof createAnthaReadRawInputMod>,
        ReturnType<typeof createAnthaInputBindingsMod<GameBinding>>,
        typeof updateEntitiesMod,
        ReturnType<typeof createAnthaMultiplayerP2pLockStepMod<MultiplayerPacket>>,
        ReturnType<typeof createAnthaMenuMod<GameMenuKey, InputConsumer>>,
    ]
>;

/** Whether any player on any peer has paused the game. */
export function isGamePaused(state: Partial<Pick<FullGameState, 'pausingPlayerIds'>>) {
    return !!state.pausingPlayerIds?.length;
}
