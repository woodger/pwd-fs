import path from 'node:path';
import { emptyDir as emptyDirRecursive } from '../recurse-io';
import { emptyDirSync as emptyDirRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Removes directory contents while preserving the directory itself.
 */
export function emptyDir<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  const { sync = false as T } = options ?? {};

  if (sync) {
    emptyDirRecursiveSync(src);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    emptyDirRecursive(src, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
