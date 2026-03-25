import path from 'node:path';
import { chmod as chmodRecursive } from '../recurse-io';
import { chmodSync as chmodRecursiveSync } from '../recurse-io-sync';
import type { PoweredFileSystem } from '../powered-file-system';

export function chmod<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  mode: number,
  options?: { sync?: T }
): T extends true ? void : Promise<void> {
  const { sync = false as T } = options ?? {};
  src = path.resolve(this.pwd, src);

  if (sync) {
    chmodRecursiveSync(src, mode);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    chmodRecursive(src, mode, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
