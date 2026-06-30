/**
 * Module stat method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving paths against the instance base path;
 * - returning `lstat` data so symbolic links remain observable;
 * - selecting async or sync stat execution.
 *
 * This file must not contain permission normalization or existence fallback behavior.
 */

import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, Stats, SyncOption } from '../powered-file-system';

/**
 * Returns `lstat` data so symlinks are reported as links instead of followed targets.
 */
export function stat(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption
): Stats;
export function stat(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption
): Promise<Stats>;
export function stat(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): Stats | Promise<Stats>;
export function stat(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): Stats | Promise<Stats> {
  const { sync = false } = options ?? {};

  if (sync) {
    return fs.lstatSync(this.resolve(src));
  }

  return new Promise<Stats>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    fs.lstat(src, (err, stats) => {
      if (err) {
        return reject(err);
      }

      resolve(stats);
    });
  });
}
