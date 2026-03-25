import fs from 'node:fs';
import path from 'node:path';
import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Windows requires an explicit link type. Non-Windows platforms infer it.
 */
function resolveSymlinkType(src: string): fs.symlink.Type | undefined {
  if (process.platform !== 'win32') {
    return undefined;
  }

  const stats = fs.lstatSync(src);
  return stats.isDirectory() ? 'junction' : 'file';
}

export function symlink<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  dest: string,
  options?: { sync?: T }
): T extends true ? void : Promise<void> {
  src = path.resolve(this.pwd, src);
  dest = path.resolve(this.pwd, dest);

  const { sync = false as T } = options ?? {};

  if (sync) {
    const type = resolveSymlinkType(src);
    fs.symlinkSync(src, dest, type);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    if (process.platform === 'win32') {
      fs.lstat(src, (err, stats) => {
        if (err) {
          return reject(err);
        }

        const type: fs.symlink.Type = stats.isDirectory() ? 'junction' : 'file';

        fs.symlink(src, dest, type, (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    }
    else {
      fs.symlink(src, dest, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }
  }) as any;
}
