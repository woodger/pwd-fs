import path from 'node:path';
import { copy as copyRecursive } from '../recurse-io';
import { copySync as copyRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

export function copy<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: { sync?: T; umask?: number }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  dest = path.resolve(this.pwd, dest);

  const { sync = false as T, umask = 0o000 } = options ?? {};

  if (sync) {
    copyRecursiveSync(src, dest, umask);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    copyRecursive(src, dest, umask, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
