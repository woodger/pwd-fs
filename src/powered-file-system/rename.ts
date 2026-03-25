import fs from 'node:fs';
import path from 'node:path';
import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Resolves both paths against the instance root before delegating to Node's rename API.
 */
export function rename<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  dest = path.resolve(this.pwd, dest);

  const { sync = false as T } = options ?? {};

  if (sync) {
    fs.renameSync(src, dest);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    fs.rename(src, dest, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
