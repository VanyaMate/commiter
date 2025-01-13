import { CommiterOptions } from '../../src/Commiter.types';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const gitFolder  = resolve(__dirname, '..', '..');

export default {
    types                  : [ '💡 Update', '🙏 Fix', '🔥 New feature' ],
    entities               : [ 'App' ],
    entitiesSeparator      : ', ',
    pattern                : `{{type}} : {{entities}} - {{message}} {{postfixes}}`,
    gitFolder              : gitFolder,
    gitRemoteRepositoryName: 'origin',
    gitPushDefault         : true,
} as CommiterOptions;