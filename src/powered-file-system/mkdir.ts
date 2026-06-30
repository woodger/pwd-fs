/**
 * Module mkdir method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving directory paths against the instance base path;
 * - applying wrapper umask options to recursive directory creation;
 * - selecting async or sync mkdir execution.
 *
 * This file must not contain unrelated file creation or cleanup behavior.
 */

import { mkdir as mkdirRecursive } from '../recurse-io';
import { mkdirSync as mkdirRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

type MkdirOptions = {
  umask?: number;
};

/**
 * Creates directories relative to the instance base path.
 */
export function mkdir(
  this: PoweredFileSystem,
  dir: string,
  options: SyncOption & MkdirOptions
): void;
export function mkdir(
  this: PoweredFileSystem,
  dir: string,
  options?: AsyncOption & MkdirOptions
): Promise<void>;
export function mkdir(
  this: PoweredFileSystem,
  dir: string,
  options?: MaybeSyncOption & MkdirOptions
): void | Promise<void>;
export function mkdir(
  this: PoweredFileSystem,
  dir: string,
  options?: MaybeSyncOption & MkdirOptions
): void | Promise<void> {
  const { sync = false, umask = 0o000 } = options ?? {};

  if (sync) {
    mkdirRecursiveSync(this.resolve(dir), umask);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    try {
      dir = this.resolve(dir);
    }
    catch (err) {
      reject(err);
      return;
    }

    mkdirRecursive(dir, umask, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
