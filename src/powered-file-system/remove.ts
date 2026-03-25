import fs from 'node:fs';
import path from 'node:path';
import { remove as removeRecursive } from '../recurse-io';
import { removeSync as removeRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

export function remove<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  const { sync = false as T } = options ?? {};

  if (sync) {
    removeRecursiveSync(src);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    const callback: fs.NoParamCallback = (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    };

    if ('rm' in fs) {
      fs.rm(src, { recursive: true }, callback);
    }
    else {
      removeRecursive(src, callback);
    }
  }) as any;
}
