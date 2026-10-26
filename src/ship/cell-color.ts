import {CellKind} from './ship-cell.js';

const cellColors: Readonly<Record<CellKind, (hullColor: string) => string>> = {
    [CellKind.Hull](hullColor) {
        return hullColor;
    },
    [CellKind.Cockpit]() {
        return '#ffffff';
    },
    [CellKind.Gun]() {
        return '#ff453a';
    },
    [CellKind.RapidGun]() {
        return '#30d158';
    },
    [CellKind.Shield]() {
        return '#64d2ff';
    },
    [CellKind.SpreadGun]() {
        return '#bf5af2';
    },
    [CellKind.Thruster]() {
        return '#ff9f0a';
    },
    [CellKind.Magnet]() {
        return '#8e8e93';
    },
    [CellKind.MissileLauncher]() {
        return '#ffd60a';
    },
    [CellKind.NovaGun]() {
        return '#ff2d92';
    },
    [CellKind.Laser]() {
        return '#0a84ff';
    },
};

/** Hull takes on its owner's color so each ship and enemy is recognizable. */
export function getCellColor({
    hullColor,
    kind,
}: Readonly<{
    hullColor: string;
    kind: CellKind;
}>) {
    return cellColors[kind](hullColor);
}
