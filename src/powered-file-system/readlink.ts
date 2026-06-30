/**
 * Module readlink method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving link paths against the instance base path;
 * - preserving Node readlink encoding behavior;
 * - selecting async or sync symbolic-link target reads.
 *
 * This file must not contain canonical path resolution or symlink creation.
 */

import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Reads the target path stored in a symbolic link.
 */
export function readlink(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption & { encoding?: BufferEncoding }
): string;
export function readlink(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption & { encoding?: BufferEncoding }
): Promise<string>;
export function readlink(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & { encoding?: BufferEncoding }
): string | Promise<string>;
export function readlink(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & { encoding?: BufferEncoding }
): string | Promise<string> {
  const { sync = false, encoding = 'utf8' } = options ?? {};

  if (sync) {
    return fs.readlinkSync(this.resolve(src), { encoding });
  }

  return new Promise<string>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    fs.readlink(src, { encoding }, (err, resolved) => {
      if (err) {
        return reject(err);
      }

      resolve(resolved as string);
    });
  });
}
