import {
    getGamepadInputIcons,
    getGamepadStickIcon,
    keyboardInputIcons,
    KnownInput,
    mouseInputIcons,
    type GamepadStickInput,
} from '@antha/gamepad-type';
import {
    InputDeviceType,
    type ActiveBindings,
    type AnthaDeviceKey,
    type BindingAssignment,
    type BindingAssignments,
} from '@antha/input';
import {check} from '@augment-vir/assert';
import {getObjectTypedValues} from '@augment-vir/common';
import {defineShape, enumShape, optionalShape} from 'object-shape-tester';
import {type ViraIconSvg} from 'vira';
import {type GameBinding} from './player-binding.js';

/** The device a local player last pressed one of their bindings on. */
export const playerInputDeviceShape = defineShape({
    /** The mapped gamepad model. Only meaningful for gamepads. */
    deviceName: '',
    deviceType: enumShape(InputDeviceType),
    gamepadBrand: optionalShape('', {
        alsoUndefined: true,
    }),
});

export type PlayerInputDevice = typeof playerInputDeviceShape.runtimeType;

const assignmentDeviceTypes: Readonly<Record<AnthaDeviceKey, InputDeviceType>> = {
    '0': InputDeviceType.Gamepad,
    '1': InputDeviceType.Gamepad,
    '2': InputDeviceType.Gamepad,
    '3': InputDeviceType.Gamepad,
    'any-gamepad': InputDeviceType.Gamepad,
    keyboard: InputDeviceType.Keyboard,
    mouse: InputDeviceType.Mouse,
};

const stickInputs: ReadonlyArray<GamepadStickInput> = [
    KnownInput.LeftStickX,
    KnownInput.LeftStickY,
    KnownInput.RightStickX,
    KnownInput.RightStickY,
];

const assignmentIconGetters: Readonly<
    Record<
        InputDeviceType,
        (
            params: Readonly<{
                assignment: Readonly<BindingAssignment>;
                device: Readonly<PlayerInputDevice> | undefined;
            }>,
        ) => ViraIconSvg | undefined
    >
> = {
    [InputDeviceType.Gamepad]({assignment, device}) {
        const gamepad = {
            gamepadBrand: device?.gamepadBrand,
            gamepadModel: device?.deviceName,
        };

        if (check.isIn(assignment.inputName, stickInputs)) {
            return getGamepadStickIcon({
                ...gamepad,
                direction: assignment.direction,
                input: assignment.inputName,
            });
        } else if (check.isEnumValue(assignment.inputName, KnownInput)) {
            return getGamepadInputIcons({
                ...gamepad,
                input: assignment.inputName,
            })[0];
        } else {
            return undefined;
        }
    },
    [InputDeviceType.Keyboard]({assignment}) {
        return keyboardInputIcons[assignment.inputName]?.[0];
    },
    [InputDeviceType.Mouse]({assignment}) {
        return mouseInputIcons[assignment.inputName]?.[0];
    },
};

/** Finds the device of the most recently pressed input among a player's active bindings. */
export function findNewestInputDevice(
    activeBindings: Readonly<ActiveBindings<GameBinding>> | undefined,
) {
    const newestInput = getObjectTypedValues(activeBindings || {})
        .flatMap((activeBinding) => activeBinding.rawInputs)
        .toSorted((first, second) => first.duration.milliseconds - second.duration.milliseconds)[0];

    return newestInput
        ? ({
              deviceName: newestInput.mapped.deviceName,
              deviceType: newestInput.deviceType,
              gamepadBrand: newestInput.mapped.gamepadBrand,
          } satisfies PlayerInputDevice)
        : undefined;
}

/**
 * Finds the icon for a binding on the player's last used device. Before the player has pressed
 * anything, the keyboard is preferred when they have keyboard controls.
 */
export function getBindingIcon({
    bindingAssignments,
    bindingName,
    device,
}: Readonly<{
    bindingAssignments: Readonly<BindingAssignments<GameBinding>> | undefined;
    bindingName: GameBinding;
    device: Readonly<PlayerInputDevice> | undefined;
}>) {
    const assignments = bindingAssignments?.[bindingName] || [];
    const deviceType =
        device?.deviceType ??
        (assignments.some((assignment) => {
            return assignmentDeviceTypes[assignment.deviceKey] === InputDeviceType.Keyboard;
        })
            ? InputDeviceType.Keyboard
            : InputDeviceType.Gamepad);

    return assignments
        .filter((assignment) => assignmentDeviceTypes[assignment.deviceKey] === deviceType)
        .map((assignment) => {
            return assignmentIconGetters[deviceType]({
                assignment,
                device,
            });
        })
        .find(check.isTruthy);
}
