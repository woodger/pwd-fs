import path from 'node:path';
import { copy as copyRecursive } from '../recurse-io';
import { copySync as copyRecursiveSync } from '../recurse-io-sync';
import type { CopyFilter, PoweredFileSystem } from '../powered-file-system';

/**
 * Resolves source and destination paths before delegating recursive copy work.
 */
export function copy<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: { sync?: T; umask?: number; overwrite?: boolean; filter?: CopyFilter }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  dest = path.resolve(this.pwd, dest);

  const {
    sync = false as T,
    umask = 0o000,
    overwrite = false,
    filter
  } = options ?? {};
  const copyOptions = { umask, overwrite, filter };

  if (sync) {
    copyRecursiveSync(src, dest, copyOptions);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    copyRecursive(src, dest, copyOptions, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  }) as any;
}
