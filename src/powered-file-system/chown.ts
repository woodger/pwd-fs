import fs from 'node:fs';
import { chown as chownRecursive } from '../recurse-io';
import { chownSync as chownRecursiveSync } from '../recurse-io-sync';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Resolves the target path and applies recursive ownership changes where supported.
 */
type ChownOptions = {
  uid?: number;
  gid?: number;
};

export function chown(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption & ChownOptions
): void;
export function chown(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption & ChownOptions
): Promise<void>;
export function chown(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & ChownOptions
): void | Promise<void>;
export function chown(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & ChownOptions
): void | Promise<void> {
  const { sync = false, uid, gid } = options ?? {};

  if (sync) {
    src = this.resolve(src);

    if (process.platform === 'win32') {
      // Windows does not expose POSIX ownership changes; keep existence checks consistent.
      fs.lstatSync(src);
      return;
    }

    chownRecursiveSync(src, uid, gid);
    return;
  }

  if (process.platform === 'win32') {
    return new Promise<void>((resolve, reject) => {
      try {
        src = this.resolve(src);
      }
      catch (err) {
        reject(err);
        return;
      }

      // Match Unix behavior by validating the path even when ownership cannot be changed.
      fs.lstat(src, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  return new Promise<void>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    chownRecursive(src, uid, gid, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
