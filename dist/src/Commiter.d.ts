import { ICommiter } from './Commiter.interface';
import { CommiterOptions } from './Commiter.types';
export declare class Commiter implements ICommiter {
    private readonly _options;
    constructor(_options: CommiterOptions);
    create(): Promise<void>;
    private _getType;
    private _getEntity;
    private _getMessage;
    private _createCommit;
    private _getCommitMessage;
    private _getSelectChoicesByOption;
}
