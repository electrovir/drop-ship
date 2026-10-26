import {createArray, DeferredPromise} from '@augment-vir/common';
import {encodeWav} from '../synth/encode-wav.js';
import {type RenderedAudio} from '../synth/synth-score.js';
import {parseGeneratedAudioUrl} from './generated-audio-url.js';
import {type SynthRenderRequest, type SynthRenderResponse} from './synth-catalog-server.js';

type QueuedRender = {
    key: string;
    deferred: DeferredPromise<RenderedAudio>;
};

/**
 * Renders generated audio on a pool of workers running `serveSynthCatalog`, so rendering never
 * blocks the game. Workers start on the first render. Requests run in the order they're made, so
 * request whatever the player hears first first.
 */
export function createSynthWorkerPool({
    createWorker,
    sampleRate,
    workerCount,
}: Readonly<{
    createWorker: () => Worker;
    sampleRate: number;
    workerCount: number;
}>) {
    const pool = {
        nextId: 0,
        queue: [] as QueuedRender[],
        workers: [] as {
            worker: Worker;
            current:
                | {
                      id: number;
                      deferred: DeferredPromise<RenderedAudio>;
                  }
                | undefined;
        }[],
    };

    function dispatch() {
        pool.workers.forEach((entry) => {
            const next = entry.current ? undefined : pool.queue.shift();

            if (!next) {
                return;
            }

            const request: SynthRenderRequest = {
                id: pool.nextId++,
                key: next.key,
                sampleRate,
            };

            entry.current = {
                deferred: next.deferred,
                id: request.id,
            };
            entry.worker.postMessage(request);
        });
    }

    function startWorkers() {
        return createArray(workerCount, () => {
            const entry: (typeof pool.workers)[number] = {
                current: undefined,
                worker: createWorker(),
            };

            entry.worker.addEventListener(
                'message',
                ({data}: MessageEvent<SynthRenderResponse>) => {
                    const current = entry.current;

                    entry.current = undefined;

                    if (current?.id === data.id) {
                        if ('audio' in data) {
                            current.deferred.resolve(data.audio);
                        } else {
                            current.deferred.reject(new Error(data.errorMessage));
                        }
                    }

                    dispatch();
                },
            );
            /** Fires when the worker's script fails to load or throws outside a render. */
            entry.worker.addEventListener('error', (event) => {
                entry.current?.deferred.reject(
                    new Error(`Synth worker failed: ${event.message || 'unknown error'}`),
                );
                entry.current = undefined;
                dispatch();
            });

            return entry;
        });
    }

    /** Renders one catalog entry. Each call renders again; nothing is cached. */
    async function render(key: string) {
        if (!pool.workers.length) {
            pool.workers = startWorkers();
        }

        const deferred = new DeferredPromise<RenderedAudio>();

        pool.queue.push({
            deferred,
            key,
        });
        dispatch();

        return await deferred.promise;
    }

    /**
     * A drop-in for `AudioPlayer`'s `fetch` option: URLs from `createGeneratedAudioUrl` render to
     * WAV files and everything else goes to the real `fetch`.
     */
    async function fetchAudio(url: string) {
        const key = parseGeneratedAudioUrl(url);

        if (key == undefined) {
            return await globalThis.fetch(url);
        }

        const wav = encodeWav(await render(key));

        return {
            arrayBuffer() {
                return Promise.resolve(wav);
            },
        };
    }

    function destroy() {
        const error = new Error('Synth worker pool destroyed.');

        [
            ...pool.workers.map(({current}) => current),
            ...pool.queue,
        ].forEach((render) => {
            render?.deferred.reject(error);
        });
        pool.workers.forEach(({worker}) => {
            worker.terminate();
        });
        pool.workers = [];
        pool.queue = [];
    }

    return {
        destroy,
        fetch: fetchAudio,
        render,
    };
}

export type SynthWorkerPool = ReturnType<typeof createSynthWorkerPool>;
