/**
 * Module read method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving file paths against the instance base path;
 * - preserving string and Buffer return modes from read options;
 * - selecting async or sync file read execution.
 *
 * This file must not contain parsing, transformation, or stream handling.
 */

import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, ReadOptions, SyncOption } from '../powered-file-system';

/**
 * Reads a file relative to `pwd` and preserves Buffer mode when `encoding` is `null`.
 */
export function read(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption & ReadOptions<true, null> & { encoding: null }
): Buffer;
export function read(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption & ReadOptions<true, BufferEncoding>
): string;
export function read(
  this: PoweredFileSystem,
  src: string,
  options: AsyncOption & ReadOptions<false, null> & { encoding: null }
): Promise<Buffer>;
export function read(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption & ReadOptions<false, BufferEncoding>
): Promise<string>;
export function read(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & ReadOptions<boolean, BufferEncoding | null>
): string | Buffer | Promise<string | Buffer>;
export function read(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & ReadOptions<boolean, BufferEncoding | null>
): string | Buffer | Promise<string | Buffer> {
  const { sync = false, encoding = 'utf8', flag = 'r' } = options ?? {};

  if (sync) {
    const resolved = this.resolve(src);

    if (encoding === null) {
      return fs.readFileSync(resolved, { encoding: null, flag });
    }

    return fs.readFileSync(resolved, { encoding, flag });
  }

  return new Promise((resolve, reject) => {
    let resolved: string;

    try {
      resolved = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    fs.readFile(resolved, { encoding, flag }, (err, raw) => {
      if (err) {
        return reject(err);
      }

      resolve(raw);
    });
  });
}
