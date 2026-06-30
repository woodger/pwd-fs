/**
 * Module chmod method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving instance-relative paths before permission changes;
 * - selecting async or sync recursive chmod implementation;
 * - preserving wrapper error propagation for missing targets.
 *
 * This file must not contain recursive traversal logic.
 */

import { chmod as chmodRecursive } from '../recurse-io';
import { chmodSync as chmodRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Resolves the target path and delegates recursive mode updates.
 */
export function chmod(
  this: PoweredFileSystem,
  src: string,
  mode: number,
  options: SyncOption
): void;
export function chmod(
  this: PoweredFileSystem,
  src: string,
  mode: number,
  options?: AsyncOption
): Promise<void>;
export function chmod(
  this: PoweredFileSystem,
  src: string,
  mode: number,
  options?: MaybeSyncOption
): void | Promise<void>;
export function chmod(
  this: PoweredFileSystem,
  src: string,
  mode: number,
  options?: MaybeSyncOption
): void | Promise<void> {
  const { sync = false } = options ?? {};

  if (sync) {
    chmodRecursiveSync(this.resolve(src), mode);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    chmodRecursive(src, mode, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
