import {Container, Graphics, PixiApplication, Text, type Ticker} from '@antha/graphics-2d';
import {check} from '@augment-vir/assert';
import {getEnumValues} from '@augment-vir/common';
import {
    bulletRadius,
    BulletSide,
    createBulletGraphics,
    missileSpeedFactor,
} from '../bullet/bullet.entity.js';
import {PlayerColor} from '../player/player-profile.js';
import {specialPartTitles} from '../scene/game-scene.mod.js';
import {getShieldCapacity, ShieldOwner} from '../ship/shield.js';
import {CellKind, defaultCellFacings, getMaxCellHp, maxCellHp} from '../ship/ship-cell.js';
import {flyCellSize, gunStats, isLaserFiring, toWorldVector} from '../ship/ship-fly.js';
import {
    drawLaserBeams,
    drawShieldBubbles,
    drawShipCells,
    playerBulletSpeedPxPerMs,
    shipViewCellSize,
} from '../ship/ship.entity.js';

const columnWidth = 90;
const columnHeight = 280;
/** In screen pixels, under each column's part. */
const infoHeight = 120;
/** Parts are tiny at their in-game size, so the whole view is drawn bigger. */
const zoom = 2;

/** What leveling a part up adds on top of its hp. */
const levelUpExtras: Readonly<Record<CellKind, string | undefined>> = {
    [CellKind.Hull]: undefined,
    [CellKind.Cockpit]: '+grid size',
    [CellKind.Gun]: '+1 damage',
    [CellKind.RapidGun]: '+1 damage',
    [CellKind.Shield]: '+shield strength',
    [CellKind.SpreadGun]: '+1 damage per bullet',
    [CellKind.Thruster]: '+speed',
    [CellKind.Magnet]: '+magnet range',
    [CellKind.MissileLauncher]: '+1 damage',
    [CellKind.NovaGun]: '+1 damage per bullet',
    [CellKind.Laser]: '+1 damage per pulse',
};

function getLevelUpText(kind: CellKind) {
    return [
        'Level up:',
        `+${maxCellHp[kind]} hp`,
        levelUpExtras[kind],
    ]
        .filter(check.isTruthy)
        .join('\n');
}

function createInfoText({
    color,
    fontSize,
    text,
    y,
}: Readonly<{
    color: string;
    fontSize: number;
    text: string;
    y: number;
}>) {
    return new Text({
        anchor: {
            x: 0.5,
            y: 0,
        },
        style: {
            align: 'center',
            fill: color,
            fontFamily: 'sans-serif',
            fontSize,
            wordWrap: true,
            wordWrapWidth: columnWidth * zoom - 16,
        },
        text,
        x: (columnWidth * zoom) / 2,
        y,
    });
}

/**
 * Draws a hull block and every special part side by side at their flying size, each gun firing on
 * its real interval and bullet speed. Returns a function that tears the view down.
 */
export async function createDebugPartsScene(parent: Readonly<Pick<Element, 'append'>>) {
    const pixiApplication = new PixiApplication();

    await pixiApplication.init({
        antialias: true,
        background: '#05060a',
        height: columnHeight * zoom + infoHeight,
        width: getEnumValues(CellKind).length * columnWidth * zoom,
    });
    parent.append(pixiApplication.canvas);

    const columns = getEnumValues(CellKind).map((kind, columnIndex) => {
        const column = new Container({
            x: columnIndex * columnWidth * zoom,
        });
        const world = new Container({
            scale: zoom,
        });
        const bulletsLayer = new Container();
        const cellCenter = {
            x: columnWidth / 2,
            y: columnHeight - flyCellSize * 2,
        };
        const cells = [
            {
                facing: defaultCellFacings[kind],
                hp: getMaxCellHp({
                    kind,
                    level: 1,
                }),
                kind,
                level: 1,
                x: 0,
                y: 0,
            },
        ];
        const part = new Container();
        const laserGraphics = new Graphics();
        const cellGraphics = new Graphics();
        const shieldGraphics = new Graphics();

        drawShipCells({
            alpha: 1,
            cells,
            graphics: cellGraphics,
            hullColor: PlayerColor.Blue,
        });

        if (kind === CellKind.Shield) {
            drawShieldBubbles({
                cells,
                graphics: shieldGraphics,
                owner: ShieldOwner.Player,
                shields: [
                    {
                        energy: getShieldCapacity({
                            level: 1,
                            owner: ShieldOwner.Player,
                        }),
                        isBroken: false,
                        msSinceHit: 0,
                        x: 0,
                        y: 0,
                    },
                ],
            });
        }

        part.addChild(laserGraphics, cellGraphics, shieldGraphics);
        /** Ship view space has +y up, so cell (0, 0) is centered on this point. */
        part.pivot.set(shipViewCellSize / 2, -shipViewCellSize / 2);
        part.scale.set(flyCellSize / shipViewCellSize);
        part.position.set(cellCenter.x, cellCenter.y);

        world.addChild(bulletsLayer, part);
        world.mask = new Graphics().rect(0, 0, columnWidth, columnHeight).fill('#ffffff');
        world.addChild(world.mask);
        column.addChild(
            new Graphics().rect(0, 0, columnWidth * zoom, columnHeight * zoom + infoHeight).stroke({
                color: '#1f2638',
                width: 2,
            }),
            world,
            createInfoText({
                color: '#ffffff',
                fontSize: 16,
                text: specialPartTitles[kind] || 'Hull',
                y: columnHeight * zoom,
            }),
            createInfoText({
                color: '#9aa6c2',
                fontSize: 14,
                text: `${getMaxCellHp({
                    kind,
                    level: 1,
                })} hp`,
                y: columnHeight * zoom + 26,
            }),
            createInfoText({
                color: '#9aa6c2',
                fontSize: 13,
                text: getLevelUpText(kind),
                y: columnHeight * zoom + 50,
            }),
        );
        pixiApplication.stage.addChild(column);

        return {
            bulletsLayer,
            cellCenter,
            cells,
            kind,
            laserGraphics,
        };
    });
    const bullets: {
        graphics: Graphics;
        velocityX: number;
        velocityY: number;
    }[] = [];
    const timing = {
        gunElapsedMs: 0,
    };

    /** Same firing rule as a flying ship: a gun fires whenever the clock crosses its interval. */
    function step(ticker: Readonly<Pick<Ticker, 'deltaMS'>>) {
        const previousGunElapsedMs = timing.gunElapsedMs;

        timing.gunElapsedMs += ticker.deltaMS;

        columns.forEach(({bulletsLayer, cellCenter, cells, kind, laserGraphics}) => {
            const stats = gunStats[kind];

            if (kind === CellKind.Laser) {
                drawLaserBeams({
                    beams: isLaserFiring(timing.gunElapsedMs)
                        ? [
                              {
                                  lengthPx: cellCenter.y,
                                  x: 0,
                                  y: 0,
                              },
                          ]
                        : [],
                    cells,
                    graphics: laserGraphics.clear(),
                });
            }

            if (
                !stats ||
                Math.floor(timing.gunElapsedMs / stats.fireIntervalMs) <=
                    Math.floor(previousGunElapsedMs / stats.fireIntervalMs)
            ) {
                return;
            }

            stats.bulletAngles.forEach((angle) => {
                const worldVector = toWorldVector({
                    angle,
                    direction: defaultCellFacings[kind],
                });
                const isMissile = !!stats.isMissile;
                const speed = playerBulletSpeedPxPerMs * (isMissile ? missileSpeedFactor : 1);
                const graphics = createBulletGraphics({
                    isMissile,
                    side: BulletSide.Player,
                });

                graphics.position.set(cellCenter.x, cellCenter.y);
                graphics.rotation = Math.atan2(worldVector.y, worldVector.x);
                bulletsLayer.addChild(graphics);
                bullets.push({
                    graphics,
                    velocityX: worldVector.x * speed,
                    velocityY: worldVector.y * speed,
                });
            });
        });

        bullets.forEach((bullet) => {
            bullet.graphics.x += bullet.velocityX * ticker.deltaMS;
            bullet.graphics.y += bullet.velocityY * ticker.deltaMS;
        });

        const goneBullets = bullets.filter((bullet) => {
            return (
                bullet.graphics.x < -bulletRadius ||
                bullet.graphics.y < -bulletRadius ||
                bullet.graphics.x > columnWidth + bulletRadius ||
                bullet.graphics.y > columnHeight + bulletRadius
            );
        });

        goneBullets.forEach((bullet) => {
            bullets.splice(bullets.indexOf(bullet), 1);
            bullet.graphics.destroy();
        });
    }

    pixiApplication.ticker.add(step);

    return () => {
        pixiApplication.destroy(true, {
            children: true,
        });
    };
}
