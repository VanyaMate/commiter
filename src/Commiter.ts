import { ICommiter } from './Commiter.interface';
import {
    Choice,
    CommiterListOption,
    CommiterOptions,
} from './Commiter.types';
import { checkbox, input, select } from '@inquirer/prompts';
import { isArray, isString } from '@vanyamate/types-kit';
import { execSync } from 'child_process';


export class Commiter implements ICommiter {
    constructor (private readonly _options: CommiterOptions) {
    }

    public async create (): Promise<void> {
        const type     = await this._getType();
        const entities = await this._getEntities();
        const message  = await this._getMessage();

        this._createCommit(type, entities, message);
    }

    private async _getType (): Promise<string> {
        return select({
            message: 'Commit type:',
            choices: this._getSelectChoicesByOption(this._options.types),
            theme  : {
                helpMode: 'always',
            },
        });
    }

    private async _getEntities (): Promise<Array<string>> {
        return checkbox({
            message : 'Commit entities:',
            choices : this._getSelectChoicesByOption(this._options.entities),
            required: true,
            theme   : {
                helpMode: 'always',
            },
        });
    }

    private async _getMessage (): Promise<string> {
        return input({ message: 'Commit message:' });
    }

    private _createCommit (type: string, entities: Array<string>, message: string) {
        execSync('git add .', { cwd: this._options.gitFolder });
        execSync(`git commit -m "${ this._getCommitMessage(type, entities, message) }"`, { cwd: this._options.gitFolder });
    }

    private _getCommitMessage (type: string, entities: Array<string>, message: string): string {
        return this._options.pattern
            .replace(`{{type}}`, type)
            .replace(`{{entities}}`, entities.sort().join(', '))
            .replace(`{{message}}`, message);
    }

    private _getSelectChoicesByOption (option: CommiterListOption): Array<Choice<string>> {
        if (isArray(option)) {
            return option.map((item) => {
                if (isString(item)) {
                    return { name: item, value: item };
                } else {
                    const [ key, value ] = Object.entries(item)[0];
                    return { name: key, value };
                }
            });
        } else {
            return Object
                .entries(option)
                .map(([ key, value ]) => ({
                    name: key, value: value,
                }));
        }
    }
}