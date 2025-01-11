import { checkbox, expand, input, select } from '@inquirer/prompts';
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
        const postfixes = this._options.postfixes?.length
            ? await this._getPostfixes()
            : [];
        if (this._options.gitRemoteRepositoryName) {
            const autoPush = await this._getAutoPush();
            return this._createCommit(type, entities, message, postfixes, autoPush);
        }
        return this._createCommit(type, entities, message, postfixes);
    }
    async _getType() {
        return select({
            message: 'Commit type:',
            choices: this._getSelectChoicesByOption(this._options.types),
            theme: {
                helpMode: 'always',
            },
        });
    }
    async _getEntities() {
        return checkbox({
            message: 'Commit entities:',
            choices: this._getSelectChoicesByOption(this._options.entities),
            required: true,
            theme: {
                helpMode: 'always',
            },
        });
    }
    async _getMessage() {
        return input({ message: 'Commit message:' });
    }
    async _getPostfixes() {
        return checkbox({
            message: 'Commit postfixes:',
            choices: this._getSelectChoicesByOption(this._options.postfixes),
            required: true,
            theme: {
                helpMode: 'always',
            },
        });
    }
    async _getAutoPush() {
        return expand({
            message: `Auto push? (default ${this._options.gitPushDefault
                ? 'Yes' : 'No'})`,
            expanded: true,
            default: this._options.gitPushDefault ? 'y' : 'n',
            choices: [
                {
                    key: 'n',
                    name: 'No',
                    value: false,
                },
                {
                    key: 'y',
                    name: 'Yes',
                    value: true,
                },
            ],
        });
    }
    _createCommit(type, entities, message, postfixes, autoPush = false) {
        execSync('git add .', { cwd: this._options.gitFolder });
        execSync(`git commit -m "${this._getCommitMessage(type, entities, message, postfixes)}"`, { cwd: this._options.gitFolder });
        if (autoPush) {
            execSync(`git push ${this._options.gitRemoteRepositoryName} HEAD`, { cwd: this._options.gitFolder });
        }
    }
    _getCommitMessage(type, entities, message, postfixes) {
        return this._options.pattern
            .replace(`{{type}}`, type)
            .replace(`{{entities}}`, entities.sort().join(this._options.entitiesSeparator ?? ', '))
            .replace(`{{message}}`, message)
            .replace(`{{postfixes}}`, postfixes.sort().join(this._options.postfixesSeparator ?? ', '));
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
