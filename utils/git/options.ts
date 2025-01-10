import { CommiterOptions } from '../../src/Commiter.types';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const gitFolder  = resolve(__dirname, '..', '..');

export default {
    entities : [ 'Update', 'New feature', 'Fix' ],
    types    : [ 'App' ],
    pattern  : '[ {{type}} ] {{entity}} - {{message}}',
    gitFolder: gitFolder,
} as CommiterOptions;