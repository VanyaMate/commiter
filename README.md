# Commiter

Установка:

```shell
npm i @vanyamate/commiter
```

Для начала нужно создать конфиг c типом:

```typescript
export type CommiterListOption =
    Array<string | Record<string, string>>
    | Record<string, string>;

export type CommiterOptions = {
    types: CommiterListOption;
    entities: CommiterListOption;
    pattern: string;
    gitFolder: string;
}
```

Например:

```typescript
import { CommiterOptions } from './Commiter.types';


const __dirname = import.meta.dirname;
const gitFolder = resolve(__dirname, '..', '..');

const config: CommiterOptions = {
    types    : {
        'Fix': 'Fix 💡',
        'Up' : 'Update ♥',
    },
    entities : [ 'App', 'User', { Comm: 'Commentary' } ],
    pattern  : '{{type}} : {{entities}} - {{message}}',
    gitFolder: gitFolder,
};
```

Типы и сущности можно указывать как:

- Массив строк
- Массив строк + объекты с одним значением
- Объект со всеми типами где ключ - то что покажется в консоли, значение - то что будет в коммите

Паттерн указывается как строка.

- `{{type}}` - заменится на указанный тип из списка `types`
- `{{entities}}` - заменится на выбранные сущности из `entities` (через запятую)
- `{{message}}` - заменится на введенное сообщение

`gitFolder` - папка в которой будут вызываться команды `git add .` и `git commit -m "полное сообщение"`

Дальше создать эксемпляр в который передать конфиг коммитера и вызвать метод `create`

```typescript
import { Commiter } from '@vanyamate/commiter';
import config from './config';


new Commiter(config).create();
```

Для использования можно создать скрипт в `package.json`

```text
"commit": "tsx utils/git/commiter.ts" 

или

"commit": "node utils/git/commiter.js"
```

и вызывать как
```shell
npm run commit
```