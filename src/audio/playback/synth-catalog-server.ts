import {ensureError} from '@augment-vir/common';
import {renderScore, type RenderedAudio, type SynthScore} from '../synth/synth-score.js';

/**
 * Every piece of generated audio a game can play, keyed by the name used in its generated audio
 * URLs. Scores are built only when requested.
 */
export type SynthCatalog = Readonly<Partial<Record<string, () => SynthScore>>>;

export type SynthRenderRequest = Readonly<{
    id: number;
    key: string;
    sampleRate: number;
}>;

export type SynthRenderResponse = Readonly<
    | {
          id: number;
          audio: RenderedAudio;
      }
    | {
          id: number;
          errorMessage: string;
      }
>;

function renderRequest({
    catalog,
    request,
}: Readonly<{
    catalog: SynthCatalog;
    request: SynthRenderRequest;
}>): RenderedAudio {
    const createScore = catalog[request.key];

    if (!createScore) {
        throw new Error(`No generated audio named '${request.key}'.`);
    }

    return renderScore({
        sampleRate: request.sampleRate,
        score: createScore(),
    });
}

/**
 * Renders catalog entries on request inside a worker. Call this once from the worker's entry file
 * with `scope: globalThis`.
 */
export function serveSynthCatalog({
    catalog,
    scope,
}: Readonly<{
    catalog: SynthCatalog;
    scope: Readonly<{
        addEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
        postMessage(message: SynthRenderResponse, options: {transfer: Transferable[]}): void;
    }>;
}>) {
    scope.addEventListener('message', ({data}: MessageEvent<SynthRenderRequest>) => {
        try {
            const audio = renderRequest({
                catalog,
                request: data,
            });

            scope.postMessage(
                {
                    audio,
                    id: data.id,
                },
                {
                    transfer: audio.channels.map((channel) => channel.buffer),
                },
            );
        } catch (error) {
            scope.postMessage(
                {
                    errorMessage: ensureError(error).message,
                    id: data.id,
                },
                {
                    transfer: [],
                },
            );
        }
    });
}
