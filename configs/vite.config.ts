import {defineConfig} from '@virmator/frontend/configs/vite.config.base.js';
import {resolve} from 'node:path';

export default defineConfig(
    {
        forGitHubPages: true,
        packageDirPath: resolve(import.meta.dirname, '..'),
    },
    (baseConfig) => {
        return {
            ...baseConfig,
            worker: {
                ...baseConfig.worker,
                /** The audio worker's dependencies use top-level await, which `iife` can't bundle. */
                format: 'es',
            },
        };
    },
);
