const generatedAudioUrlPrefix = 'generated-audio:';

/**
 * A URL for audio rendered on demand instead of downloaded. Pass it anywhere an audio file URL
 * goes, with a `fetch` from `createSynthWorkerPool` to resolve it.
 */
export function createGeneratedAudioUrl(key: string) {
    return generatedAudioUrlPrefix + key;
}

/** The catalog key for one variant of a sound effect. */
export function createSoundEffectKey({
    effect,
    variant,
}: Readonly<{effect: string; variant: number}>) {
    return `${effect}-${variant}`;
}

/** The catalog key in a URL from `createGeneratedAudioUrl`, or `undefined` for any other URL. */
export function parseGeneratedAudioUrl(url: string) {
    return url.startsWith(generatedAudioUrlPrefix)
        ? url.slice(generatedAudioUrlPrefix.length)
        : undefined;
}
