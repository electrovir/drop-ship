import {KnownInput} from '@antha/gamepad-type';
import {
    actOnBinding,
    defaultMenuNavOptions,
    getDirectionalInputVector,
    markBindingActed,
    MenuNavBinding,
    type ActiveBinding,
    type ActiveBindings,
} from '@antha/input';
import {extractMultiplayerPlayerIdParts, type ClientId} from '@antha/multiplayer-core';
import {type LocalPlayerPosition} from '@antha/util';
import {getObjectTypedEntries, type Coords} from '@augment-vir/common';
import {pickConnectedStarInDirection, pickConnectedStarToward} from '../galaxy/galaxy.js';
import {isGamePaused, type FullGameState} from '../game-state/game-state.js';
import {getInputConsumer} from '../game-state/input-consumer.mod.js';
import {MultiplayerPacketType, type MultiplayerPacket} from '../game-state/multiplayer-packet.js';
import {RunPhase} from '../run/run-phase.js';
import {findRunEntity, type RunEntity} from '../run/run.entity.js';
import {Direction} from '../ship/ship-cell.js';
import {sanitizeSteering} from '../ship/ship-fly.js';
import {getSortedShips, type ShipEntity} from '../ship/ship.entity.js';
import {PlayerBinding, type GameBinding} from './player-binding.js';

const pieceMoveDirections: Readonly<
    Record<
        | PlayerBinding.PlayerDown
        | PlayerBinding.PlayerLeft
        | PlayerBinding.PlayerRight
        | PlayerBinding.PlayerUp,
        Direction
    >
> = {
    [PlayerBinding.PlayerDown]: Direction.Backward,
    [PlayerBinding.PlayerLeft]: Direction.Left,
    [PlayerBinding.PlayerRight]: Direction.Right,
    [PlayerBinding.PlayerUp]: Direction.Forward,
};

/** Galaxy map directions, in screen space where +y is down. */
const starSelectDirections: Readonly<
    Record<
        | PlayerBinding.PlayerDown
        | PlayerBinding.PlayerLeft
        | PlayerBinding.PlayerRight
        | PlayerBinding.PlayerUp,
        Coords
    >
> = {
    [PlayerBinding.PlayerDown]: {
        x: 0,
        y: 1,
    },
    [PlayerBinding.PlayerLeft]: {
        x: -1,
        y: 0,
    },
    [PlayerBinding.PlayerRight]: {
        x: 1,
        y: 0,
    },
    [PlayerBinding.PlayerUp]: {
        x: 0,
        y: -1,
    },
};

function createPieceButtonPackets(playerPosition: LocalPlayerPosition) {
    return {
        [PlayerBinding.PiecePlace]: {
            playerPosition,
            type: MultiplayerPacketType.PiecePlace,
        },
        [PlayerBinding.PieceRotate]: {
            isClockwise: true,
            playerPosition,
            type: MultiplayerPacketType.PieceRotate,
        },
        [PlayerBinding.PieceRotateCounterclockwise]: {
            isClockwise: false,
            playerPosition,
            type: MultiplayerPacketType.PieceRotate,
        },
        [PlayerBinding.PieceSwap]: {
            playerPosition,
            type: MultiplayerPacketType.PieceSwap,
        },
    } satisfies Readonly<
        Record<
            | PlayerBinding.PiecePlace
            | PlayerBinding.PieceRotate
            | PlayerBinding.PieceRotateCounterclockwise
            | PlayerBinding.PieceSwap,
            MultiplayerPacket
        >
    >;
}

function createBuildPackets({
    activeBindings,
    playerPosition,
    ship,
}: Readonly<{
    activeBindings: ActiveBindings<GameBinding> | undefined;
    playerPosition: LocalPlayerPosition;
    ship: Readonly<ShipEntity>;
}>) {
    if (
        actOnBinding({
            activeBinding: activeBindings?.[PlayerBinding.Launch],
        })
    ) {
        /** Start also opens the pause menu, which reads its binding after this. */
        markBindingActed(activeBindings?.[MenuNavBinding.OpenPauseMenu]);
        markBindingActed(activeBindings?.[MenuNavBinding.CloseAllMenus]);

        return [
            {
                playerPosition,
                type: MultiplayerPacketType.ShipReady,
            } satisfies MultiplayerPacket,
        ];
    } else if (
        /** Without anything to undo, escape is left to open the pause menu. */
        ship.params.build.undoSteps.length &&
        actOnBinding({
            activeBinding: activeBindings?.[PlayerBinding.PieceUndo],
        })
    ) {
        markBindingActed(activeBindings?.[MenuNavBinding.OpenPauseMenu]);

        return [
            {
                playerPosition,
                type: MultiplayerPacketType.PieceUndo,
            } satisfies MultiplayerPacket,
        ];
    } else if (ship.params.build.activePiece) {
        const stickDirection = getStickDirection(activeBindings);

        return [
            ...getObjectTypedEntries(pieceMoveDirections)
                .filter(
                    ([
                        bindingName,
                        direction,
                    ]) => {
                        const activeBinding = activeBindings?.[bindingName];
                        const stickPush = getStickPush(activeBinding);
                        const isStickOnly = !!activeBinding && stickPush === activeBinding.value;

                        if (isStickOnly) {
                            const isHorizontal =
                                direction === Direction.Left || direction === Direction.Right;
                            /**
                             * A stick at an angle pushes two directions at once, and one resting
                             * near its dead zone flickers in and out of being pushed. Either would
                             * move the piece far more than intended.
                             */
                            const isMainStickAxis =
                                !!stickDirection &&
                                Math.abs(stickDirection.x) >= Math.abs(stickDirection.y) ===
                                    isHorizontal;

                            if (stickPush < 0.7 || !isMainStickAxis) {
                                return false;
                            }
                        }

                        return actOnBinding({
                            activeBinding,
                            repeat: isStickOnly
                                ? {
                                      interval: {
                                          milliseconds: 120,
                                      },
                                      threshold: {
                                          milliseconds: 300,
                                      },
                                  }
                                : {
                                      interval: {
                                          milliseconds: 50,
                                      },
                                      threshold: {
                                          milliseconds: 170,
                                      },
                                  },
                        });
                    },
                )
                .map(
                    ([
                        ,
                        direction,
                    ]) => {
                        return {
                            direction,
                            playerPosition,
                            type: MultiplayerPacketType.PieceMove,
                        } satisfies MultiplayerPacket;
                    },
                ),
            ...getObjectTypedEntries(createPieceButtonPackets(playerPosition))
                .filter(([bindingName]) => {
                    return actOnBinding({
                        activeBinding: activeBindings?.[bindingName],
                    });
                })
                .map(
                    ([
                        ,
                        packet,
                    ]) => packet,
                ),
        ];
    } else {
        return [];
    }
}

/**
 * Sends the star to select rather than the pressed direction, so the synchronized state never
 * depends on this client's floating point math.
 */
function createGalaxyMapPackets({
    activeBindings,
    playerPosition,
    run,
}: Readonly<{
    activeBindings: ActiveBindings<GameBinding> | undefined;
    playerPosition: LocalPlayerPosition;
    run: Readonly<RunEntity>;
}>) {
    const stickDirection = getStickDirection(activeBindings);
    const pointedStarIndex =
        stickDirection &&
        pickConnectedStarToward({
            currentStarIndex: run.params.currentStarIndex,
            direction: stickDirection,
            galaxy: run.getGalaxy(),
        });
    const selectPackets = stickDirection
        ? pointedStarIndex == undefined || pointedStarIndex === run.params.selectedStarIndex
            ? []
            : [
                  {
                      playerPosition,
                      starIndex: pointedStarIndex,
                      type: MultiplayerPacketType.StarSelect,
                  } satisfies MultiplayerPacket,
              ]
        : createCycleStarPackets({
              activeBindings,
              playerPosition,
              run,
          });
    const isTraveling = actOnBinding({
        activeBinding: activeBindings?.[PlayerBinding.Travel],
    });

    return [
        ...selectPackets,
        ...(isTraveling
            ? [
                  {
                      playerPosition,
                      type: MultiplayerPacketType.StarTravel,
                  } satisfies MultiplayerPacket,
              ]
            : []),
    ];
}

const stickInputNames: ReadonlyArray<string> = [
    KnownInput.LeftStickX,
    KnownInput.LeftStickY,
    KnownInput.RightStickX,
    KnownInput.RightStickY,
];

/** How far the gamepad sticks alone push a binding, ignoring keys and d-pads. */
function getStickPush(activeBinding: Readonly<ActiveBinding> | undefined) {
    return (activeBinding?.rawInputs || [])
        .filter((rawInput) => stickInputNames.includes(rawInput.mapped.inputName))
        .reduce((total, rawInput) => total + Math.abs(rawInput.inputValue), 0);
}

/** Returns `undefined` while no stick is pushed past its dead zone. */
function getStickDirection(activeBindings: ActiveBindings<GameBinding> | undefined) {
    const direction = {
        x:
            getStickPush(activeBindings?.[PlayerBinding.PlayerRight]) -
            getStickPush(activeBindings?.[PlayerBinding.PlayerLeft]),
        y:
            getStickPush(activeBindings?.[PlayerBinding.PlayerDown]) -
            getStickPush(activeBindings?.[PlayerBinding.PlayerUp]),
    };

    return direction.x || direction.y ? direction : undefined;
}

/** Arrow keys and d-pads cycle through the connected stars rather than pointing at one. */
function createCycleStarPackets({
    activeBindings,
    playerPosition,
    run,
}: Readonly<{
    activeBindings: ActiveBindings<GameBinding> | undefined;
    playerPosition: LocalPlayerPosition;
    run: Readonly<RunEntity>;
}>) {
    return getObjectTypedEntries(starSelectDirections).flatMap(
        ([
            bindingName,
            direction,
        ]) => {
            if (
                !actOnBinding({
                    activeBinding: activeBindings?.[bindingName],
                    repeat: {
                        interval: defaultMenuNavOptions.repeatInterval,
                        threshold: defaultMenuNavOptions.repeatThreshold,
                    },
                })
            ) {
                return [];
            }

            const starIndex = pickConnectedStarInDirection({
                currentStarIndex: run.params.currentStarIndex,
                direction,
                galaxy: run.getGalaxy(),
                selectedStarIndex: run.params.selectedStarIndex,
            });

            return starIndex == undefined
                ? []
                : [
                      {
                          playerPosition,
                          starIndex,
                          type: MultiplayerPacketType.StarSelect,
                      } satisfies MultiplayerPacket,
                  ];
        },
    );
}

/** Only sends steering when it changes, since steering stays until the next steer packet. */
function createSteerPackets({
    activeBindings,
    playerPosition,
    ship,
}: Readonly<{
    activeBindings: ActiveBindings<GameBinding> | undefined;
    playerPosition: LocalPlayerPosition;
    ship: Readonly<ShipEntity>;
}>) {
    const steering = sanitizeSteering(
        getDirectionalInputVector({
            activeBindings,
            bindingNames: {
                down: PlayerBinding.PlayerDown,
                left: PlayerBinding.PlayerLeft,
                right: PlayerBinding.PlayerRight,
                up: PlayerBinding.PlayerUp,
            },
        }) || {
            x: 0,
            y: 0,
        },
    );

    return steering.x === ship.params.fly.steering.x && steering.y === ship.params.fly.steering.y
        ? []
        : [
              {
                  playerPosition,
                  steering,
                  type: MultiplayerPacketType.ShipSteer,
              } satisfies MultiplayerPacket,
          ];
}

/** Converts each local player's controls into synchronized piece and steering actions. */
export function sendLocalControls({
    localClientId,
    state,
}: Readonly<{
    localClientId: ClientId;
    state: Partial<FullGameState>;
}>) {
    if (
        state.menuState ||
        isGamePaused(state) ||
        /**
         * This frame's inputs were read for an earlier mode, such as the pilot menu while the run
         * it started was still being created. Acting on them would let one press act in both
         * modes.
         */
        state.rawInputConsumer !== getInputConsumer(state)
    ) {
        return;
    } else if (!state.entityStore) {
        return;
    } else if (!state.multiplayerP2pLockStep) {
        throw new Error('Cannot send local controls: missing multiplayer mod.');
    }

    const run = findRunEntity(state.entityStore);
    const packets = getSortedShips(state.entityStore).flatMap<MultiplayerPacket>((ship) => {
        const playerIdParts = extractMultiplayerPlayerIdParts({
            playerId: ship.params.playerId,
        });
        const activeBindings = state.activeBindings?.[playerIdParts.playerPosition];

        if (playerIdParts.clientId !== localClientId) {
            return [];
        } else if (run?.params.phase === RunPhase.GalaxyMap) {
            return createGalaxyMapPackets({
                activeBindings,
                playerPosition: playerIdParts.playerPosition,
                run,
            });
        } else if (run?.params.phase === RunPhase.Build && !ship.params.build.isReady) {
            return createBuildPackets({
                activeBindings,
                playerPosition: playerIdParts.playerPosition,
                ship,
            });
        } else if (run?.params.phase === RunPhase.Fly) {
            return createSteerPackets({
                activeBindings,
                playerPosition: playerIdParts.playerPosition,
                ship,
            });
        } else {
            return [];
        }
    });

    if (packets.length) {
        state.multiplayerP2pLockStep.multiplayerController.act(packets);
    }
}
