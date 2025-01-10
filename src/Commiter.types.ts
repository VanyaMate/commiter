export type CommiterListOption =
    Array<string | Record<string, string>>
    | Record<string, string>;

export type CommiterOptions = {
    types: CommiterListOption;
    entities: CommiterListOption;
    pattern: string;
    gitFolder: string;
    gitRemoteRepositoryName?: string;
}

export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};