// cspell:word terran
import {CanvasSource, Color, Container, Graphics, Sprite, Texture} from '@antha/graphics-2d';
import {assertWrap} from '@augment-vir/assert';
import {clamp, createArray, SeededRandom, type Coords} from '@augment-vir/common';
import {getStarColor} from '../galaxy/galaxy-map.js';
import {createSystemStar} from '../galaxy/system-star.js';
import {gameWorldSize} from '../game-state/game-world.js';
import {type RunEntity} from '../run/run.entity.js';
import {easeTransition} from './scene-layout.js';

const backgroundStarCount = 220;
/** The nearest background stars scroll this fast. Farther ones are slower and dimmer. */
const backgroundStarMaxPxPerMs = 0.04;
/** How far the star's glow reaches, in star radii. */
const starGlowRadiusShare = 3.5;
/** How far a planet's ring reaches, in planet radii. */
const ringOuterRadiusShare = 2.2;
/** Canvas pixels per world pixel for planets. Higher is sharper but slower to paint. */
const planetResolution = 2;

type Rgb = ReadonlyArray<number>;

enum PlanetKind {
    Cratered = 'cratered',
    Desert = 'desert',
    GasGiant = 'gas-giant',
    Ice = 'ice',
    IceGiant = 'ice-giant',
    Lava = 'lava',
    Rocky = 'rocky',
    Terran = 'terran',
    Toxic = 'toxic',
}

/** A point on a unit sphere, facing the viewer at +z. */
type SpherePoint = Readonly<{x: number; y: number; z: number}>;

/** A seamless noise over a planet's surface, from 0 to 1, with `x` wrapping around the planet. */
function createSurfaceNoise(random: Readonly<SeededRandom>) {
    /** Whole cells around the planet so the noise wraps. More cells make smaller, busier features. */
    const gridHeight = 6 + Math.floor(random.next() * 15);
    const gridWidth = gridHeight * 2;
    const values = createArray(gridWidth * gridHeight, () => random.next());

    function getGridValue({x, y}: Readonly<Coords>) {
        return assertWrap.isDefined(
            values[
                (((y % gridHeight) + gridHeight) % gridHeight) * gridWidth +
                    (((x % gridWidth) + gridWidth) % gridWidth)
            ],
        );
    }

    function getOctave({x, y}: Readonly<Coords>) {
        const gridX = x * gridWidth;
        const gridY = y * gridHeight;
        const cellX = Math.floor(gridX);
        const cellY = Math.floor(gridY);
        const shareX = easeTransition(gridX - cellX);
        const shareY = easeTransition(gridY - cellY);
        const top =
            getGridValue({
                x: cellX,
                y: cellY,
            }) *
                (1 - shareX) +
            getGridValue({
                x: cellX + 1,
                y: cellY,
            }) *
                shareX;
        const bottom =
            getGridValue({
                x: cellX,
                y: cellY + 1,
            }) *
                (1 - shareX) +
            getGridValue({
                x: cellX + 1,
                y: cellY + 1,
            }) *
                shareX;

        return top * (1 - shareY) + bottom * shareY;
    }

    return (position: Readonly<Coords & {isSmooth?: boolean | undefined}>) => {
        if (position.isSmooth) {
            return (
                (getOctave(position) * 0.5 +
                    getOctave({
                        x: position.x * 2,
                        y: position.y * 2,
                    }) *
                        0.27) /
                0.77
            );
        }

        return (
            getOctave(position) * 0.5 +
            getOctave({
                x: position.x * 2,
                y: position.y * 2,
            }) *
                0.27 +
            getOctave({
                x: position.x * 4,
                y: position.y * 4,
            }) *
                0.15 +
            getOctave({
                x: position.x * 8,
                y: position.y * 8,
            }) *
                0.08
        );
    };
}

function hslToRgb(hsl: Readonly<{h: number; l: number; s: number}>) {
    return new Color(hsl).toRgbArray().map((value) => value * 255);
}

function mixRgb({from, share, to}: Readonly<{from: Rgb; share: number; to: Rgb}>) {
    return from.map((fromValue, index) => {
        return fromValue + (assertWrap.isDefined(to[index]) - fromValue) * share;
    });
}

/** Per planet features that keep two planets of the same kind from looking alike. */
function createPlanetTraits(random: Readonly<SeededRandom>) {
    return {
        bandCount: 6 + random.next() * 18,
        cloudiness: random.next(),
        craters: createArray(10 + Math.floor(random.next() * 25), () => {
            const y = random.next() * 2 - 1;
            const angle = random.next() * 2 * Math.PI;
            const ringRadius = Math.sqrt(1 - y * y);

            return {
                center: {
                    x: ringRadius * Math.cos(angle),
                    y,
                    z: ringRadius * Math.sin(angle),
                },
                /** Angular radius, in radians. */
                size: 0.04 + random.next() ** 2 * 0.3,
            };
        }),
        seaLevel: 0.38 + random.next() * 0.3,
        storm:
            random.next() < 0.5
                ? {
                      latitude: 0.25 + random.next() * 0.5,
                      longitude: random.next(),
                      size: 0.03 + random.next() * 0.05,
                  }
                : undefined,
    };
}

type PlanetTraits = ReturnType<typeof createPlanetTraits>;

/** Multiplies brightness for crater floors and rims at the given surface point. */
function getCraterShade({
    craters,
    point,
}: Readonly<{craters: PlanetTraits['craters']; point: SpherePoint}>) {
    return craters.reduce((shade, crater) => {
        const angle = Math.acos(
            Math.min(
                point.x * crater.center.x + point.y * crater.center.y + point.z * crater.center.z,
                1,
            ),
        );
        const share = angle / crater.size;

        if (share > 1.3) {
            return shade;
        }

        const rim = Math.max(1 - Math.abs(share - 1) / 0.25, 0);

        return shade * (share < 1 ? 0.78 + share * 0.12 : 1) * (1 + rim * 0.3);
    }, 1);
}

function getStormShare({
    latitude,
    longitude,
    storm,
}: Readonly<{latitude: number; longitude: number; storm: PlanetTraits['storm']}>) {
    if (!storm) {
        return 0;
    }

    const longitudeOffset = ((longitude - storm.longitude + 1.5) % 1) - 0.5;
    const distance = Math.hypot(longitudeOffset, (latitude - storm.latitude) * 1.6);

    return easeTransition((storm.size - distance) / (storm.size * 0.4));
}

const white: Rgb = [
    235,
    240,
    245,
];

const planetKinds: Readonly<
    Record<
        PlanetKind,
        Readonly<{
            /** Color of the glow along the planet's lit edge, if it has an atmosphere. */
            atmosphere: Rgb | undefined;
            pickColors: (random: Readonly<SeededRandom>) => ReadonlyArray<Rgb>;
            /** Colors a point on the surface. `glow` is light the surface gives off itself. */
            paintSurface: (
                params: Readonly<{
                    colors: ReadonlyArray<Rgb>;
                    latitude: number;
                    longitude: number;
                    noise: ReturnType<typeof createSurfaceNoise>;
                    point: SpherePoint;
                    traits: PlanetTraits;
                }>,
            ) => Readonly<{glow?: Rgb | undefined; lit: Rgb}>;
            ringChance: number;
            sizeShare: number;
        }>
    >
> = {
    [PlanetKind.Cratered]: {
        atmosphere: undefined,
        pickColors(random) {
            const hue = 20 + random.next() * 40;

            return [
                hslToRgb({
                    h: hue,
                    l: 30 + random.next() * 10,
                    s: 4 + random.next() * 10,
                }),
                hslToRgb({
                    h: hue,
                    l: 58 + random.next() * 12,
                    s: 4 + random.next() * 10,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise, point, traits}) {
            return {
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share: noise({
                        x: longitude,
                        y: latitude,
                    }),
                    to: assertWrap.isDefined(colors[1]),
                }).map((channel) => {
                    return (
                        channel *
                        getCraterShade({
                            craters: traits.craters,
                            point,
                        })
                    );
                }),
            };
        },
        ringChance: 0.08,
        sizeShare: 0.7,
    },
    [PlanetKind.Desert]: {
        atmosphere: [
            255,
            215,
            170,
        ],
        pickColors(random) {
            const hue = 18 + random.next() * 30;

            return [
                hslToRgb({
                    h: hue,
                    l: 38 + random.next() * 10,
                    s: 40 + random.next() * 25,
                }),
                hslToRgb({
                    h: hue + 8,
                    l: 65 + random.next() * 10,
                    s: 40 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise}) {
            const terrain = noise({
                x: longitude,
                y: latitude,
            });
            const dunes = Math.sin((latitude * 70 + terrain * 12) * Math.PI) * 0.5 + 0.5;

            return {
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share: easeTransition((terrain - 0.3) / 0.4),
                    to: assertWrap.isDefined(colors[1]),
                }).map((channel) => channel * (0.9 + dunes * 0.1)),
            };
        },
        ringChance: 0.05,
        sizeShare: 0.9,
    },
    [PlanetKind.GasGiant]: {
        atmosphere: [
            200,
            210,
            230,
        ],
        pickColors(random) {
            const hue = random.next() * 360;

            return [
                hslToRgb({
                    h: hue,
                    l: 40 + random.next() * 15,
                    s: 30 + random.next() * 40,
                }),
                hslToRgb({
                    h: hue + 15 + random.next() * 30,
                    l: 65 + random.next() * 15,
                    s: 20 + random.next() * 30,
                }),
                hslToRgb({
                    h: hue - 30 - random.next() * 30,
                    l: 45 + random.next() * 10,
                    s: 55 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise, traits}) {
            const turbulence = noise({
                x: longitude,
                y: latitude * 2,
            });
            const band =
                Math.sin((latitude * traits.bandCount + turbulence * 0.8) * Math.PI) * 0.5 + 0.5;

            return {
                lit: mixRgb({
                    from: mixRgb({
                        from: assertWrap.isDefined(colors[0]),
                        share: band,
                        to: assertWrap.isDefined(colors[1]),
                    }),
                    share: getStormShare({
                        latitude,
                        longitude,
                        storm: traits.storm,
                    }),
                    to: assertWrap.isDefined(colors[2]),
                }),
            };
        },
        ringChance: 0.55,
        sizeShare: 1.5,
    },
    [PlanetKind.Ice]: {
        atmosphere: [
            200,
            235,
            255,
        ],
        pickColors(random) {
            return [
                hslToRgb({
                    h: 185 + random.next() * 30,
                    l: 66 + random.next() * 10,
                    s: 20 + random.next() * 15,
                }),
                hslToRgb({
                    h: 200,
                    l: 92,
                    s: 20,
                }),
                hslToRgb({
                    h: 15 + random.next() * 20,
                    l: 40 + random.next() * 10,
                    s: 35 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise}) {
            /** Long, thin cracks like on Europa, where the noise crosses its middle. */
            const crack = easeTransition(
                1 -
                    Math.abs(
                        noise({
                            x: longitude * 2 + 0.5,
                            y: latitude * 2,
                        }) - 0.5,
                    ) /
                        0.012,
            );

            return {
                lit: mixRgb({
                    from: mixRgb({
                        from: assertWrap.isDefined(colors[0]),
                        share: noise({
                            x: longitude,
                            y: latitude,
                        }),
                        to: assertWrap.isDefined(colors[1]),
                    }),
                    share: crack * 0.7,
                    to: assertWrap.isDefined(colors[2]),
                }),
            };
        },
        ringChance: 0.1,
        sizeShare: 0.8,
    },
    [PlanetKind.IceGiant]: {
        atmosphere: [
            170,
            230,
            255,
        ],
        pickColors(random) {
            const hue = 170 + random.next() * 60;

            return [
                hslToRgb({
                    h: hue,
                    l: 45 + random.next() * 10,
                    s: 40 + random.next() * 25,
                }),
                hslToRgb({
                    h: hue + 10,
                    l: 65 + random.next() * 10,
                    s: 35 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise, traits}) {
            return {
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share:
                        0.35 +
                        Math.sin(
                            (latitude * traits.bandCount * 0.5 +
                                noise({
                                    x: longitude,
                                    y: latitude,
                                }) *
                                    0.4) *
                                Math.PI,
                        ) *
                            0.15,
                    to: assertWrap.isDefined(colors[1]),
                }),
            };
        },
        ringChance: 0.4,
        sizeShare: 1.25,
    },
    [PlanetKind.Lava]: {
        atmosphere: undefined,
        pickColors(random) {
            return [
                hslToRgb({
                    h: 10 + random.next() * 20,
                    l: 8 + random.next() * 6,
                    s: 10 + random.next() * 15,
                }),
                hslToRgb({
                    h: 20,
                    l: 22 + random.next() * 8,
                    s: 10,
                }),
                hslToRgb({
                    h: 10 + random.next() * 30,
                    l: 55,
                    s: 100,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise}) {
            const crack = easeTransition(
                1 -
                    Math.abs(
                        noise({
                            isSmooth: true,
                            x: longitude + 0.3,
                            y: latitude,
                        }) - 0.5,
                    ) /
                        0.025,
            );

            return {
                glow: assertWrap.isDefined(colors[2]).map((channel) => channel * crack),
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share: noise({
                        x: longitude,
                        y: latitude,
                    }),
                    to: assertWrap.isDefined(colors[1]),
                }),
            };
        },
        ringChance: 0,
        sizeShare: 0.75,
    },
    [PlanetKind.Rocky]: {
        atmosphere: undefined,
        pickColors(random) {
            const hue = random.next() * 40;

            return [
                hslToRgb({
                    h: hue,
                    l: 22 + random.next() * 10,
                    s: 15 + random.next() * 25,
                }),
                hslToRgb({
                    h: hue + 10,
                    l: 50 + random.next() * 15,
                    s: 15 + random.next() * 25,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise}) {
            return {
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share: easeTransition(
                        (noise({
                            x: longitude,
                            y: latitude,
                        }) -
                            0.3) /
                            0.4,
                    ),
                    to: assertWrap.isDefined(colors[1]),
                }),
            };
        },
        ringChance: 0,
        sizeShare: 0.85,
    },
    [PlanetKind.Terran]: {
        atmosphere: [
            120,
            180,
            255,
        ],
        pickColors(random) {
            return [
                hslToRgb({
                    h: 195 + random.next() * 35,
                    l: 25 + random.next() * 12,
                    s: 55 + random.next() * 15,
                }),
                hslToRgb({
                    h: 30 + random.next() * 100,
                    l: 28 + random.next() * 12,
                    s: 30 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise, traits}) {
            const land = easeTransition(
                (noise({
                    x: longitude,
                    y: latitude,
                }) -
                    traits.seaLevel) /
                    0.05,
            );
            const clouds = easeTransition(
                (noise({
                    x: longitude * 1.7 + 0.37,
                    y: latitude * 1.3 + 0.21,
                }) -
                    0.65 +
                    traits.cloudiness * 0.2) /
                    0.12,
            );
            const ice = easeTransition((Math.abs(latitude - 0.5) - 0.4) / 0.04);

            return {
                lit: mixRgb({
                    from: mixRgb({
                        from: assertWrap.isDefined(colors[0]),
                        share: land,
                        to: assertWrap.isDefined(colors[1]),
                    }),
                    share: Math.max(clouds * 0.85, ice),
                    to: white,
                }),
            };
        },
        ringChance: 0.05,
        sizeShare: 1,
    },
    [PlanetKind.Toxic]: {
        atmosphere: [
            220,
            240,
            140,
        ],
        pickColors(random) {
            const hue = 50 + random.next() * 50;

            return [
                hslToRgb({
                    h: hue,
                    l: 35 + random.next() * 10,
                    s: 45 + random.next() * 25,
                }),
                hslToRgb({
                    h: hue + 20,
                    l: 60 + random.next() * 10,
                    s: 40 + random.next() * 20,
                }),
            ];
        },
        paintSurface({colors, latitude, longitude, noise}) {
            /** Warps the noise by itself so the clouds swirl. */
            const warp = noise({
                x: longitude,
                y: latitude,
            });

            return {
                lit: mixRgb({
                    from: assertWrap.isDefined(colors[0]),
                    share: easeTransition(
                        (noise({
                            x: longitude + warp * 0.35,
                            y: latitude * 1.5 + warp * 0.25,
                        }) -
                            0.3) /
                            0.4,
                    ),
                    to: assertWrap.isDefined(colors[1]),
                }),
            };
        },
        ringChance: 0.05,
        sizeShare: 1,
    },
};

function paintTexture({
    paintPixel,
    resolution = 1,
    size,
}: Readonly<{
    /** Returns straight alpha RGBA from 0 to 255, given a position from -1 to 1 across the canvas. */
    paintPixel: (position: Readonly<Coords>) => ReadonlyArray<number>;
    /**
     * Canvas pixels per world pixel. The viewport scales the world up to fit the screen, so sharp
     * edges need more than one.
     */
    resolution?: number | undefined;
    /** Width and height in world pixels. */
    size: number;
}>) {
    const canvas = document.createElement('canvas');
    const context = assertWrap.isDefined(canvas.getContext('2d'));
    const canvasSize = Math.ceil(size * resolution);

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const image = context.createImageData(canvasSize, canvasSize);

    createArray(canvasSize * canvasSize, (index) => index).forEach((index) => {
        const pixel = paintPixel({
            x: ((index % canvasSize) + 0.5) / (canvasSize / 2) - 1,
            y: (Math.floor(index / canvasSize) + 0.5) / (canvasSize / 2) - 1,
        });

        image.data.set(pixel, index * 4);
    });
    context.putImageData(image, 0, 0);

    return new Texture({
        source: new CanvasSource({
            resolution,
            resource: canvas,
        }),
    });
}

/** Lays straight alpha `top` over `bottom`. */
function blendOver({
    bottom,
    top,
}: Readonly<{
    bottom: ReadonlyArray<number>;
    top: ReadonlyArray<number>;
}>) {
    const topAlpha = assertWrap.isDefined(top[3]) / 255;
    const bottomAlpha = assertWrap.isDefined(bottom[3]) / 255;
    const alpha = topAlpha + bottomAlpha * (1 - topAlpha);

    if (!alpha) {
        return [
            0,
            0,
            0,
            0,
        ];
    }

    return [
        ...createArray(3, (channel) => {
            return (
                (assertWrap.isDefined(top[channel]) * topAlpha +
                    assertWrap.isDefined(bottom[channel]) * bottomAlpha * (1 - topAlpha)) /
                alpha
            );
        }),
        alpha * 255,
    ];
}

/**
 * Paints a planet as a sphere lit by the system's star, which is ahead of the ships, so the lit
 * side faces up the screen. The texture spans the planet's ring, or just past its atmosphere.
 */
function paintPlanet({
    kind,
    lightDirection,
    random,
    radius,
}: Readonly<{
    kind: PlanetKind;
    /** Points from the planet toward the star, with +y down the screen and +z out of it. */
    lightDirection: Readonly<{x: number; y: number; z: number}>;
    random: Readonly<SeededRandom>;
    radius: number;
}>) {
    const colors = planetKinds[kind].pickColors(random);
    const noise = createSurfaceNoise(random);
    const traits = createPlanetTraits(random);
    const atmosphereColor = planetKinds[kind].atmosphere;
    const hasRing = random.next() < planetKinds[kind].ringChance;
    const ringInnerRadiusShare = 1.25 + random.next() * 0.4;
    const ringTilt = 0.18 + random.next() * 0.2;
    const axisTilt = (random.next() - 0.5) * 0.6;
    const spin = random.next();
    /** The texture's half width, in planet radii. */
    const extent = hasRing ? ringOuterRadiusShare : 1.15;
    const lightLength = Math.hypot(lightDirection.x, lightDirection.y, lightDirection.z);
    const light = {
        x: lightDirection.x / lightLength,
        y: lightDirection.y / lightLength,
        z: lightDirection.z / lightLength,
    };
    const ringColor = mixRgb({
        from: mixRgb({
            from: assertWrap.isDefined(colors[0]),
            share: random.next(),
            to: assertWrap.isDefined(colors[1]),
        }),
        share: random.next() * 0.5,
        to: white,
    });

    function getRingPixel({x, y}: Readonly<Coords>) {
        const ringRadius = Math.hypot(x, y / ringTilt);

        if (ringRadius < ringInnerRadiusShare || ringRadius > ringOuterRadiusShare) {
            return undefined;
        }

        const ringNoise = noise({
            x: 0,
            y: ringRadius * 0.7,
        });
        const edgeFade =
            easeTransition((ringRadius - ringInnerRadiusShare) / 0.1) *
            easeTransition((ringOuterRadiusShare - ringRadius) / 0.15);

        return [
            ...ringColor.map((channel) => channel * (0.5 + ringNoise * 0.5)),
            255 * edgeFade * (0.25 + ringNoise * 0.55),
        ];
    }

    /** Colors a point on the disk, given its position before (`x`, `y`) and after tilting. */
    function paintPlanetSurface({
        tiltedX,
        tiltedY,
        x,
        y,
    }: Readonly<{
        tiltedX: number;
        tiltedY: number;
        x: number;
        y: number;
    }>) {
        const depth = Math.sqrt(Math.max(1 - x * x - y * y, 0));
        const lightDot = x * light.x + y * light.y + depth * light.z;
        /** A soft terminator rather than a hard line between day and night. */
        const brightness =
            0.03 + easeTransition((lightDot + 0.08) / 0.4) * (0.45 + 0.6 * Math.max(lightDot, 0));
        const surface = planetKinds[kind].paintSurface({
            colors,
            latitude: (tiltedY + 1) / 2,
            longitude: (Math.atan2(tiltedX, depth) / (2 * Math.PI) + 0.5 + spin) % 1,
            noise,
            point: {
                x: tiltedX,
                y: tiltedY,
                z: depth,
            },
            traits,
        });
        const rim = atmosphereColor
            ? (1 - depth) ** 3 * easeTransition((lightDot + 0.25) / 0.5) * 0.7
            : 0;

        return mixRgb({
            from: surface.lit.map((channel) => channel * brightness),
            share: rim,
            to: atmosphereColor ?? surface.lit,
        }).map((channel, index) => {
            return Math.min(channel + (surface.glow?.[index] ?? 0), 255);
        });
    }

    return {
        extent,
        texture: paintTexture({
            resolution: planetResolution,
            size: radius * extent * 2,
            paintPixel(position) {
                const x = position.x * extent;
                const y = position.y * extent;
                const distance = Math.hypot(x, y);
                /** How much of this canvas pixel the disk covers, so its edge is smooth. */
                const coverage = clamp((1 - distance) * radius * planetResolution + 0.5, {
                    max: 1,
                    min: 0,
                });
                /** Turns the planet so its poles and ring lean with its axis. */
                const tiltedX = x * Math.cos(axisTilt) + y * Math.sin(axisTilt);
                const tiltedY = y * Math.cos(axisTilt) - x * Math.sin(axisTilt);
                const ringPixel = hasRing
                    ? getRingPixel({
                          x: tiltedX,
                          y: tiltedY,
                      })
                    : undefined;
                /** How much the edge at this angle faces the star. */
                const facing = distance ? (x * light.x + y * light.y) / distance : 0;
                const halo =
                    atmosphereColor && distance < 1.15
                        ? [
                              ...atmosphereColor,
                              255 *
                                  (1 - (Math.max(distance, 1) - 1) / 0.15) ** 2 *
                                  easeTransition((facing + 0.3) / 0.8) *
                                  0.55,
                          ]
                        : [
                              0,
                              0,
                              0,
                              0,
                          ];
                /** Edge pixels just past the rim sample the surface just inside it. */
                const surfaceScale = Math.min(1, 0.999 / distance);
                const body = coverage
                    ? blendOver({
                          bottom: halo,
                          top: [
                              ...paintPlanetSurface({
                                  tiltedX: tiltedX * surfaceScale,
                                  tiltedY: tiltedY * surfaceScale,
                                  x: x * surfaceScale,
                                  y: y * surfaceScale,
                              }),
                              255 * coverage,
                          ],
                      })
                    : halo;

                if (!ringPixel) {
                    return body;
                }

                /** Only the half of the ring nearer the viewer passes in front of the planet. */
                return tiltedY > 0
                    ? blendOver({
                          bottom: body,
                          top: ringPixel,
                      })
                    : blendOver({
                          bottom: ringPixel,
                          top: body,
                      });
            },
        }),
    };
}

/** Turns `radians` into the same angle between -π and π. */
function normalizeAngle(radians: number) {
    return radians - 2 * Math.PI * Math.round(radians / (2 * Math.PI));
}

/**
 * A small, sharp disk over a wide additive glow with a bright corona and faint streamers, so the
 * star reads as far away but still blazing.
 */
function paintStar({
    color,
    radius,
    random,
}: Readonly<{
    color: Color;
    radius: number;
    random: Readonly<SeededRandom>;
}>) {
    const rgb = color.toRgbArray().map((value) => value * 255);
    /** Leaves room for the smoothed edge. */
    const discSize = radius * 2 + 4;
    /** Wisps of plasma, each its own width, length, and curl, so no two stars' coronas match. */
    const streamers = createArray(14 + Math.floor(random.next() * 14), () => {
        return {
            angle: random.next() * 2 * Math.PI,
            /** How far the streamer bends sideways as it leaves the star, in radians per radius. */
            curl: (random.next() - 0.5) * 0.6,
            /** In star radii. */
            length: 0.35 + random.next() ** 2 * 1.2,
            strength: 0.3 + random.next() * 0.7,
            width: 0.03 + random.next() * 0.12,
        };
    });
    /** Bulges the corona out further on some sides than others. */
    const coronaLumps = createArray(3, (lumpIndex) => {
        return {
            amount: random.next() * 0.25,
            frequency: lumpIndex + 2,
            phase: random.next() * 2 * Math.PI,
        };
    });
    const disc = new Sprite(
        paintTexture({
            resolution: 3,
            size: discSize,
            paintPixel(position) {
                const distance = (Math.hypot(position.x, position.y) * discSize) / 2 / radius;
                /** Limb darkening: stars look dimmer and redder toward their edge. */
                const depth = Math.sqrt(Math.max(1 - distance * distance, 0));

                return [
                    ...mixRgb({
                        from: rgb.map((channel) => channel * (0.75 + 0.25 * depth)),
                        share: depth ** 2 * 0.6,
                        to: [
                            255,
                            255,
                            250,
                        ],
                    }),
                    255 * Math.min(Math.max((1 - distance) * radius * 3 + 0.5, 0), 1),
                ];
            },
        }),
    );
    /** Paints a soft layer of the glow around the disc, from how bright it is at each spot. */
    function paintGlowLayer(
        getIntensity: (
            params: Readonly<{
                angle: number;
                outside: number;
            }>,
        ) => number,
    ) {
        const sprite = new Sprite(
            paintTexture({
                /** The glow is soft, so half resolution looks the same and paints faster. */
                resolution: 0.5,
                size: radius * starGlowRadiusShare * 2,
                paintPixel(position) {
                    const distance = Math.hypot(position.x, position.y) * starGlowRadiusShare;
                    const outside = Math.max(distance - 1, 0);
                    const edgeFade = Math.max(1 - distance / starGlowRadiusShare, 0) ** 2;
                    const corona = Math.exp(-outside * 3.5);

                    return [
                        ...mixRgb({
                            from: rgb,
                            share: corona * 0.5,
                            to: [
                                255,
                                255,
                                255,
                            ],
                        }),
                        255 *
                            Math.min(
                                getIntensity({
                                    angle: Math.atan2(position.y, position.x),
                                    outside,
                                }) * edgeFade,
                                1,
                            ),
                    ];
                },
            }),
        );

        sprite.blendMode = 'add';

        return sprite;
    }

    const corona = paintGlowLayer(({angle, outside}) => {
        const lumpiness = coronaLumps.reduce((total, {amount, frequency, phase}) => {
            return total + amount * Math.sin(angle * frequency + phase);
        }, 1);

        return Math.exp((-outside * 2.6) / lumpiness) * 0.6 + 0.06;
    });
    /**
     * The rays are split across layers that turn in opposite directions and pulse out of step, so
     * their overlap keeps shifting.
     */
    const rayLayers = [
        streamers.filter((streamer, streamerIndex) => streamerIndex % 2),
        streamers.filter((streamer, streamerIndex) => !(streamerIndex % 2)),
    ].map((layerStreamers, layerIndex) => {
        return {
            pulsePhase: random.next() * 2 * Math.PI,
            pulsePeriodMs: 7000 + random.next() * 6000,
            radiansPerMs: (layerIndex ? -1 : 1) * (0.00001 + random.next() * 0.00002),
            sprite: paintGlowLayer(({angle, outside}) => {
                return layerStreamers.reduce((total, streamer) => {
                    const angleOffset = normalizeAngle(
                        angle - streamer.angle - streamer.curl * outside,
                    );

                    return (
                        total +
                        streamer.strength *
                            0.9 *
                            Math.exp(-((angleOffset / streamer.width) ** 2)) *
                            Math.exp(-outside / streamer.length)
                    );
                }, 0);
            }),
        };
    });
    const coronaPulsePeriodMs = 9000 + random.next() * 6000;
    const view = new Container();

    [
        corona,
        ...rayLayers.map((layer) => layer.sprite),
        disc,
    ].forEach((sprite) => {
        sprite.anchor.set(0.5);
        view.addChild(sprite);
    });

    return {
        animate(timeMs: number) {
            const coronaPulse = Math.sin((2 * Math.PI * timeMs) / coronaPulsePeriodMs);

            corona.scale.set(1 + coronaPulse * 0.05);
            corona.alpha = 0.85 + coronaPulse * 0.15;
            rayLayers.forEach((layer) => {
                layer.sprite.rotation = timeMs * layer.radiansPerMs;
                layer.sprite.alpha =
                    0.65 +
                    0.35 *
                        Math.sin((2 * Math.PI * timeMs) / layer.pulsePeriodMs + layer.pulsePhase);
            });
        },
        view,
    };
}

/**
 * The distant stars, planets, and system star drawn behind the fly view. Everything here comes from
 * its own seeds so drawing it never touches the synchronized random state.
 */
export function createSystemScenery() {
    const random = SeededRandom.fromSeed('starfield');
    const container = new Container();
    const backgroundGraphics = new Graphics();

    container.addChild(backgroundGraphics);

    return {
        backgroundGraphics,
        backgroundStars: createArray(backgroundStarCount, () => {
            const nearness = random.next();

            return {
                alpha: 0.06 + nearness * 0.24,
                nearness,
                radius: 0.6 + nearness * 1.1,
                x: random.next() * gameWorldSize.width,
                y: random.next() * gameWorldSize.height,
            };
        }),
        /** Keeps running while the scrolling is paused, so the star's corona never freezes. */
        animationMs: 0,
        container,
        scrollMs: 0,
        system: undefined as ReturnType<typeof createSystem> | undefined,
    };
}

export type SystemScenery = ReturnType<typeof createSystemScenery>;

function getSystemKey(run: Readonly<RunEntity>) {
    return [
        run.params.galaxySeed,
        run.params.currentStarIndex,
    ].join(':');
}

function createSystem(run: Readonly<RunEntity>) {
    const key = getSystemKey(run);
    const {
        radius: starRadius,
        random,
        x: starX,
    } = createSystemStar({
        galaxySeed: run.params.galaxySeed,
        starIndex: run.params.currentStarIndex,
    });
    const star = {
        radius: starRadius,
        ...paintStar({
            color: getStarColor(run.getSystemDifficulty()),
            radius: starRadius,
            random,
        }),
        x: starX,
    };

    return {
        key,
        planets: createArray(1 + Math.floor(random.next() * 3), () => {
            /** Nearer planets scroll faster and look bigger. */
            const nearness = random.next();
            const kinds = Object.values(PlanetKind);
            const kind = assertWrap.isDefined(kinds[Math.floor(random.next() * kinds.length)]);
            const radius = (22 + nearness * 45 + random.next() * 20) * planetKinds[kind].sizeShare;
            const x = radius + random.next() * (gameWorldSize.width - radius * 2);
            const painted = paintPlanet({
                kind,
                lightDirection: {
                    x: (starX - x) / gameWorldSize.width,
                    y: -1,
                    z: 0.35,
                },
                radius,
                random,
            });
            const sprite = new Sprite(painted.texture);

            sprite.anchor.set(0.5);

            return {
                extent: painted.extent,
                /** Share of the trip to the star when the planet passes the bottom of the screen. */
                passShare: 0.1 + random.next() * 0.6,
                radius,
                speedShare: 0.5 + nearness * 0.4,
                sprite,
                x,
            };
        }),
        star,
    };
}

function destroySystem(system: Readonly<ReturnType<typeof createSystem>>) {
    [
        system.star.view,
        ...system.planets.map((planet) => planet.sprite),
    ].forEach((view) => {
        view.destroy({
            children: true,
            texture: true,
            textureSource: true,
        });
    });
}

/**
 * Scrolls the background stars at their own speeds and moves the system's planets and star toward
 * the bottom of the screen as the ships close in on the star.
 */
export function updateSystemScenery({
    isScrolling,
    msSinceLastExecute,
    run,
    scenery,
}: Readonly<{
    isScrolling: boolean;
    msSinceLastExecute: number;
    run: Readonly<RunEntity>;
    scenery: SystemScenery;
}>) {
    scenery.animationMs += msSinceLastExecute;
    if (isScrolling) {
        scenery.scrollMs += msSinceLastExecute;
    }

    if (scenery.system?.key !== getSystemKey(run)) {
        if (scenery.system) {
            destroySystem(scenery.system);
        }

        scenery.system = createSystem(run);
        scenery.container.addChild(
            scenery.system.star.view,
            ...scenery.system.planets.map((planet) => planet.sprite),
        );
    }

    const starDistancePx = run.getWave().starDistancePx;
    const travelPx = run.params.systemTravelPx;

    scenery.backgroundGraphics.clear();
    scenery.backgroundStars.forEach((star) => {
        const speedPxPerMs = backgroundStarMaxPxPerMs * (0.15 + star.nearness * 0.85);

        scenery.backgroundGraphics
            .circle(
                star.x,
                (star.y + scenery.scrollMs * speedPxPerMs) % gameWorldSize.height,
                star.radius,
            )
            .fill({
                alpha: star.alpha,
                color: '#ffffff',
            });
    });

    scenery.system.star.animate(scenery.animationMs);
    scenery.system.star.view.position.set(
        scenery.system.star.x,
        gameWorldSize.height - (starDistancePx - travelPx),
    );
    scenery.system.planets.forEach((planet) => {
        planet.sprite.position.set(
            planet.x,
            gameWorldSize.height +
                planet.radius +
                (travelPx - planet.passShare * starDistancePx) * planet.speedShare,
        );
    });
}
