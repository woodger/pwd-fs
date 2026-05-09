import { remove as removeRecursive } from '../recurse-io';
import { removeSync as removeRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Removes a path relative to the instance base path.
 */
export function remove(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption
): void;
export function remove(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption
): Promise<void>;
export function remove(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): void | Promise<void>;
export function remove(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption
): void | Promise<void> {
  const { sync = false } = options ?? {};

  if (sync) {
    removeRecursiveSync(this.resolve(src));
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

    removeRecursive(src, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
