import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Resolves both paths against the instance base path before delegating to Node's rename API.
 */
export function rename(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options: SyncOption
): void;
export function rename(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: AsyncOption
): Promise<void>;
export function rename(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption
): void | Promise<void>;
export function rename(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: MaybeSyncOption
): void | Promise<void> {
  const { sync = false } = options ?? {};

  if (sync) {
    src = this.resolve(src);
    dest = this.resolve(dest);
    fs.renameSync(src, dest);
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

    fs.rename(src, dest, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
