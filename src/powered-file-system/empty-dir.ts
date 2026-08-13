/**
 * Module empty-directory method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving the target directory against the instance base path;
 * - preserving the directory while delegating entry removal;
 * - selecting async or sync empty-directory execution.
 *
 * This file must not contain recursive removal algorithms.
 */

import { emptyDir as emptyDirRecursive } from '../recurse-io';
import { emptyDirSync as emptyDirRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
import { normalizeError } from './normalize-error';

/**
 * Removes directory contents while preserving the directory itself.
 */
export function emptyDir(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption
): void;
export function emptyDir(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption
): Promise<void>;
export function emptyDir(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): void | Promise<void>;
export function emptyDir(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): void | Promise<void> {
  const { sync = false } = options ?? {};

  if (sync) {
    emptyDirRecursiveSync(this.resolve(src));
    return;
  }

  return new Promise<void>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (reason) {
      reject(normalizeError(reason));
      return;
    }

    emptyDirRecursive(src, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
