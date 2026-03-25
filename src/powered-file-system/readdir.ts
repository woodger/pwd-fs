import fs from 'node:fs';
import path from 'node:path';
import type { PoweredFileSystem } from '../powered-file-system';

export function readdir<T extends boolean = false>(
  this: PoweredFileSystem,
  dir: string,
  options?: { sync?: T; encoding?: BufferEncoding | null }
): T extends true ? string[] : Promise<string[]> {
  const { sync = false as T, encoding = 'utf8' } = options ?? {};
  dir = path.resolve(this.pwd, dir);

  if (sync) {
    return fs.readdirSync(dir, { encoding }) as any;
  }

  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, { encoding }, (err, list) => {
      if (err) {
        return reject(err);
      }

      resolve(list);
    });
  }) as any;
}
