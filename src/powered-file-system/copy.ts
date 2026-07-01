/**
 * Module copy method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving source and destination paths against the instance base path;
 * - shaping copy options for recursive copy implementations;
 * - selecting async or sync copy execution.
 *
 * This file must not contain recursive copy traversal or collision replacement algorithms.
 */

import { copy as copyRecursive } from '../recurse-io';
import { copySync as copyRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, CopyFilter, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

type CopyOptions = {
  umask?: number;
  overwrite?: boolean;
  filter?: CopyFilter;
};

/**
 * Resolves source and destination paths before delegating recursive copy work.
 */
export function copy(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options: SyncOption & CopyOptions
): void;
export function copy(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: AsyncOption & CopyOptions
): Promise<void>;
export function copy(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption & CopyOptions
): void | Promise<void>;
export function copy(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption & CopyOptions
): void | Promise<void> {
  const {
    sync = false,
    umask = 0o000,
    overwrite = false,
    filter
  } = options ?? {};
  const copyOptions = filter ? { umask, overwrite, filter } : { umask, overwrite };

  if (sync) {
    copyRecursiveSync(this.resolve(src), this.resolve(dest), copyOptions);
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

    copyRecursive(src, dest, copyOptions, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
