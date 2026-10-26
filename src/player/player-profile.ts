import {assertWrap} from '@augment-vir/assert';
import {getEnumValues, randomString} from '@augment-vir/common';
import {defineShape, enumShape, pickShape} from 'object-shape-tester';
import {createNewPilotProgress, pilotProgressShape} from './pilot-progress.js';

export enum PlayerColor {
    Blue = '#3d7eff',
    Cyan = '#14d7fe',
    Green = '#30d158',
    Orange = '#ff9f0a',
    Pink = '#ff2d55',
    Purple = '#bf5af2',
    Yellow = '#ffd60a',
    Lime = '#8db600',
}

export const maxPlayerProfileNameLength = 16;

export const playerProfileShape = defineShape({
    color: enumShape(PlayerColor),
    /** Only identifies the profile within the local save data. It is never sent to peers. */
    id: '',
    name: '',
    progress: pilotProgressShape,
});

export type PlayerProfile = typeof playerProfileShape.runtimeType;

/** The parts of a {@link PlayerProfile} that peers see. */
export const sharedPlayerProfileShape = pickShape(playerProfileShape, {
    color: true,
    name: true,
});

export type SharedPlayerProfile = typeof sharedPlayerProfileShape.runtimeType;

/** Picks the first color that no existing profile uses, wrapping around once every color is used. */
function selectUnusedPlayerColor(existingProfiles: ReadonlyArray<Readonly<PlayerProfile>>) {
    const playerColors = getEnumValues(PlayerColor);

    return (
        playerColors.find((playerColor) => {
            return existingProfiles.every((profile) => profile.color !== playerColor);
        }) ?? assertWrap.isDefined(playerColors[existingProfiles.length % playerColors.length])
    );
}

/** Matches the "Pilot N" names that {@link createPlayerProfile} gives new profiles. */
export function isDefaultPlayerProfileName(name: string) {
    return /^Pilot \d+$/.test(name);
}

/** Creates a profile named "Pilot N", with the first color that the existing profiles don't use. */
export function createPlayerProfile(existingProfiles: ReadonlyArray<Readonly<PlayerProfile>>) {
    return {
        color: selectUnusedPlayerColor(existingProfiles),
        id: randomString(),
        name: [
            'Pilot',
            existingProfiles.length + 1,
        ].join(' '),
        progress: createNewPilotProgress(),
    } satisfies PlayerProfile;
}

export function getNextPlayerColor(playerColor: PlayerColor) {
    const playerColors = getEnumValues(PlayerColor);

    return assertWrap.isDefined(
        playerColors[(playerColors.indexOf(playerColor) + 1) % playerColors.length],
    );
}

/** Trims and shortens a typed name, falling back to `fallbackName` when nothing is left. */
export function sanitizePlayerProfileName({
    fallbackName,
    name,
}: Readonly<{
    fallbackName: string;
    name: string;
}>) {
    return name.trim().slice(0, maxPlayerProfileNameLength) || fallbackName;
}
