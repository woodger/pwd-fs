/**
 * Module symlink method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving source and destination paths against the instance base path;
 * - handling Windows symlink type requirements;
 * - selecting async or sync symbolic-link creation.
 *
 * This file must not contain link target reading or canonical path resolution.
 */

import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Windows requires an explicit link type. Non-Windows platforms infer it.
 */
function resolveSymlinkType(src: string): fs.symlink.Type | undefined {
  if (process.platform !== 'win32') {
    return undefined;
  }

  const stats = fs.lstatSync(src);
  return stats.isDirectory() ? 'junction' : 'file';
}

export function symlink(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options: SyncOption
): void;
export function symlink(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: AsyncOption
): Promise<void>;
export function symlink(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption
): void | Promise<void>;
export function symlink(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption
): void | Promise<void> {
  const { sync = false } = options ?? {};

  if (sync) {
    src = this.resolve(src);
    dest = this.resolve(dest);
    const type = resolveSymlinkType(src);
    fs.symlinkSync(src, dest, type);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    try {
      src = this.resolve(src);
      dest = this.resolve(dest);
    }
    catch (err) {
      reject(err);
      return;
    }

    if (process.platform === 'win32') {
      fs.lstat(src, (err, stats) => {
        if (err) {
          return reject(err);
        }

        const type: fs.symlink.Type = stats.isDirectory() ? 'junction' : 'file';

        fs.symlink(src, dest, type, (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    }
    else {
      fs.symlink(src, dest, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }
  });
}
