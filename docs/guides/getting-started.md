# Getting Started

> Type: Consumer guide. This guide explains how to choose a `pwd-fs` instance
> and how paths are resolved.

## Choose An Instance

The package exports a shared `pfs` instance whose `pwd` is initialized from
`process.cwd()`:

```ts
import { pfs } from 'pwd-fs';

async function readProjectManifest(): Promise<void> {
  if (await pfs.test('package.json')) {
    const manifest = await pfs.read('package.json');
    console.log(manifest);
  }
}

readProjectManifest().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
```

Use a separate `PoweredFileSystem` when operations should share another base
directory:

```ts
import path from 'node:path';
import { PoweredFileSystem } from 'pwd-fs';

const files = new PoweredFileSystem(path.resolve('example-project'));

async function createExampleProject(): Promise<void> {
  await files.mkdir('.');
  await files.write('message.txt', 'Hello from pwd-fs.\n');

  const message = await files.read('message.txt');
  console.log(message);
}

createExampleProject().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
```

`mkdir('.')` creates the instance directory if it does not exist. The
subsequent relative paths resolve beneath `files.pwd`.

## Understand The Path Boundary

Relative inputs are resolved against the instance `pwd`. Absolute inputs remain
absolute, even when they point outside that directory:

```ts
import path from 'node:path';
import { PoweredFileSystem } from 'pwd-fs';

const files = new PoweredFileSystem(path.resolve('example-project'));
const outside = path.resolve(files.pwd, '..', 'outside.txt');

console.log(files.resolve('inside.txt'));
console.log(files.resolve(outside) === outside); // true
```

The instance working directory is a path-resolution convenience, not a security
sandbox. Validate untrusted paths before passing them to filesystem methods.

## Contract References

- [Public class and overloads](../../src/powered-file-system.ts)
- [Path-resolution behavior](../../src/powered-file-system.test.ts)
- [Constructor API reference](../../readme.md#constructor-new-poweredfilesystempath)
