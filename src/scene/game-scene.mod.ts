import {defineAnthaMod} from '@antha/engine';
import {Container, Graphics, Text} from '@antha/graphics-2d';
import {extractMultiplayerPlayerIdParts} from '@antha/multiplayer-core';
import {assertWrap, check} from '@augment-vir/assert';
import {createArray, getEnumValues, SeededRandom} from '@augment-vir/common';
import {html} from 'element-vir';
import {
    createGalaxyMap,
    getJumpArrivalProgress,
    getJumpExitProgress,
    getJumpPanelProgress,
    updateGalaxyMap,
} from '../galaxy/galaxy-map.js';
import {isGamePaused, type FullGameState} from '../game-state/game-state.js';
import {gameWorldSize} from '../game-state/game-world.js';
import {maxPlayerCount} from '../game-state/multiplayer-packet.js';
import {getBindingIcon} from '../player/input-device.js';
import {PlayerBinding} from '../player/player-binding.js';
import {sendStarClicks} from '../player/star-click.js';
import {phaseTransitionMs, RunPhase} from '../run/run-phase.js';
import {findRunEntity, type RunEntity} from '../run/run.entity.js';
import {createFinishedShipBuild} from '../ship/ship-build.js';
import {CellKind, defaultCellFacings, type PieceCell} from '../ship/ship-cell.js';
import {flyCellSize, getFlyStartPosition} from '../ship/ship-fly.js';
import {getShipGridBounds, shipGridSize} from '../ship/ship-grid.js';
import {
    drawShipCells,
    getSortedShips,
    shipViewCellSize,
    type ShipEntity,
} from '../ship/ship.entity.js';
import {
    controlIconSize,
    GameControlHints,
    type ControlHintRow,
} from './game-control-hints.element.js';
import {createPartProgressHud, updatePartProgressHud} from './part-progress-hud.js';
import {
    easeTransition,
    getBuildPanelLayout,
    getBuildPanelRects,
    getFlyTransform,
    interpolateShipViewTransform,
    type ShipViewTransform,
} from './scene-layout.js';
import {createSystemScenery, updateSystemScenery} from './system-scenery.js';

const hyperspaceStreakCount = 90;
const hyperspaceScrollPxPerMs = 1.4;
/** Each offered piece is drawn centered in a square slot this many cells wide. */
const offerSlotCellCount = 5;
const maxVisibleOfferCount = 3;
const buildControlHints = [
    {
        bindingNames: [
            PlayerBinding.PieceSwap,
        ],
        label: 'Swap',
    },
    {
        bindingNames: [
            PlayerBinding.PieceRotateCounterclockwise,
            PlayerBinding.PieceRotate,
        ],
        label: 'Rotate',
    },
    {
        bindingNames: [
            PlayerBinding.PiecePlace,
        ],
        label: 'Place',
    },
    {
        bindingNames: [
            PlayerBinding.Launch,
        ],
        label: 'Launch',
    },
] as const;

/** A panel's board in ship view space, so it lines up with the ship drawn over it. */
function createBoard() {
    const board = new Container();

    board.pivot.set(
        (shipGridSize.width * shipViewCellSize) / 2,
        -(shipGridSize.height * shipViewCellSize) / 2,
    );

    return board;
}

/** Draws only the part of the board that `bounds` can be built on. */
function drawBoardBounds({
    bounds,
    graphics,
}: Readonly<{
    bounds: Readonly<ReturnType<typeof getShipGridBounds>>;
    graphics: Graphics;
}>) {
    const left = bounds.x * shipViewCellSize;
    const right = (bounds.x + bounds.width) * shipViewCellSize;
    const bottom = -bounds.y * shipViewCellSize;
    const top = -(bounds.y + bounds.height) * shipViewCellSize;

    graphics
        .clear()
        .rect(left, top, right - left, bottom - top)
        .fill({
            color: '#0b1020',
        });

    createArray(bounds.width - 1, (index) => left + (index + 1) * shipViewCellSize).forEach((x) => {
        graphics.moveTo(x, top).lineTo(x, bottom);
    });
    createArray(bounds.height - 1, (index) => bottom - (index + 1) * shipViewCellSize).forEach(
        (y) => {
            graphics.moveTo(left, y).lineTo(right, y);
        },
    );

    graphics
        .stroke({
            color: '#1c2640',
            width: 1,
        })
        .rect(left, top, right - left, bottom - top)
        .stroke({
            color: '#3a4a6b',
            width: 4,
        });
}

/** Each special part's name, shown beside the build board while the ship has it or it's on offer. */
export const specialPartTitles: Readonly<Record<CellKind, string | undefined>> = {
    [CellKind.Cockpit]: 'Core',
    [CellKind.Gun]: 'Gun',
    [CellKind.Hull]: undefined,
    [CellKind.RapidGun]: 'Rapid gun',
    [CellKind.Shield]: 'Shield',
    [CellKind.SpreadGun]: 'Spread gun',
    [CellKind.Thruster]: 'Thruster',
    [CellKind.Magnet]: 'Magnet',
    [CellKind.MissileLauncher]: 'Missile launcher',
    [CellKind.NovaGun]: 'Nova gun',
    [CellKind.Laser]: 'Laser',
};
const legendRowGap = 12;
const legendTextGap = 12;
const legendBoardGap = 24;

function createHudText(fontSize: number) {
    return new Text({
        style: {
            fill: '#ffffff',
            fontFamily: 'sans-serif',
            fontSize,
        },
        text: '',
    });
}

function createBuildPanel({
    boardsLayer,
    hudLayer,
}: Readonly<{
    boardsLayer: Container;
    hudLayer: Container;
}>) {
    const panel = {
        board: createBoard(),
        boardBounds: new Graphics(),
        drawnBoardBounds: undefined as ReturnType<typeof getShipGridBounds> | undefined,
        drawnLegendKey: '',
        drawnOffers: undefined as
            | Readonly<Pick<ShipEntity['params']['build'], 'offers' | 'selectedOfferIndex'>>
            | undefined,
        hud: new Container(),
        legend: new Container(),
        name: createHudText(32),
        preview: new Graphics(),
        status: createHudText(24),
    };

    panel.name.anchor.set(0.5, 1);
    panel.status.anchor.set(0.5, 0);
    panel.hud.addChild(panel.name, panel.status, panel.preview, panel.legend);
    panel.board.addChild(panel.boardBounds);
    boardsLayer.addChild(panel.board);
    hudLayer.addChild(panel.hud);

    return panel;
}

type BuildPanel = ReturnType<typeof createBuildPanel>;

/**
 * Streaks of light that rush down the screen while the ships build, as if they're flying up through
 * hyperspace. They come from their own seed for the same reason as the system scenery.
 */
function createHyperspace() {
    const random = SeededRandom.fromSeed('hyperspace');

    return {
        graphics: new Graphics(),
        scrollPx: 0,
        streaks: createArray(hyperspaceStreakCount, () => {
            return {
                alpha: 0.1 + random.next() * 0.3,
                length: 40 + random.next() * 140,
                offsetY: random.next() * gameWorldSize.height,
                speedShare: 0.5 + random.next(),
                width: 1 + random.next(),
                x: random.next() * gameWorldSize.width,
            };
        }),
    };
}

type Hyperspace = ReturnType<typeof createHyperspace>;

function drawHyperspace(hyperspace: Hyperspace) {
    hyperspace.graphics.clear();
    hyperspace.streaks.forEach((streak) => {
        const loopHeight = gameWorldSize.height + streak.length;
        const y =
            ((streak.offsetY + hyperspace.scrollPx * streak.speedShare) % loopHeight) -
            streak.length;

        hyperspace.graphics
            .moveTo(streak.x, y)
            .lineTo(streak.x, y + streak.length)
            .stroke({
                alpha: streak.alpha,
                color: '#9fc4ff',
                width: streak.width,
            });
    });
}

function createGameScene(stage: Container) {
    const boardsLayer = new Container();
    const hudLayer = new Container();
    const scenery = createSystemScenery();
    const hyperspace = createHyperspace();
    const galaxyMap = createGalaxyMap();
    const pausedText = createHudText(48);
    const partProgressHud = createPartProgressHud();

    /** Ship views are added straight to the stage by the entity store, between these layers. */
    stage.sortableChildren = true;
    scenery.container.zIndex = -2;
    hyperspace.graphics.zIndex = -2;
    galaxyMap.container.zIndex = -2;
    boardsLayer.zIndex = -1;
    hudLayer.zIndex = 1;
    pausedText.anchor.set(0.5);
    pausedText.position.set(gameWorldSize.width / 2, gameWorldSize.height / 2);
    pausedText.text = 'Paused';
    hudLayer.addChild(pausedText, partProgressHud.container);
    stage.addChild(
        scenery.container,
        hyperspace.graphics,
        galaxyMap.container,
        boardsLayer,
        hudLayer,
    );

    return {
        buildPanels: createArray(maxPlayerCount, () => {
            return createBuildPanel({
                boardsLayer,
                hudLayer,
            });
        }),
        galaxyMap,
        hyperspace,
        partProgressHud,
        pausedText,
        scenery,
        timeMs: 0,
    };
}

type GameScene = ReturnType<typeof createGameScene>;

function applyShipViewTransform({
    alpha,
    transform,
    view,
}: Readonly<{
    alpha: number;
    transform: Readonly<ShipViewTransform>;
    view: Container;
}>) {
    view.alpha = alpha;
    view.visible = alpha > 0;
    view.position.set(transform.x, transform.y);
    view.rotation = transform.rotation;
    view.scale.set(transform.scale);
}

/** How far the camera is toward the build panels, from 0 (the shared fly view) to 1. */
function getBuildViewProgress(run: Readonly<RunEntity>) {
    const transitionProgress = easeTransition(run.params.phaseElapsedMs / phaseTransitionMs);
    const buildViewProgressByPhase: Readonly<Record<RunPhase, number>> = {
        [RunPhase.GalaxyMap]: 0,
        /** Without anything to build, hyperspace fades into the system as the ships arrive. */
        [RunPhase.Jump]: run.hasPiecesToBuild()
            ? getJumpExitProgress(run)
            : getJumpExitProgress(run) * (1 - getJumpArrivalProgress(run)),
        [RunPhase.Build]: 1,
        [RunPhase.ToFly]: 1 - transitionProgress,
        [RunPhase.Fly]: 0,
        [RunPhase.Wrecked]: 0,
        [RunPhase.Reward]: 0,
        [RunPhase.Depart]: 0,
    };

    return buildViewProgressByPhase[run.params.phase];
}

/**
 * Draws the selected piece in a box, with the next few pieces it can be swapped for in a column
 * under it.
 */
function drawOffers({
    build,
    panel,
    playerColor,
}: Readonly<{
    build: Readonly<ShipEntity['params']['build']>;
    panel: BuildPanel;
    playerColor: ShipEntity['params']['profile']['color'];
}>) {
    if (
        panel.drawnOffers?.offers === build.offers &&
        panel.drawnOffers.selectedOfferIndex === build.selectedOfferIndex
    ) {
        return;
    }

    panel.drawnOffers = build;
    panel.preview.clear();

    const visibleOffers = createArray(
        Math.min(maxVisibleOfferCount, build.offers.length),
        (slotIndex) => {
            return assertWrap.isDefined(
                build.offers[(build.selectedOfferIndex + slotIndex) % build.offers.length],
            );
        },
    );

    visibleOffers.forEach((piece, slotIndex) => {
        const xValues = piece.cells.map((cell) => cell.x);
        const yValues = piece.cells.map((cell) => cell.y);
        /** Ship space has +y up, so later slots go further negative to stack downward. */
        const slotBottom = -slotIndex * offerSlotCellCount;
        const offset = {
            x: (offerSlotCellCount - Math.min(...xValues) - Math.max(...xValues) - 1) / 2,
            y:
                slotBottom +
                (offerSlotCellCount - Math.min(...yValues) - Math.max(...yValues) - 1) / 2,
        };

        if (!slotIndex) {
            panel.preview
                .rect(
                    0,
                    -(slotBottom + offerSlotCellCount) * shipViewCellSize,
                    offerSlotCellCount * shipViewCellSize,
                    offerSlotCellCount * shipViewCellSize,
                )
                .stroke({
                    color: playerColor,
                    width: 4,
                });
        }

        drawShipCells({
            alpha: slotIndex ? 0.5 : 1,
            cells: piece.cells.map((cell) => {
                return {
                    ...cell,
                    x: cell.x + offset.x,
                    y: cell.y + offset.y,
                };
            }),
            hullColor: playerColor,
            graphics: panel.preview,
        });
    });

    panel.preview.pivot.set(
        (offerSlotCellCount * shipViewCellSize) / 2,
        ((visibleOffers.length - 2) * offerSlotCellCount * shipViewCellSize) / 2,
    );
}

/**
 * Lists each special part among the offered pieces, one row each: its name, then its block. The
 * rows are right-aligned to `right` and centered on `centerY`.
 */
function drawSpecialPartLegend({
    cells,
    centerY,
    color,
    panel,
    right,
}: Readonly<{
    /** The ship's cells and the cells of every piece on offer. */
    cells: ReadonlyArray<Readonly<Pick<PieceCell, 'kind'>>>;
    centerY: number;
    color: string;
    panel: BuildPanel;
    right: number;
}>) {
    const kinds = getEnumValues(CellKind).filter((kind) => {
        return !!specialPartTitles[kind] && cells.some((cell) => cell.kind === kind);
    });
    const legendKey = kinds.join(':');

    if (panel.drawnLegendKey !== legendKey) {
        panel.drawnLegendKey = legendKey;
        panel.legend.removeChildren().forEach((child) => child.destroy());

        const blocks = new Graphics();

        panel.legend.addChild(blocks);
        kinds.forEach((kind, rowIndex) => {
            const text = createHudText(20);
            const rowTop = rowIndex * (shipViewCellSize + legendRowGap);

            text.text = specialPartTitles[kind] || '';

            drawShipCells({
                alpha: 1,
                cells: [
                    {
                        facing: defaultCellFacings[kind],
                        kind,
                        x: -1,
                        /** Ship view space has +y up, so lower rows are more negative cell rows. */
                        y: -rowTop / shipViewCellSize - 1,
                    },
                ],
                graphics: blocks,
                hullColor: color,
            });
            text.anchor.set(1, 0.5);
            text.position.set(-shipViewCellSize - legendTextGap, rowTop + shipViewCellSize / 2);
            panel.legend.addChild(text);
        });
    }

    panel.legend.position.set(right, centerY - panel.legend.height / 2);
}

function updateBuildPanel({
    buildViewProgress,
    isInBackground,
    isOnlyPilot,
    panel,
    panelRect,
    playerInputs,
    ship,
}: Readonly<{
    buildViewProgress: number;
    /** Hides the control hints while a menu or pause covers the game. */
    isInBackground: boolean;
    isOnlyPilot: boolean;
    panel: BuildPanel;
    playerInputs: Omit<Parameters<typeof getBindingIcon>[0], 'bindingName'>;
    panelRect: Parameters<typeof getBuildPanelLayout>[0] | undefined;
    ship: Readonly<ShipEntity> | undefined;
}>) {
    const isVisible = !!panelRect && !!ship && buildViewProgress > 0;

    panel.board.visible = isVisible;
    panel.hud.visible = isVisible;

    if (!isVisible) {
        return undefined;
    }

    const layout = getBuildPanelLayout(panelRect);
    const activePiece = ship.params.build.activePiece;

    applyShipViewTransform({
        alpha: buildViewProgress,
        transform: layout.board,
        view: panel.board,
    });
    panel.hud.alpha = buildViewProgress;
    panel.name.text = ship.params.profile.name;
    panel.name.style.fill = ship.params.profile.color;
    const gridBounds = getShipGridBounds(ship.params.grid);
    const boundsScreenRect = {
        bottom:
            layout.board.y +
            (shipGridSize.height / 2 - gridBounds.y) * shipViewCellSize * layout.board.scale,
        left:
            layout.board.x +
            (gridBounds.x - shipGridSize.width / 2) * shipViewCellSize * layout.board.scale,
        top:
            layout.board.y +
            (shipGridSize.height / 2 - gridBounds.y - gridBounds.height) *
                shipViewCellSize *
                layout.board.scale,
    };

    panel.name.position.set(layout.board.x, boundsScreenRect.top - 16);

    if (panel.drawnBoardBounds !== gridBounds) {
        panel.drawnBoardBounds = gridBounds;
        drawBoardBounds({
            bounds: gridBounds,
            graphics: panel.boardBounds,
        });
    }

    panel.status.text = ship.params.build.isReady
        ? isOnlyPilot
            ? ''
            : 'Ready. Waiting for the other pilots.'
        : activePiece
          ? ''
          : 'No pieces left';
    panel.status.position.set(layout.board.x, boundsScreenRect.bottom + 16);

    drawOffers({
        build: activePiece ? ship.params.build : createFinishedShipBuild(),
        panel,
        playerColor: ship.params.profile.color,
    });

    drawSpecialPartLegend({
        cells: [
            ...ship.params.grid.cells,
            ...(activePiece ? ship.params.build.offers : []).flatMap((piece) => piece.cells),
        ],
        centerY: (boundsScreenRect.top + boundsScreenRect.bottom) / 2,
        color: ship.params.profile.color,
        panel,
        right: boundsScreenRect.left - legendBoardGap,
    });
    applyShipViewTransform({
        alpha: 1,
        transform: layout.preview,
        view: panel.preview,
    });

    if (isInBackground || ship.params.build.isReady) {
        return undefined;
    }

    return {
        hints: [
            ...(activePiece
                ? buildControlHints.map((hint) => {
                      return {
                          icons: hint.bindingNames
                              .map((bindingName) => {
                                  return getBindingIcon({
                                      ...playerInputs,
                                      bindingName,
                                  });
                              })
                              .filter(check.isTruthy),
                          label: hint.label,
                      };
                  })
                : [
                      {
                          icons: [
                              getBindingIcon({
                                  ...playerInputs,
                                  bindingName: PlayerBinding.Launch,
                              }),
                          ].filter(check.isTruthy),
                          isFlashing: true,
                          label: 'Launch',
                      },
                  ]),
            ...(ship.params.build.undoSteps.length
                ? [
                      {
                          icons: [
                              getBindingIcon({
                                  ...playerInputs,
                                  bindingName: PlayerBinding.PieceUndo,
                              }),
                          ].filter(check.isTruthy),
                          label: 'Undo',
                      },
                  ]
                : []),
        ],
        opacity: buildViewProgress,
        x: layout.board.x,
        y: panel.status.y + panel.status.height + 8,
    } satisfies ControlHintRow;
}

/**
 * Builds the shared fly view and each local player's build panel around the ship views, and moves
 * the ship views between them. Every local ship is drawn in its own panel while building, and
 * remote ships only appear once everyone is flying.
 */
function renderGameScene({
    gameScene,
    msSinceLastExecute,
    state,
}: Readonly<{
    gameScene: GameScene;
    msSinceLastExecute: number;
    state: Partial<FullGameState>;
}>) {
    const run = state.entityStore ? findRunEntity(state.entityStore) : undefined;

    /** Peers whose own menu isn't open see why everything stopped. */
    gameScene.pausedText.visible = isGamePaused(state) && !state.menuState;
    gameScene.galaxyMap.container.visible =
        run?.params.phase === RunPhase.GalaxyMap || run?.params.phase === RunPhase.Jump;

    gameScene.partProgressHud.container.visible = false;

    if (!run || !state.entityStore) {
        gameScene.hyperspace.graphics.visible = false;
        gameScene.buildPanels.forEach((panel) => {
            panel.board.visible = false;
            panel.hud.visible = false;
        });
        return [];
    }

    const localClientId = state.multiplayerP2pLockStep?.multiplayerController.getClientId();
    const buildViewProgress = getBuildViewProgress(run);
    const ships = getSortedShips(state.entityStore);
    const localShips = ships.filter((ship) => {
        return (
            extractMultiplayerPlayerIdParts({
                playerId: ship.params.playerId,
            }).clientId === localClientId
        );
    });
    const panelRects = getBuildPanelRects(localShips.length);

    const isOnGalaxyMap = run.params.phase === RunPhase.GalaxyMap;
    const isPaused = isGamePaused(state);
    const isInBackground = isPaused || !!state.menuState;

    if (!isPaused) {
        gameScene.timeMs += msSinceLastExecute;
    }

    const isLaunchingFromJump = run.params.phase === RunPhase.Jump && !run.hasPiecesToBuild();
    const sceneryAlpha = isLaunchingFromJump
        ? getJumpArrivalProgress(run)
        : gameScene.galaxyMap.container.visible
          ? 0
          : 1 - buildViewProgress;

    gameScene.scenery.container.visible = sceneryAlpha > 0;
    gameScene.scenery.container.alpha = sceneryAlpha;

    if (gameScene.scenery.container.visible) {
        updateSystemScenery({
            isScrolling: run.params.phase === RunPhase.Fly && !isPaused,
            msSinceLastExecute,
            run,
            scenery: gameScene.scenery,
        });
    }
    gameScene.partProgressHud.container.visible = gameScene.scenery.container.visible;
    gameScene.partProgressHud.container.alpha = sceneryAlpha;

    if (gameScene.partProgressHud.container.visible) {
        updatePartProgressHud({
            hud: gameScene.partProgressHud,
            /** Progress is shared, so the hull piece takes the first local pilot's color. */
            hullColor: localShips[0]?.params.profile.color || '#c8d2e6',
            run,
        });
    }

    gameScene.hyperspace.graphics.visible = buildViewProgress > 0;
    gameScene.hyperspace.graphics.alpha = buildViewProgress;

    if (buildViewProgress > 0) {
        if (!isPaused) {
            gameScene.hyperspace.scrollPx += msSinceLastExecute * hyperspaceScrollPxPerMs;
        }

        drawHyperspace(gameScene.hyperspace);
    }

    if (gameScene.galaxyMap.container.visible) {
        updateGalaxyMap({
            galaxyMap: gameScene.galaxyMap,
            run,
            timeMs: gameScene.timeMs,
        });
    }

    const galaxyHintRows: ControlHintRow[] =
        gameScene.galaxyMap.container.visible &&
        run.params.phase !== RunPhase.Jump &&
        !isInBackground
            ? [
                  {
                      hints: [
                          {
                              icons: localShips
                                  .map((ship) => {
                                      const {playerPosition} = extractMultiplayerPlayerIdParts({
                                          playerId: ship.params.playerId,
                                      });

                                      return getBindingIcon({
                                          bindingAssignments:
                                              state.bindingAssignments?.[playerPosition],
                                          bindingName: PlayerBinding.Travel,
                                          device: state.saveState?.lastInputDevices[playerPosition],
                                      });
                                  })
                                  .filter(check.isTruthy)
                                  .filter((icon, iconIndex, icons) => {
                                      return (
                                          icons.findIndex((other) => other.name === icon.name) ===
                                          iconIndex
                                      );
                                  }),
                              label: 'Travel',
                          },
                      ],
                      opacity: 1,
                      x: gameWorldSize.width / 2,
                      y: gameWorldSize.height - 16 - controlIconSize,
                  },
              ]
            : [];

    sendStarClicks({
        clickedPositions: gameScene.galaxyMap.clickedPositions.splice(0),
        localShips,
        run,
        state,
    });

    ships.forEach((ship, shipIndex) => {
        const localShipIndex = localShips.indexOf(ship);
        const flyTransform = getFlyTransform(ship.params.fly);
        const panelRect = panelRects[localShipIndex];
        const panelLayout = panelRect ? getBuildPanelLayout(panelRect) : undefined;
        const endTransform = panelLayout?.board ?? flyTransform;

        if (isLaunchingFromJump) {
            /** Ships fly up from just below the screen to where the run launches them. */
            const launchTransform = getFlyTransform(
                getFlyStartPosition({
                    shipCount: ships.length,
                    shipIndex,
                }),
            );
            const startY = gameWorldSize.height + (shipGridSize.height * flyCellSize) / 2;

            applyShipViewTransform({
                alpha: 1,
                transform: {
                    ...launchTransform,
                    y: startY + (launchTransform.y - startY) * getJumpArrivalProgress(run),
                },
                view: ship.view,
            });
            return;
        } else if (run.params.phase === RunPhase.Jump) {
            /**
             * Ships fly up into their build panels from just below the screen once hyperspace
             * appears.
             */
            const startY =
                gameWorldSize.height +
                (panelLayout?.boardBottom ?? endTransform.y) -
                endTransform.y;

            applyShipViewTransform({
                alpha: panelLayout ? 1 : 0,
                transform: {
                    ...endTransform,
                    y: startY + (endTransform.y - startY) * getJumpArrivalProgress(run),
                },
                view: ship.view,
            });
            return;
        }

        applyShipViewTransform(
            isOnGalaxyMap
                ? {
                      alpha: 0,
                      transform: flyTransform,
                      view: ship.view,
                  }
                : panelRect
                  ? {
                        alpha: 1,
                        transform: interpolateShipViewTransform({
                            from: flyTransform,
                            progress: buildViewProgress,
                            to: endTransform,
                        }),
                        view: ship.view,
                    }
                  : {
                        alpha: 1 - buildViewProgress,
                        transform: flyTransform,
                        view: ship.view,
                    },
        );
    });

    const buildHintRows = gameScene.buildPanels.flatMap((panel, panelIndex) => {
        const ship = localShips[panelIndex];
        const playerPosition = ship
            ? extractMultiplayerPlayerIdParts({
                  playerId: ship.params.playerId,
              }).playerPosition
            : undefined;

        const hintRow = updateBuildPanel({
            buildViewProgress: isLaunchingFromJump
                ? 0
                : run.params.phase === RunPhase.Jump
                  ? getJumpPanelProgress(run)
                  : buildViewProgress,
            isInBackground,
            isOnlyPilot: ships.length === 1,
            panel,
            panelRect: panelRects[panelIndex],
            playerInputs: {
                bindingAssignments: playerPosition && state.bindingAssignments?.[playerPosition],
                device: playerPosition && state.saveState?.lastInputDevices[playerPosition],
            },
            ship,
        });

        return hintRow
            ? [
                  hintRow,
              ]
            : [];
    });

    return [
        ...galaxyHintRows,
        ...buildHintRows,
    ];
}

/**
 * Draws everything that isn't an entity and places the ship views. This never changes game state
 * directly. Clicks on the galaxy map are sent as packets like any other input.
 */
export const gameSceneMod = defineAnthaMod<
    FullGameState & {
        gameScene: GameScene | undefined;
    }
>({
    modName: 'game-scene',
    execute({msSinceLastExecute, state}) {
        const stage = state.pixi?.pixiApplication?.stage;

        if (!stage) {
            return undefined;
        }

        const gameScene = state.gameScene || createGameScene(stage);

        state.gameScene = gameScene;

        return html`
            <${GameControlHints.assign({
                rows: renderGameScene({
                    gameScene,
                    msSinceLastExecute,
                    state,
                }),
            })}></${GameControlHints}>
        `;
    },
});
