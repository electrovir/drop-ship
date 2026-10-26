import {AssetLoader} from '@antha/asset';
import {AnthaEngine} from '@antha/engine';
import {EntityStore2d} from '@antha/entity-2d';
import {createMockPixi} from '@antha/graphics-2d';
import {InputDeviceHandler} from '@antha/input';
import {emptyApiAndRoomConnectionState} from '@antha/multiplayer-core';
import {P2pLockStepMultiplayerController} from '@antha/multiplayer-p2p-lock-step';
import {LocalPlayerPosition} from '@antha/util';
import {assert, assertWrap} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {PlayerColor} from '../player/player-profile.js';
import {createStarterShipGrid} from '../ship/ship-grid.js';
import {GameMenuKey, type FullGameState} from './game-state.js';
import {gameUpdateMod} from './game-update.mod.js';
import {
    multiplayerPacketHandlers,
    MultiplayerPacketType,
    type MultiplayerPacket,
} from './multiplayer-packet.js';
import {createDefaultGameSaveState} from './save-data.js';

function createMenuNavigationSimulation() {
    const controller = new P2pLockStepMultiplayerController<MultiplayerPacket>({
        gameId: 'game-update-test',
    });
    controller.startSingleplayer();
    const engine = new AnthaEngine<FullGameState>({
        hostElement: document.createElement('div'),
        initState: {
            localProfileIds: {},
            menuState: undefined,
            multiplayerP2pLockStep: {
                connectionState: emptyApiAndRoomConnectionState,
                multiplayerController: controller,
            },
        },
        mods: [
            gameUpdateMod,
        ],
    });
    const entityStore = new EntityStore2d({
        assetLoader: new AssetLoader(),
        pixi: createMockPixi(),
        state: engine.state,
    });

    engine.state.entityStore = entityStore;

    return {
        engine,
        localClientId: assertWrap.isDefined(controller.getClientId()),
        async destroy() {
            controller.destroy();
            entityStore.destroy();
            await engine.reset();
        },
    };
}

describe(gameUpdateMod.modName, () => {
    it('syncs the saved joystick dead zone to the input device handler', async () => {
        const deviceHandler = new InputDeviceHandler({
            globalDeadZone: 0.2,
            startLoopImmediately: false,
        });
        const engine = new AnthaEngine<FullGameState>({
            hostElement: document.createElement('div'),
            initState: {
                deviceHandler,
                saveState: {
                    ...createDefaultGameSaveState(),
                    joystickDeadZone: 0.6,
                },
            },
            mods: [
                gameUpdateMod,
            ],
        });

        try {
            await engine.runSingleTick();

            assert.strictEquals(deviceHandler.globalDeadZone, 0.6);
        } finally {
            await engine.reset();
        }
    });

    it('only lets player one and joined local players use menus', async () => {
        const simulation = createMenuNavigationSimulation();

        try {
            await multiplayerPacketHandlers[MultiplayerPacketType.SpawnPlayer]({
                detail: {
                    packet: {
                        grid: createStarterShipGrid(),
                        playerPosition: LocalPlayerPosition.Two,
                        profile: {
                            color: PlayerColor.Pink,
                            name: 'Second pilot',
                        },
                        type: MultiplayerPacketType.SpawnPlayer,
                    },
                    sourceClientId: simulation.localClientId,
                },
                state: simulation.engine.state,
            });

            await simulation.engine.runSingleTick();

            assert.deepEquals(simulation.engine.state.allowedPlayerMenuNavigation, {
                [LocalPlayerPosition.One]: true,
                [LocalPlayerPosition.Two]: true,
                [LocalPlayerPosition.Three]: false,
                [LocalPlayerPosition.Four]: false,
            });
        } finally {
            await simulation.destroy();
        }
    });

    it('only lets the selecting player use the profile menu', async () => {
        const simulation = createMenuNavigationSimulation();

        try {
            simulation.engine.state.menuState = {
                menuHistory: [
                    GameMenuKey.ProfileSelect,
                ],
                openedBy: undefined,
            };

            await simulation.engine.runSingleTick();

            assert.deepEquals(simulation.engine.state.allowedPlayerMenuNavigation, {
                [LocalPlayerPosition.One]: true,
                [LocalPlayerPosition.Two]: false,
                [LocalPlayerPosition.Three]: false,
                [LocalPlayerPosition.Four]: false,
            });
        } finally {
            await simulation.destroy();
        }
    });
});
