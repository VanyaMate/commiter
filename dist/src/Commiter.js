import { checkbox, input, select } from '@inquirer/prompts';
import { isArray, isString } from '@vanyamate/types-kit';
import { execSync } from 'child_process';
export class Commiter {
    _options;
    constructor(_options) {
        this._options = _options;
    }
    async create() {
        const type = await this._getType();
        const entities = await this._getEntities();
        const message = await this._getMessage();
        this._createCommit(type, entities, message);
    }
    async _getType() {
        return select({
            message: 'Тип коммита:',
            choices: this._getSelectChoicesByOption(this._options.types),
        });
    }
    async _getEntities() {
        return checkbox({
            message: 'Задетые сущности:',
            choices: this._getSelectChoicesByOption(this._options.entities),
        });
    }
    async _getMessage() {
        return input({ message: 'Сообщение:' });
    }
    _createCommit(type, entities, message) {
        execSync('git add .', { cwd: this._options.gitFolder });
        execSync(`git commit -m "${this._getCommitMessage(type, entities, message)}"`, { cwd: this._options.gitFolder });
    }
    _getCommitMessage(type, entities, message) {
        return this._options.pattern
            .replace(`{{type}}`, type)
            .replace(`{{entities}}`, entities.sort().join(', '))
            .replace(`{{message}}`, message);
    }
    _getSelectChoicesByOption(option) {
        if (isArray(option)) {
            return option.map((item) => {
                if (isString(item)) {
                    return { name: item, value: item };
                }
                else {
                    const [key, value] = Object.entries(item)[0];
                    return { name: key, value };
                }
            });
        }
        else {
            return Object
                .entries(option)
                .map(([key, value]) => ({
                name: key, value: value,
            }));
        }
    }
}
