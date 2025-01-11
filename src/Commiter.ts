import { ICommiter } from './Commiter.interface';
import {
    Choice,
    CommiterListOption,
    CommiterOptions,
} from './Commiter.types';
import { checkbox, expand, input, select } from '@inquirer/prompts';
import { isArray, isString } from '@vanyamate/types-kit';
import { execSync } from 'child_process';


export class Commiter implements ICommiter {
    constructor (private readonly _options: CommiterOptions) {
    }

    public async create (): Promise<void> {
        const type      = await this._getType();
        const entities  = await this._getEntities();
        const message   = await this._getMessage();
        const postfixes = await this._getPostfixes();

        if (this._options.gitRemoteRepositoryName) {
            const autoPush = await this._getAutoPush();
            return this._createCommit(type, entities, message, postfixes, autoPush);
        }

        return this._createCommit(type, entities, message, postfixes);
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

    private async _getPostfixes (): Promise<Array<string>> {
        if (!this._options.postfixes) {
            return [];
        }

        const choices = this._getSelectChoicesByOption(this._options.postfixes);

        if (!choices.length) {
            return [];
        }

        return checkbox({
            message : 'Commit postfixes:',
            choices : choices,
            required: false,
            theme   : {
                helpMode: 'always',
            },
        });
    }

    private async _getAutoPush (): Promise<boolean> {
        return expand({
            message : `Auto push? (default ${ this._options.gitPushDefault
                                              ? 'Yes' : 'No' })`,
            expanded: true,
            default : this._options.gitPushDefault ? 'y' : 'n',
            choices : [
                {
                    key  : 'n',
                    name : 'No',
                    value: false,
                },
                {
                    key  : 'y',
                    name : 'Yes',
                    value: true,
                },
            ],
        });
    }

    private _createCommit (type: string, entities: Array<string>, message: string, postfixes: Array<string>, autoPush: boolean = false) {
        execSync('git add .', { cwd: this._options.gitFolder });
        execSync(`git commit -m "${ this._getCommitMessage(type, entities, message, postfixes) }"`, { cwd: this._options.gitFolder });

        if (autoPush) {
            execSync(`git push ${ this._options.gitRemoteRepositoryName } HEAD`, { cwd: this._options.gitFolder });
        }
    }

    private _getCommitMessage (type: string, entities: Array<string>, message: string, postfixes: Array<string>): string {
        const entitiesString        = entities.sort().join(this._options.entitiesSeparator ?? ', ');
        const postfixesString       = postfixes.sort().join(this._options.postfixesSeparator ?? ', ');
        const postfixReplaceOptions = this._getReplaceOptions('postfixes');

        const commitMessage = this._options.pattern
            .replace(`{{type}}`, type)
            .replace(`{{entities}}`, entitiesString)
            .replace(`{{message}}`, message);

        if (isArray(postfixReplaceOptions)) {
            const [ replaceString, prefix, postfix ] = postfixReplaceOptions;
            return commitMessage.replace(
                replaceString,
                postfixesString
                ? `${ prefix }${ postfixesString }${ postfix }`
                : '',
            );
        }

        return commitMessage;
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

    private _getReplaceOptions (type: string): [ string, string, string ] | null {
        const [ replaceString, prefix, postfix ] = this._options.pattern.match(new RegExp(`\{\{([^{}]*)${type}([^{}]*)}\}`)) as Array<string>;
        return [ replaceString, prefix, postfix ];
    }
}