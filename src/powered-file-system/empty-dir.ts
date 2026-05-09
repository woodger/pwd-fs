import { emptyDir as emptyDirRecursive } from '../recurse-io';
import { emptyDirSync as emptyDirRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

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
    catch (err) {
      reject(err);
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
