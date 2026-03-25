import fs from 'node:fs';
import path from 'node:path';
import type { PoweredFileSystem, Stats } from '../powered-file-system';

export function stat<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: {
    sync?: T;
  }
): T extends true ? Stats : Promise<Stats> {
  const { sync = false as T } = options ?? {};
  src = path.resolve(this.pwd, src);

  if (sync) {
    return fs.lstatSync(src) as any;
  }

  return new Promise<Stats>((resolve, reject) => {
    fs.lstat(src, (err, stats) => {
      if (err) {
        return reject(err);
      }

      resolve(stats);
    });
  }) as any;
}
