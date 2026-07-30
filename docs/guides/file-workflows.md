# File Workflows

> Type: Consumer guide. This guide combines public methods into a small
> directory-processing workflow.

## Create And Process A Directory Tree

The following example creates a source tree, copies it into an output
directory, renames a copied file, and removes the copied tree:

```ts
import path from 'node:path';
import { PoweredFileSystem } from 'pwd-fs';

const files = new PoweredFileSystem(path.resolve('example-workspace'));

async function processFiles(): Promise<void> {
  await files.mkdir('.');
  await files.mkdir('source/nested');
  await files.write('source/nested/entry.txt', 'source content\n');

  await files.mkdir('output');
  await files.copy('source', 'output');

  const copied = await files.read('output/source/nested/entry.txt');
  console.log(copied);

  await files.rename(
    'output/source/nested/entry.txt',
    'output/source/nested/renamed.txt'
  );

  const entries = await files.readdir('output/source/nested');
  console.log(entries); // ['renamed.txt']

  await files.remove('output/source');
}

processFiles().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
```

`copy(src, dest)` expects `dest` to exist. It creates
`path.join(dest, path.basename(src))`, so copying `source` into `output`
produces `output/source`.

By default, copying fails if that target already exists. Use
`{ overwrite: true }` only when replacing the target is intentional:

```ts
await files.copy('source', 'output', {
  overwrite: true
});
```

## Append Without The Deprecated Method

Use `write()` with the append flag instead of the deprecated `append()` method:

```ts
await files.write('events.log', 'processed\n', {
  flag: 'a'
});
```

## Contract References

- [Copy API reference](../../readme.md#pfscopysrc-dir-options)
- [Write API reference](../../readme.md#pfswritesrc-data-options)
- [Copy behavior tests](../../src/powered-file-system/copy.test.ts)
- [Recursive remove behavior tests](../../src/powered-file-system/remove.test.ts)
