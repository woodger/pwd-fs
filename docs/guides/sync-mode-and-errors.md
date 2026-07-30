# Sync Mode And Errors

> Type: Consumer guide. This guide explains execution mode, inferred return
> types, and filesystem error handling.

## Prefer The Asynchronous Default

Methods are asynchronous unless `{ sync: true }` is supplied:

```ts
import path from 'node:path';
import { PoweredFileSystem } from 'pwd-fs';

const files = new PoweredFileSystem(path.resolve('example-workspace'));

async function readConfiguration(): Promise<void> {
  const exists: boolean = await files.test('config.json');

  if (exists) {
    const content: string = await files.read('config.json');
    console.log(content);
  }
}

readConfiguration().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
```

Asynchronous filesystem failures reject the returned promise. `test()` is the
exception: access failures resolve to `false`.

## Use Sync Mode Deliberately

Synchronous calls return their result directly and throw on filesystem errors:

```ts
import path from 'node:path';
import { PoweredFileSystem } from 'pwd-fs';

const files = new PoweredFileSystem(path.resolve('example-workspace'));

files.mkdir('.', { sync: true });
files.write('config.json', '{"enabled":true}\n', { sync: true });

const content: string = files.read('config.json', { sync: true });
const bytes: Buffer = files.read('config.json', {
  sync: true,
  encoding: null
});
const entries: string[] = files.readdir('.', { sync: true });

console.log(content, bytes.length, entries);
```

The TypeScript overloads infer direct values for `{ sync: true }` and promises
for the asynchronous form. Sync mode blocks the Node.js event loop, so it is
best reserved for startup code, small scripts, or other contexts where blocking
is intentional.

## Handle Expected Failures

Use `test()` when a missing or inaccessible path is an expected condition:

```ts
if (!await files.test('optional.json')) {
  await files.write('optional.json', '{}\n');
}
```

Use normal promise or exception handling when the operation itself must
succeed:

```ts
try {
  await files.read('required.json');
}
catch (error) {
  console.error('Cannot read required.json', error);
}
```

Methods such as `read()`, `copy()`, `remove()`, and `rename()` preserve
filesystem failures rather than converting them to booleans.

## Contract References

- [Public overloads](../../src/powered-file-system.ts)
- [`test()` behavior](../../src/powered-file-system/test.test.ts)
- [`read()` behavior](../../src/powered-file-system/read.test.ts)
- [API reference](../../readme.md#class-poweredfilesystem)
