import fs from 'node:fs';
import path from 'node:path';
import { chown as chownRecursive } from '../recurse-io';
import { chownSync as chownRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

export function chown<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: { sync?: T; uid?: number; gid?: number }
): T extends true ? void : Promise<void> {
  const { sync = false as T, uid = 0, gid = 0 } = options ?? {};
  src = path.resolve(this.pwd, src);

  if (sync) {
    if (process.platform === 'win32') {
      fs.lstatSync(src);
      return undefined as any;
    }

    chownRecursiveSync(src, uid, gid);
    return undefined as any;
  }

  if (process.platform === 'win32') {
    return new Promise<void>((resolve, reject) => {
      fs.lstat(src, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  return new Promise<void>((resolve, reject) => {
    chownRecursive(src, uid, gid, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
