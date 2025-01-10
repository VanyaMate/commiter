import { ICommiter } from './Commiter.interface';
import {
    Choice,
    CommiterListOption,
    CommiterOptions,
} from './Commiter.types';
import { input, select } from '@inquirer/prompts';
import { isArray, isString } from '@vanyamate/types-kit';
import { execSync } from 'child_process';


export class Commiter implements ICommiter {
    constructor (private readonly _options: CommiterOptions) {
    }

    public async create (): Promise<void> {
        const type    = await this._getType();
        const entity  = await this._getEntity();
        const message = await this._getMessage();

        this._createCommit(type, entity, message);
    }

    private async _getType (): Promise<string> {
        return select({
            message: 'Выберите тип коммита',
            choices: this._getSelectChoicesByOption(this._options.types),
        });
    }

    private async _getEntity (): Promise<string> {
        return select({
            message: 'Выберите сущность коммита',
            choices: this._getSelectChoicesByOption(this._options.entities),
        });
    }

    private async _getMessage (): Promise<string> {
        return input({ message: 'Введите сообщение' });
    }

    private _createCommit (type: string, entity: string, message: string) {
        execSync('git add .', { cwd: this._options.gitFolder });
        execSync(`git commit -m "${ this._getCommitMessage(type, entity, message) }"`, { cwd: this._options.gitFolder });
    }

    private _getCommitMessage (type: string, entity: string, message: string): string {
        return this._options.pattern
            .replace(`{{type}}`, type)
            .replace(`{{entity}}`, entity)
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