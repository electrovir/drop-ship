import {listenTo, listenToGlobal} from 'typed-event-target';

/**
 * Resumes `audioContext` on every user input and whenever the tab becomes visible, as long as it
 * isn't running. Returns a cleanup function.
 *
 * `createAnthaAudioMod`'s own resume listeners remove themselves after the first click or key
 * press, even when that resume didn't take (gamepad input never counts as a user gesture), and
 * never return when the browser suspends the context again later, such as in a hidden tab. These
 * stay for the context's whole life.
 */
export function keepAudioRunning(audioContext: AudioContext) {
    async function resume() {
        if (audioContext.state !== 'running' && audioContext.state !== 'closed') {
            await audioContext.resume();
        }
    }

    const removeListeners = [
        ...(
            [
                'click',
                'keydown',
                'pointerdown',
                'touchend',
            ] as const
        ).map((eventType) => {
            return listenToGlobal(eventType, resume, {
                capture: true,
            });
        }),
        listenTo(globalThis.document, 'visibilitychange', async () => {
            if (globalThis.document.visibilityState === 'visible') {
                await resume();
            }
        }),
    ];

    return () => {
        removeListeners.forEach((removeListener) => {
            removeListener();
        });
    };
}
