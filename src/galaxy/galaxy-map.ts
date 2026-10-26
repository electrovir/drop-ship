// cspell:word pointertap
import {
    AlphaFilter,
    Color,
    Container,
    Graphics,
    Rectangle,
    Sprite,
    Texture,
} from '@antha/graphics-2d';
import {assertWrap} from '@augment-vir/assert';
import {clamp, createArray, SeededRandom, type Coords} from '@augment-vir/common';
import {gameWorldSize} from '../game-state/game-world.js';
import {jumpMs, RunPhase} from '../run/run-phase.js';
import {type RunEntity} from '../run/run.entity.js';
import {easeTransition} from '../scene/scene-layout.js';
import {
    coreRadiusShare,
    galaxyCenter,
    galaxyRadius,
    getConnectedStarIndexes,
    getSpiralArmAngle,
    getSpiralShape,
    maxStarDifficulty,
    type Galaxy,
} from './galaxy.js';

const dustCount = 3000;
/** The glow is painted at a lower resolution, since it's blurry anyway. */
const glowPixelSize = 2;
/**
 * The glow is painted several times with its clouds turned slightly further along the arms each
 * time, and the map slowly blends between them so the clouds seem to drift.
 */
const glowLayerCount = 3;
const glowLayerTurnRadians = 0.14;
const glowDriftCycleMs = 11_000;
const easyStarColor = new Color('#cfe0ff');
const hardStarColor = new Color('#ff7a4d');
const selectedColor = '#ffd60a';
/**
 * How far the camera zooms in during a jump: far enough for the selected hyperlane to fill the
 * screen.
 */
const jumpZoomScale = 800;
/**
 * The share of a jump spent turning the camera to face along the hyperlane, before hyperspace fades
 * in.
 */
const jumpTurnShare = 0.35;
/** How long the galaxy map takes to zoom out from the current star when it opens. */
const galaxyZoomOutMs = 1200;
/** How far zoomed in on the current star the galaxy map starts when it opens. */
const galaxyZoomOutStartScale = 40;
const screenCenter: Readonly<Coords> = {
    x: gameWorldSize.width / 2,
    y: gameWorldSize.height / 2,
};

/** Everything drawn on the galaxy map. Only `world` moves with the camera. */
export function createGalaxyMap() {
    const galaxyMap = {
        /** Galaxy space positions of clicks since the last frame. */
        clickedPositions: [] as Coords[],
        container: new Container(),
        drawnKey: '',
        drawnSeed: '',
        dust: new Graphics(),
        /**
         * Fades the map as one flattened image. Fading by container alpha instead makes every shape
         * translucent on its own, so lanes show through the stars drawn over them.
         */
        fade: new AlphaFilter({
            alpha: 1,
            antialias: 'inherit',
            resolution: 'inherit',
        }),
        glowLayers: createArray(glowLayerCount, () => {
            return new Sprite({
                blendMode: 'add',
            });
        }),
        /**
         * The camera and fade on the last frame before a jump, so a jump picked mid zoom-out dives
         * from there instead of snapping to the whole galaxy first.
         */
        jumpStart: undefined as
            | undefined
            | {
                  camera: Readonly<Pick<GalaxyCamera, 'focus' | 'scale'>>;
                  fadeAlpha: number;
              },
        lanes: new Graphics(),
        selectedRing: new Graphics().circle(0, 0, 10).stroke({
            color: selectedColor,
            width: 2.5,
        }),
        stars: new Graphics(),
        world: new Container(),
    };

    galaxyMap.world.eventMode = 'static';
    galaxyMap.world.hitArea = new Rectangle(0, 0, gameWorldSize.width, gameWorldSize.height);
    galaxyMap.world.on('pointertap', (event) => {
        galaxyMap.clickedPositions.push(event.getLocalPosition(galaxyMap.world));
    });
    galaxyMap.world.addChild(
        ...galaxyMap.glowLayers,
        galaxyMap.dust,
        galaxyMap.lanes,
        galaxyMap.stars,
        galaxyMap.selectedRing,
    );
    galaxyMap.container.addChild(galaxyMap.world);
    galaxyMap.container.filters = [
        galaxyMap.fade,
    ];
    galaxyMap.container.filterArea = new Rectangle(0, 0, gameWorldSize.width, gameWorldSize.height);

    return galaxyMap;
}

export type GalaxyMap = ReturnType<typeof createGalaxyMap>;

/** Blends from pale blue on the easy edge of the galaxy to orange at its hard core. */
export function getStarColor(difficulty: number) {
    const share = difficulty / maxStarDifficulty;
    const easyRgb = easyStarColor.toRgbArray();
    const hardRgb = hardStarColor.toRgbArray();

    return new Color(
        easyRgb.map((easyValue, index) => {
            return easyValue + (assertWrap.isDefined(hardRgb[index]) - easyValue) * share;
        }),
    );
}

/** Red, green, and blue from 0 to 255. */
type Rgb = ReadonlyArray<number>;

/** The look of the nebulas along the arms. */
enum BlotchKind {
    /** Soft, wide clouds. */
    Clouds = 'clouds',
    /** Thin glowing streaks. */
    Filaments = 'filaments',
    /** Small, bright star-forming knots. */
    Knots = 'knots',
}

/** Turns smooth noise from 0 to 1 into how much nebula is at that spot, from 0 to 1. */
const blotchShapers: Record<BlotchKind, (noise: number) => number> = {
    [BlotchKind.Clouds](noise) {
        return noise;
    },
    [BlotchKind.Filaments](noise) {
        return (1 - Math.abs(2 * noise - 1)) ** 4;
    },
    [BlotchKind.Knots](noise) {
        return easeTransition((noise - 0.62) / 0.12);
    },
};

const galaxyPalettes: ReadonlyArray<
    Readonly<{
        arm: Rgb;
        core: Rgb;
        nebula: Rgb;
    }>
> = [
    {
        arm: [
            150,
            180,
            255,
        ],
        core: [
            255,
            220,
            170,
        ],
        nebula: [
            240,
            150,
            220,
        ],
    },
    {
        arm: [
            110,
            220,
            210,
        ],
        core: [
            255,
            245,
            200,
        ],
        nebula: [
            120,
            255,
            150,
        ],
    },
    {
        arm: [
            255,
            120,
            90,
        ],
        core: [
            255,
            210,
            120,
        ],
        nebula: [
            255,
            80,
            170,
        ],
    },
    {
        arm: [
            170,
            120,
            255,
        ],
        core: [
            240,
            230,
            255,
        ],
        nebula: [
            90,
            220,
            255,
        ],
    },
    {
        arm: [
            255,
            200,
            110,
        ],
        core: [
            255,
            250,
            220,
        ],
        nebula: [
            255,
            110,
            80,
        ],
    },
    {
        arm: [
            200,
            235,
            255,
        ],
        core: [
            255,
            255,
            255,
        ],
        nebula: [
            100,
            140,
            255,
        ],
    },
];

function mixRgb({
    from,
    share,
    to,
}: Readonly<{
    from: Readonly<Rgb>;
    share: number;
    to: Readonly<Rgb>;
}>) {
    return from.map((fromValue, channelIndex) => {
        return fromValue + (assertWrap.isDefined(to[channelIndex]) - fromValue) * share;
    });
}

function toHexColor(rgb: Readonly<Rgb>) {
    return new Color(rgb.map((value) => value / 255)).toHex();
}

function pickRandom<const Value>({
    random,
    values,
}: Readonly<{
    random: Readonly<SeededRandom>;
    values: ReadonlyArray<Value>;
}>) {
    return assertWrap.isDefined(values[Math.floor(random.next() * values.length)]);
}

/**
 * The seeded look of a galaxy's glow. Only the map draws these, so unlike {@link getSpiralShape}
 * they don't need to match across browsers.
 */
function getGalaxyLook(galaxySeed: string) {
    const random = SeededRandom.fromSeed(
        [
            galaxySeed,
            'look',
        ].join(':'),
    );
    const spiralShape = getSpiralShape(galaxySeed);

    return {
        /**
         * Higher narrows the arms' glow. It follows the stars' spread so the stars stay on the
         * arms.
         */
        armExponent: 0.9 / spiralShape.armSpread ** 1.4,
        /**
         * From 0 for arms that fade gradually into the disc, to 1 for the crispest arm edges. Even
         * the crispest edges stay soft, since hard edges look cartoonish.
         */
        armSharpness: random.next() * 0.6,
        blotchKind: pickRandom({
            random,
            values: Object.values(BlotchKind),
        }),
        /** Lower makes more of each arm nebula. */
        blotchThreshold: 0.35 + random.next() * 0.4,
        coreBrightness: 0.7 + random.next() * 0.8,
        coreSize: 0.035 + random.next() * 0.07,
        discFalloff: 0.35 + random.next() * 0.35,
        dustLaneStrength: random.next() * 0.6,
        /** Glow between the arms, which is never dark enough to look empty. */
        haze: 0.3 + random.next() * 0.3,
        /** Smaller makes smaller, busier blotches. */
        noiseCellCount: 24 + Math.floor(random.next() * 70),
        palette: pickRandom({
            random,
            values: galaxyPalettes,
        }),
        spiralShape,
    };
}

type GalaxyLook = ReturnType<typeof getGalaxyLook>;

/** Smooth random values from 0 to 1 across the galaxy, for clumps in the arms. */
function createValueNoise({
    gridWidth,
    random,
}: Readonly<{
    /** How many random values span the galaxy's width. */
    gridWidth: number;
    random: Readonly<SeededRandom>;
}>) {
    const gridHeight = Math.ceil((gridWidth * gameWorldSize.height) / gameWorldSize.width);
    const values = createArray(gridWidth * gridHeight, () => random.next());

    function getGridValue({x, y}: Readonly<Coords>) {
        const wrappedX = ((x % gridWidth) + gridWidth) % gridWidth;
        const wrappedY = ((y % gridHeight) + gridHeight) % gridHeight;

        return assertWrap.isDefined(values[wrappedY * gridWidth + wrappedX]);
    }

    return (position: Readonly<Coords>) => {
        const gridX = (position.x / gameWorldSize.width) * (gridWidth - 1);
        const gridY = (position.y / gameWorldSize.height) * (gridHeight - 1);
        const cellX = Math.floor(gridX);
        const cellY = Math.floor(gridY);
        const shareX = easeTransition(gridX - cellX);
        const shareY = easeTransition(gridY - cellY);
        const top =
            getGridValue({
                x: cellX,
                y: cellY,
            }) +
            (getGridValue({
                x: cellX + 1,
                y: cellY,
            }) -
                getGridValue({
                    x: cellX,
                    y: cellY,
                })) *
                shareX;
        const bottom =
            getGridValue({
                x: cellX,
                y: cellY + 1,
            }) +
            (getGridValue({
                x: cellX + 1,
                y: cellY + 1,
            }) -
                getGridValue({
                    x: cellX,
                    y: cellY + 1,
                })) *
                shareX;

        return top + (bottom - top) * shareY;
    };
}

/**
 * Paints the galaxy's glow into a small canvas that's stretched over the map: a bright core, a disc
 * that fades outward, spiral arms where the stars cluster, and dark dust along each arm's inner
 * edge. This is decoration only, so it uses plain `Math` and its own random seed.
 */
function paintGalaxyGlow({
    cloudTurnRadians,
    galaxyLook,
    galaxySeed,
}: Readonly<{
    /** Turns the clouds around the core without moving the arms, which the stars sit on. */
    cloudTurnRadians: number;
    galaxyLook: Readonly<GalaxyLook>;
    galaxySeed: string;
}>) {
    const random = SeededRandom.fromSeed(
        [
            galaxySeed,
            'glow',
        ].join(':'),
    );
    const getBrightnessNoise = createValueNoise({
        gridWidth: 48,
        random,
    });
    const getBlotchNoises = [
        galaxyLook.noiseCellCount,
        Math.round(galaxyLook.noiseCellCount * 2.3),
    ].map((gridWidth) => {
        return createValueNoise({
            gridWidth,
            random,
        });
    });
    const armCount = galaxyLook.spiralShape.armCount;
    const canvas = document.createElement('canvas');
    const context = assertWrap.isDefined(canvas.getContext('2d'));

    canvas.width = gameWorldSize.width / glowPixelSize;
    canvas.height = gameWorldSize.height / glowPixelSize;

    const image = context.createImageData(canvas.width, canvas.height);

    createArray(canvas.width * canvas.height, (pixelIndex) => pixelIndex).forEach((pixelIndex) => {
        const position = {
            x: ((pixelIndex % canvas.width) + 0.5) * glowPixelSize,
            y: (Math.floor(pixelIndex / canvas.width) + 0.5) * glowPixelSize,
        };
        const offsetX = (position.x - galaxyCenter.x) / galaxyRadius.x;
        const offsetY = (position.y - galaxyCenter.y) / galaxyRadius.y;
        const radiusShare = Math.hypot(offsetX, offsetY);
        const cloudPosition = {
            x:
                galaxyCenter.x +
                (offsetX * Math.cos(cloudTurnRadians) - offsetY * Math.sin(cloudTurnRadians)) *
                    galaxyRadius.x,
            y:
                galaxyCenter.y +
                (offsetX * Math.sin(cloudTurnRadians) + offsetY * Math.cos(cloudTurnRadians)) *
                    galaxyRadius.y,
        };
        /**
         * Same as arm 0's angle from `getSpiralArmAngle`, but with `Math.log`. Its stable log is
         * too slow for every pixel, and drawing doesn't need to match across browsers.
         */
        const armPhase =
            Math.atan2(offsetY, offsetX) -
            Math.log(Math.max(radiusShare, coreRadiusShare) / coreRadiusShare) *
                galaxyLook.spiralShape.winding;
        const armFade = easeTransition((radiusShare - 0.06) / 0.2);
        const armWave = 0.5 + 0.5 * Math.cos(armCount * armPhase);
        const softArm = armWave ** galaxyLook.armExponent;
        /** A wide glow around every arm, so even thin arms fade gradually into the disc. */
        const armHalo = armWave ** 1.5 * 0.4;
        const arm =
            (softArm +
                (easeTransition((softArm - 0.1) / 0.5) - softArm) * galaxyLook.armSharpness +
                armHalo) *
            armFade;
        const dustLane = (0.5 + 0.5 * Math.cos(armCount * (armPhase - 0.5))) ** 6 * armFade;
        const noise = getBrightnessNoise(cloudPosition);
        const core =
            Math.exp(-radiusShare / galaxyLook.coreSize) * 1.2 * galaxyLook.coreBrightness +
            Math.exp(-radiusShare / (galaxyLook.coreSize * 2.6)) * 0.45;
        const disc =
            Math.exp(-radiusShare / galaxyLook.discFalloff) *
            (1 - easeTransition((radiusShare - 0.85) / 0.25)) *
            (galaxyLook.haze + 1.1 * arm) *
            (0.45 + 0.9 * noise) *
            (1 - galaxyLook.dustLaneStrength * dustLane);
        const brightness = Math.min(1, (core + disc) * 0.6);
        /** Old stars fill the core, and young stars and nebulas fill the arms. */
        const coreShare = core / (core + disc || 1);
        const nebulaShare =
            easeTransition(
                (blotchShapers[galaxyLook.blotchKind](
                    /** A finer second layer hides the square grid the noise is built on. */
                    getBlotchNoises.reduce((sum, getNoise, layerIndex) => {
                        return sum + getNoise(cloudPosition) * (layerIndex ? 0.35 : 0.65);
                    }, 0),
                ) -
                    galaxyLook.blotchThreshold) /
                    0.4,
            ) * arm;
        const color = mixRgb({
            from: mixRgb({
                from: galaxyLook.palette.arm,
                share: nebulaShare,
                to: galaxyLook.palette.nebula,
            }),
            share: coreShare,
            to: galaxyLook.palette.core,
        });

        /** Painted opaque over black because a transparent glow showed its faint edges as steps. */
        image.data.set(
            [
                ...color.map((value) => value * brightness),
                255,
            ],
            pixelIndex * 4,
        );
    });

    context.putImageData(image, 0, 0);

    return canvas;
}

/** Sparkles of unresolved stars along the arms, on top of the glow. */
function drawGalaxyDust({
    galaxyLook,
    galaxyMap,
    galaxySeed,
}: Readonly<{
    galaxyLook: Readonly<GalaxyLook>;
    galaxyMap: GalaxyMap;
    galaxySeed: string;
}>) {
    const random = SeededRandom.fromSeed(
        [
            galaxySeed,
            'dust',
        ].join(':'),
    );
    const armColor = toHexColor(
        mixRgb({
            from: galaxyLook.palette.arm,
            share: 0.5,
            to: [
                255,
                255,
                255,
            ],
        }),
    );
    const nebulaColor = toHexColor(galaxyLook.palette.nebula);

    galaxyMap.dust.clear();

    createArray(dustCount, () => {
        const isOnArm = random.next() < 0.8;
        const radiusShare = coreRadiusShare / 2 + Math.sqrt(random.next());
        const armScatter = random.next() + random.next() + random.next() - 1.5;
        const angle = isOnArm
            ? getSpiralArmAngle({
                  armIndex: Math.floor(random.next() * galaxyLook.spiralShape.armCount),
                  radiusShare,
                  spiralShape: galaxyLook.spiralShape,
              }) +
              armScatter * galaxyLook.spiralShape.armSpread * 0.7
            : random.next() * 2 * Math.PI;

        return {
            alpha: (0.1 + random.next() * 0.35) * Math.max(0, 1.1 - radiusShare),
            color: random.next() < 0.8 ? armColor : nebulaColor,
            radius: 0.5 + random.next(),
            x: galaxyCenter.x + Math.cos(angle) * radiusShare * galaxyRadius.x,
            y: galaxyCenter.y + Math.sin(angle) * radiusShare * galaxyRadius.y,
        };
    }).forEach((dust) => {
        galaxyMap.dust.circle(dust.x, dust.y, dust.radius).fill({
            alpha: dust.alpha,
            color: dust.color,
        });
    });
}

function drawGalaxyBackdrop({
    galaxyMap,
    galaxySeed,
}: Readonly<{
    galaxyMap: GalaxyMap;
    galaxySeed: string;
}>) {
    const galaxyLook = getGalaxyLook(galaxySeed);

    galaxyMap.glowLayers.forEach((glowLayer, layerIndex) => {
        const oldTexture = glowLayer.texture;

        glowLayer.texture = Texture.from(
            paintGalaxyGlow({
                cloudTurnRadians: layerIndex * glowLayerTurnRadians,
                galaxyLook,
                galaxySeed,
            }),
        );
        glowLayer.setSize(gameWorldSize.width, gameWorldSize.height);
        if (oldTexture !== Texture.EMPTY) {
            oldTexture.destroy(true);
        }
    });
    drawGalaxyDust({
        galaxyLook,
        galaxyMap,
        galaxySeed,
    });
}

/** Redraws the stars and hyperlanes only when the run's position on the galaxy changes. */
function drawGalaxy({
    galaxy,
    galaxyMap,
    run,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    galaxyMap: GalaxyMap;
    run: Readonly<RunEntity>;
}>) {
    if (galaxyMap.drawnSeed !== run.params.galaxySeed) {
        galaxyMap.drawnSeed = run.params.galaxySeed;
        drawGalaxyBackdrop({
            galaxyMap,
            galaxySeed: run.params.galaxySeed,
        });
    }

    /** Until a jump ends, the map keeps showing the star being left as the current star. */
    const visitedStarIndexes =
        run.params.phase === RunPhase.Jump
            ? run.params.visitedStarIndexes.slice(0, -1)
            : run.params.visitedStarIndexes;
    const drawnKey = [
        run.params.galaxySeed,
        visitedStarIndexes.join(','),
        run.params.selectedStarIndex,
    ].join(':');

    if (galaxyMap.drawnKey === drawnKey) {
        return;
    }

    const currentStarIndex = visitedStarIndexes.at(-1) ?? run.params.currentStarIndex;
    const connectedStarIndexes = getConnectedStarIndexes({
        galaxy,
        starIndex: currentStarIndex,
    });
    const traveledHyperlanes = visitedStarIndexes.slice(1).map((starIndex, index) => {
        return [
            assertWrap.isDefined(visitedStarIndexes[index]),
            starIndex,
        ];
    });

    galaxyMap.drawnKey = drawnKey;
    galaxyMap.lanes.clear();
    galaxyMap.stars.clear();

    galaxy.hyperlanes.forEach((hyperlane) => {
        const start = assertWrap.isDefined(galaxy.stars[hyperlane[0]]);
        const end = assertWrap.isDefined(galaxy.stars[hyperlane[1]]);
        const isFromCurrentStar = hyperlane.includes(currentStarIndex);
        const isSelected =
            isFromCurrentStar &&
            run.params.selectedStarIndex !== currentStarIndex &&
            hyperlane.includes(run.params.selectedStarIndex);
        const isTraveled = traveledHyperlanes.some((traveled) => {
            return traveled.every((starIndex) => hyperlane.includes(starIndex));
        });

        galaxyMap.lanes
            .moveTo(start.x, start.y)
            .lineTo(end.x, end.y)
            .stroke(
                isSelected
                    ? {
                          alpha: 1,
                          color: selectedColor,
                          width: 3,
                      }
                    : isFromCurrentStar && isTraveled
                      ? {
                            alpha: 0.9,
                            color: '#ff9f5a',
                            width: 2,
                        }
                      : isFromCurrentStar
                        ? {
                              alpha: 0.9,
                              color: '#9fc4ff',
                              width: 2,
                          }
                        : isTraveled
                          ? {
                                alpha: 0.6,
                                color: '#ff9f5a',
                                width: 1.5,
                            }
                          : {
                                alpha: 0.22,
                                color: '#6f8fd0',
                                width: 1,
                            },
            );
    });

    galaxy.stars.forEach((star, starIndex) => {
        const isConnected = connectedStarIndexes.includes(starIndex);
        const starRadius = isConnected ? 4.5 : 2.5;

        /** Keeps the dimmer, translucent stars from showing the hyperlanes underneath them. */
        galaxyMap.stars.circle(star.x, star.y, starRadius).fill({
            color: '#000000',
        });
        galaxyMap.stars.circle(star.x, star.y, starRadius).fill({
            alpha: isConnected ? 1 : 0.8,
            color: getStarColor(star.difficulty),
        });

        if (starIndex !== currentStarIndex && visitedStarIndexes.includes(starIndex)) {
            galaxyMap.stars.circle(star.x, star.y, starRadius + 2).stroke({
                alpha: 0.9,
                color: '#ff9f5a',
                width: 2,
            });
        }
    });

    const currentStar = assertWrap.isDefined(galaxy.stars[currentStarIndex]);
    const selectedStar = assertWrap.isDefined(galaxy.stars[run.params.selectedStarIndex]);

    galaxyMap.selectedRing.position.set(selectedStar.x, selectedStar.y);
    galaxyMap.stars.circle(currentStar.x, currentStar.y, 8).stroke({
        color: '#ffffff',
        width: 2,
    });
}

/** Turns `radians` into the same angle between -π and π, so the camera turns the short way. */
function normalizeAngle(radians: number) {
    return radians - 2 * Math.PI * Math.round(radians / (2 * Math.PI));
}

/**
 * Where the camera looks during a jump: it turns so the hyperlane points up and dives into its
 * middle, starting from `startCamera`.
 */
function getJumpCamera({
    galaxy,
    run,
    startCamera,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    run: Readonly<RunEntity>;
    startCamera: Readonly<Pick<GalaxyCamera, 'focus' | 'scale'>>;
}>) {
    const progress = run.params.phaseElapsedMs / jumpMs;
    const turnProgress = easeTransition(progress / jumpTurnShare);
    const scale =
        startCamera.scale * (jumpZoomScale / startCamera.scale) ** easeTransition(progress / 0.65);
    const toStar = assertWrap.isDefined(galaxy.stars[run.params.currentStarIndex]);
    const fromStar = assertWrap.isDefined(
        galaxy.stars[run.params.visitedStarIndexes.at(-2) ?? run.params.currentStarIndex],
    );
    const laneCenter = {
        x: (fromStar.x + toStar.x) / 2,
        y: (fromStar.y + toStar.y) / 2,
    };
    const laneRotation = normalizeAngle(
        -Math.PI / 2 - Math.atan2(toStar.y - fromStar.y, toStar.x - fromStar.x),
    );

    return {
        /**
         * Slides the lane's center toward the middle of the screen in screen space. Panning in
         * galaxy space instead would sweep across the galaxy while zoomed in.
         */
        focus: {
            x:
                laneCenter.x -
                ((laneCenter.x - startCamera.focus.x) * startCamera.scale * (1 - turnProgress)) /
                    scale,
            y:
                laneCenter.y -
                ((laneCenter.y - startCamera.focus.y) * startCamera.scale * (1 - turnProgress)) /
                    scale,
        },
        rotation: laneRotation * turnProgress,
        /** Zooming by a constant ratio each frame looks like a steady dive rather than a slowdown. */
        scale,
    };
}

/** When the galaxy map opens, the camera pulls back from the current star to the whole galaxy. */
function getZoomOutCamera({
    galaxy,
    run,
}: Readonly<{
    galaxy: Readonly<Galaxy>;
    run: Readonly<RunEntity>;
}>) {
    const progress = easeTransition(run.params.phaseElapsedMs / galaxyZoomOutMs);
    const scale = galaxyZoomOutStartScale ** (1 - progress);
    const star = assertWrap.isDefined(galaxy.stars[run.params.currentStarIndex]);

    return {
        focus: {
            x: star.x - ((star.x - screenCenter.x) * progress) / scale,
            y: star.y - ((star.y - screenCenter.y) * progress) / scale,
        },
        rotation: 0,
        scale,
    };
}

type GalaxyCamera = ReturnType<typeof getZoomOutCamera>;

/** How far a jump has moved on from the galaxy map to hyperspace, from 0 to 1. */
export function getJumpExitProgress(run: Readonly<RunEntity>) {
    return run.params.phase === RunPhase.Jump
        ? easeTransition((run.params.phaseElapsedMs / jumpMs - jumpTurnShare) / 0.25)
        : 0;
}

/** How far the build panels have faded in, which only starts once the galaxy map is gone. */
export function getJumpPanelProgress(run: Readonly<RunEntity>) {
    return easeTransition((run.params.phaseElapsedMs / jumpMs - jumpTurnShare - 0.25) / 0.3);
}

/** How far the ships have flown in from below the screen to their build panels, from 0 to 1. */
export function getJumpArrivalProgress(run: Readonly<RunEntity>) {
    const progress = clamp((run.params.phaseElapsedMs / jumpMs - 0.5) / 0.5, {
        max: 1,
        min: 0,
    });

    /** Eases out only, so the ships enter fast and slow into place instead of idling off screen. */
    return 1 - (1 - progress) ** 3;
}

/** Draws the galaxy map, and during a jump, dives the camera into the hyperlane. */
export function updateGalaxyMap({
    galaxyMap,
    run,
    timeMs,
}: Readonly<{
    galaxyMap: GalaxyMap;
    run: Readonly<RunEntity>;
    timeMs: number;
}>) {
    const galaxy = run.getGalaxy();
    const isJumping = run.params.phase === RunPhase.Jump;

    drawGalaxy({
        galaxy,
        galaxyMap,
        run,
    });

    /** A peer that joins mid jump never saw the zoom-out, so it dives from the whole galaxy. */
    const jumpStart = galaxyMap.jumpStart || {
        camera: {
            focus: screenCenter,
            scale: 1,
        },
        fadeAlpha: 1,
    };
    const camera = isJumping
        ? getJumpCamera({
              galaxy,
              run,
              startCamera: jumpStart.camera,
          })
        : getZoomOutCamera({
              galaxy,
              run,
          });

    /** Squared so the bright selected hyperlane doesn't linger over hyperspace. */
    galaxyMap.fade.alpha = isJumping
        ? jumpStart.fadeAlpha * (1 - getJumpExitProgress(run)) ** 2
        : easeTransition((run.params.phaseElapsedMs * 2) / galaxyZoomOutMs);

    if (!isJumping) {
        galaxyMap.jumpStart = {
            camera,
            fadeAlpha: galaxyMap.fade.alpha,
        };
    }

    galaxyMap.world.pivot.set(camera.focus.x, camera.focus.y);
    galaxyMap.world.position.set(screenCenter.x, screenCenter.y);
    galaxyMap.world.rotation = camera.rotation;
    galaxyMap.world.scale.set(camera.scale);

    galaxyMap.selectedRing.scale.set(1 + Math.sin(timeMs / 200) * 0.12);
    /** Each layer peaks in turn, and the weights always sum to 1 so the glow's brightness holds. */
    galaxyMap.glowLayers.forEach((glowLayer, layerIndex) => {
        glowLayer.alpha =
            (1 +
                Math.cos(2 * Math.PI * (timeMs / glowDriftCycleMs - layerIndex / glowLayerCount))) /
            glowLayerCount;
    });
}
