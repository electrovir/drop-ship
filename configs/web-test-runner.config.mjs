import {pixiPlugin} from '@antha/web-test-runner-plugin-pixi';
import {defineConfig} from '@virmator/test/configs/web-test-runner.config.base.mjs';
import {build} from 'esbuild';
import {createRequire} from 'module';
import {dirname} from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

const require = createRequire(import.meta.url);
const elementaryCommonJsDependencies = [
    'eventemitter3',
    'invariant',
    'shallowequal',
];

const baseConfig = defineConfig({
    coveragePercent: 100,
    packageRootDirPath: dirname(dirname(fileURLToPath(import.meta.url))),
    extraScreenshotOptions: {},
});

/** @type {import('@web/test-runner').TestRunnerConfig} */
const webTestRunnerConfig = {
    ...baseConfig,
    plugins: [
        {
            name: 'elementary-commonjs-dependencies',
            /**
             * `@elemaudio/core` imports these CommonJS packages, which browsers can't load as
             * modules, so tests get each one bundled to ESM.
             */
            resolveImport({source}) {
                return elementaryCommonJsDependencies.includes(source)
                    ? `/__commonjs__/${source}.js`
                    : undefined;
            },
            async serve({path}) {
                const name = path.match(/^\/__commonjs__\/(.+)\.js$/)?.[1];

                if (!name) {
                    return undefined;
                }

                const result = await build({
                    bundle: true,
                    define: {
                        'process.env.NODE_ENV': '"development"',
                    },
                    entryPoints: [
                        require.resolve(name),
                    ],
                    format: 'esm',
                    write: false,
                });

                return {
                    body: result.outputFiles[0].text,
                    type: 'js',
                };
            },
        },
        pixiPlugin(),
        ...baseConfig.plugins,
    ],
};

export default webTestRunnerConfig;

/** Log the full config if this file file is run directly as a script, for debugging. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    console.info(JSON.stringify(webTestRunnerConfig, null, 4));
}
