import { CommiterOptions } from '../../src/Commiter.types';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const gitFolder  = resolve(__dirname, '..', '..');

export default {
    types                  : [ 'Update', 'New feature', 'Fix' ],
    entities               : [ 'App' ],
    entitiesSeparator      : ', ',
    pattern                : `{{type}} : {{entities}} - {{message}}{{ %postfixes%}}`,
    postfixes              : {
        'Unit tests'     : 'unit',
        'Build'          : 'build',
        'Playwright'     : 'playwright',
        'Telegram notify': 'tg',
    },
    postfixesSeparator     : '%',
    gitFolder              : gitFolder,
    gitRemoteRepositoryName: 'origin',
    gitPushDefault         : true,
} as CommiterOptions;