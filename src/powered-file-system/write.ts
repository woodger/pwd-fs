import fs from 'node:fs';
import path from 'node:path';
import type { Flag, PoweredFileSystem } from '../powered-file-system';

export function write<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
    flag?: Flag;
  }
): T extends true ? void : Promise<void> {
  const {
    sync = false as T,
    encoding = 'utf8',
    umask = 0o000,
    flag = 'w',
  } = options ?? {};
  src = path.resolve(this.pwd, src);

  const mode = 0o666 & ~umask;

  if (sync) {
    fs.writeFileSync(src, data, { encoding, mode, flag });
    fs.chmodSync(src, mode);
    return undefined as any;
  }

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(src, data, { encoding, mode, flag }, (err) => {
      if (err) {
        return reject(err);
      }

      fs.chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }) as any;
}
