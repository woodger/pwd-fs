import fs from 'node:fs';
import path from 'node:path';
import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Resolves a path to its canonical absolute location.
 */
export function realpath<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: { sync?: T; encoding?: BufferEncoding }
): T extends true ? string : Promise<string> {
  src = path.resolve(this.pwd, src);
  const { sync = false as T, encoding = 'utf8' } = options ?? {};

  if (sync) {
    return fs.realpathSync(src, { encoding }) as any;
  }

  return new Promise<string>((resolve, reject) => {
    fs.realpath(src, { encoding }, (err, resolved) => {
      if (err) {
        return reject(err);
      }

      resolve(resolved as string);
    });
  }) as any;
}
