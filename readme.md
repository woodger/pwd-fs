# pwd-fs

[![License](https://img.shields.io/npm/l/pwd-fs)](https://github.com/woodger/pwd-fs/blob/master/LICENSE)
[![CI](https://github.com/woodger/pwd-fs/actions/workflows/ci.yml/badge.svg)](https://github.com/woodger/pwd-fs/actions/workflows/ci.yml)

`pwd-fs` is a path-aware wrapper around Node.js file system APIs.

It provides:

- a dedicated working directory per instance
- Promise-based async methods
- matching synchronous variants via `{ sync: true }`
- recursive helpers for copy, remove, chmod, chown, and mkdir

All relative paths are resolved against `pfs.pwd`.

## Why Use It

Use `pwd-fs` when you want file system operations to be scoped to a specific working directory without manually calling `path.resolve()` before every operation.

It is especially useful for:

- CLI tools that operate inside a project root
- build or code generation scripts
- isolated test fixtures
- small automation tasks that need Promise-based file system helpers

## Installation

```bash
npm install pwd-fs
```

## Quick Start

```ts
import { pfs } from 'pwd-fs';

await pfs.mkdir('./own/project'); // recursively create the directory
```

## Common Recipes

### Work inside a scoped directory

```ts
import { PoweredFileSystem } from 'pwd-fs';

const projectFs = new PoweredFileSystem('/workspace/my-project');

await projectFs.write('./.cache/build.txt', 'ok');
const exists = await projectFs.test('./.cache/build.txt');
```

### Copy assets into a build directory

```ts
await pfs.mkdir('./dist');
await pfs.copy('./assets', './dist');
```

Result:

- source: `./assets`
- destination directory: `./dist`
- created output: `./dist/assets`

### Append to a file

```ts
await pfs.write('./app.log', 'first line\n');
await pfs.write('./app.log', 'second line\n', { flag: 'a' });
```

### Read a file as a buffer

```ts
const raw = await pfs.read('./archive.bin', { encoding: null });
```

### Remove a temporary directory recursively

```ts
if (await pfs.test('./tmp')) {
  await pfs.remove('./tmp');
}
```

## Compatibility

- package `engines`: Node.js `>=13.2.0`
- module format: CommonJS package output with TypeScript declarations
- platform notes:
  - `chown()` is effectively a no-op on Windows apart from path validation
  - `chmod()` behavior on Windows is limited by the platform
  - `x` access checks in `test()` do not have the same meaning on Windows as on Unix-like systems

## Exports

```ts
import PoweredFileSystem, { pfs, bitmask } from 'pwd-fs';
```

- `default`: `PoweredFileSystem`
- `pfs`: default instance rooted at `process.cwd()`
- `bitmask(mode)`: helper that extracts standard permission bits from `fs.Stats.mode`

## API

### `new PoweredFileSystem(pwd?)`

Creates a new instance rooted at `pwd`.

- `pwd?: string`
- default: `process.cwd()`

```ts
import { PoweredFileSystem } from 'pwd-fs';

const pfs = new PoweredFileSystem('./workspace');
```

### `pfs.pwd`

Absolute base directory used to resolve all relative paths.

### `pfs.constants`

Access mode aliases used by `pfs.test()`:

- `e`: existence
- `r`: readable
- `w`: writable
- `x`: executable

### `PoweredFileSystem.bitmask(mode)`

Static alias for `bitmask(mode)`.

```ts
const { mode } = await pfs.stat('./file.txt');
const permissions = PoweredFileSystem.bitmask(mode);
```

### `pfs.test(src, options?)`

Checks whether a path is accessible.

```ts
test<T extends boolean = false>(
  src: string,
  options?: { sync?: T; flag?: 'e' | 'r' | 'w' | 'x' }
): T extends true ? boolean : Promise<boolean>
```

- `src`: absolute or instance-relative path
- `flag`: access check to perform
- default flag: `'e'`

```ts
const exists = await pfs.test('./notes.txt');
const writable = pfs.test('./notes.txt', { sync: true, flag: 'w' });
```

### `pfs.stat(src, options?)`

Returns `fs.lstat()` information for a path.

```ts
stat<T extends boolean = false>(
  src: string,
  options?: { sync?: T }
): T extends true ? Stats : Promise<Stats>
```

This method uses `lstat`, so symbolic links are reported as links instead of followed targets.

### `pfs.chmod(src, mode, options?)`

Recursively applies permissions to a file or directory tree.

```ts
chmod<T extends boolean = false>(
  src: string,
  mode: number,
  options?: { sync?: T }
): T extends true ? void : Promise<void>
```

```ts
await pfs.chmod('./build', 0o755);
```

Note: on Windows, permission handling is limited by platform behavior.

### `pfs.chown(src, options?)`

Recursively applies ownership to a file or directory tree.

```ts
chown<T extends boolean = false>(
  src: string,
  options?: { sync?: T; uid?: number; gid?: number }
): T extends true ? void : Promise<void>
```

- `uid` and `gid` default to `0`
- when `uid` or `gid` is `0`, the current value from the source entry is preserved
- on Windows, ownership changes are not performed, but path validation still happens

### `pfs.symlink(src, dest, options?)`

Creates a symbolic link from `dest` to `src`.

```ts
symlink<T extends boolean = false>(
  src: string,
  dest: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void>
```

```ts
await pfs.symlink('./target.txt', './target-link.txt');
```

### `pfs.copy(src, dest, options?)`

Copies `src` into the destination directory.

```ts
copy<T extends boolean = false>(
  src: string,
  dest: string,
  options?: { sync?: T; umask?: number }
): T extends true ? void : Promise<void>
```

Behavior:

- copying a file creates `dest/<basename(src)>`
- copying a directory creates `dest/<basename(src)>` recursively
- the target must not already exist

```ts
await pfs.copy('./assets', './dist');
```

This creates `./dist/assets`, not a direct rename to `./dist`.

### `pfs.rename(src, dest, options?)`

Renames or moves a file system entry.

```ts
rename<T extends boolean = false>(
  src: string,
  dest: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void>
```

### `pfs.remove(src, options?)`

Removes a file, directory, or symbolic link.

```ts
remove<T extends boolean = false>(
  src: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void>
```

Behavior:

- directories are removed recursively
- symbolic links are unlinked without deleting the target

### `pfs.read(src, options?)`

Reads a file.

```ts
read<T extends boolean = false>(
  src: string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    flag?: string;
  }
): T extends true ? string | Buffer : Promise<string | Buffer>
```

- default `encoding`: `'utf8'`
- use `encoding: null` to get a `Buffer`
- default `flag`: `'r'`

```ts
const text = await pfs.read('./file.txt');
const buffer = pfs.read('./file.txt', { sync: true, encoding: null });
```

### `pfs.write(src, data, options?)`

Writes a file and explicitly reapplies the computed mode.

```ts
write<T extends boolean = false>(
  src: string,
  data: Buffer | string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
    flag?: string;
  }
): T extends true ? void : Promise<void>
```

- default `encoding`: `'utf8'`
- default `umask`: `0o000`
- default `flag`: `'w'`
- use `flag: 'a'` to append
- any valid Node.js string file flag is accepted, such as `'r'`, `'w'`, `'a'`, `'wx'`, or `'a+'`

```ts
await pfs.write('./report.txt', 'generated output');
await pfs.write('./report.txt', '\nnext line', { flag: 'a' });
```

### `pfs.append(src, data, options?)`

Deprecated wrapper around `write(..., { flag: 'a' })`.

```ts
append<T extends boolean = false>(
  src: string,
  data: Buffer | string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
  }
): T extends true ? void : Promise<void>
```

Prefer:

```ts
await pfs.write('./file.txt', 'content', { flag: 'a' });
```

### `pfs.readdir(dir, options?)`

Reads a directory and returns entry names.

```ts
readdir<T extends boolean = false>(
  dir: string,
  options?: { sync?: T; encoding?: BufferEncoding | null }
): T extends true ? string[] : Promise<string[]>
```

- default `encoding`: `'utf8'`

### `pfs.mkdir(dir, options?)`

Creates a directory tree recursively.

```ts
mkdir<T extends boolean = false>(
  dir: string,
  options?: { sync?: T; umask?: number }
): T extends true ? void : Promise<void>
```

- existing directories are accepted
- default `umask`: `0o000`

```ts
await pfs.mkdir('./public/assets/icons');
```

## Sync Mode

Every API method supports a synchronous form through `{ sync: true }`.

```ts
pfs.mkdir('./cache', { sync: true });
pfs.write('./cache/data.json', '{}', { sync: true });
const content = pfs.read('./cache/data.json', { sync: true });
```

## Error Behavior

Most async methods reject with the underlying Node.js error. Their sync variants throw the same class of error synchronously.

Typical cases:

- `test()` is the exception:
  it returns `false` for inaccessible or missing paths instead of rejecting or throwing
- `read()`, `stat()`, `readdir()`, `chmod()`, `chown()`, `rename()`, and `remove()` fail for missing paths
- `read()` fails when the target is a directory
- `readdir()` fails when the target is not a directory
- `write()` fails when the target path points to a directory
- `copy()` fails when the source does not exist
- `copy()` also fails when the destination already contains an entry with the same basename as the source
- `symlink()` fails when the destination already exists
- `mkdir()` accepts an existing directory, but fails when a path segment is a file

Practical pattern:

```ts
if (await pfs.test('./dist')) {
  await pfs.remove('./dist');
}

await pfs.mkdir('./dist');
```

## Umask Behavior

`copy()`, `write()`, and `mkdir()` support `umask`.

Effective permissions:

| Umask | File mode | Directory mode |
| --- | --- | --- |
| `0o000` | `0o666` | `0o777` |
| `0o022` | `0o644` | `0o755` |
| `0o027` | `0o640` | `0o750` |
| `0o077` | `0o600` | `0o700` |

## Notes

- Relative paths are always resolved against `pfs.pwd`
- `stat()` returns `lstat()` data
- `remove()` does not follow symbolic links
- `append()` is kept for backward compatibility and is deprecated

## Platform Caveats

| Area | Unix-like systems | Windows |
| --- | --- | --- |
| `chmod()` | Recursive permission changes work as expected | Permission handling is limited by platform behavior |
| `chown()` | Recursive ownership changes are applied | Ownership is not changed; only path validation is performed |
| `symlink()` | Link type is inferred by the platform | The implementation resolves the source first and chooses `file` or `junction` explicitly |
| `test(..., { flag: 'x' })` | Uses executable access checks | Does not have the same semantics as Unix execute checks |
| `remove()` on symlinks | Removes the link, not the target | Removes the link, not the target |

## When To Use Native `fs`

Prefer native `node:fs` APIs directly when you need:

- streams such as `createReadStream()` or `createWriteStream()`
- advanced flags and options not exposed by this wrapper
- very low-level control over file descriptors
- exact parity with Node's callback-based APIs

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
