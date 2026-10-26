import {gameAudioCatalog} from './game-audio-catalog.js';
import {serveSynthCatalog} from './playback/synth-catalog-server.js';

serveSynthCatalog({
    catalog: gameAudioCatalog,
    scope: globalThis,
});
