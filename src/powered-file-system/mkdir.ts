import path from 'node:path';
import { mkdir as mkdirRecursive } from '../recurse-io';
import { mkdirSync as mkdirRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Creates directories relative to the instance root.
 */
export function mkdir<T extends boolean = false>(
  this: PoweredFileSystem,
  dir: string,
  options?: { sync?: T; umask?: number }
): T extends true ? void : Promise<void> {
  const { sync = false as T, umask = 0o000 } = options ?? {};
  dir = path.resolve(this.pwd, dir);

  if (sync) {
    mkdirRecursiveSync(dir, umask);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    mkdirRecursive(dir, umask, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
