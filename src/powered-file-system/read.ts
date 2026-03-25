import fs from 'node:fs';
import path from 'node:path';
import type { Flag, PoweredFileSystem } from '../powered-file-system';

export function read<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    flag?: Flag;
  }
): T extends true ? string | Buffer : Promise<string | Buffer> {
  const { sync = false as T, encoding = 'utf8', flag = 'r' } = options ?? {};
  const resolved = path.resolve(this.pwd, src);

  if (sync) {
    if (encoding === null) {
      return fs.readFileSync(resolved, { encoding: null, flag }) as any;
    }

    return fs.readFileSync(resolved, { encoding, flag }) as any;
  }

  return new Promise((resolve, reject) => {
    fs.readFile(resolved, { encoding, flag }, (err, raw) => {
      if (err) {
        return reject(err);
      }

      resolve(raw);
    });
  }) as any;
}
