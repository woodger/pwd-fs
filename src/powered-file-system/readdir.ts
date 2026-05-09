import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, ReaddirOptions, SyncOption } from '../powered-file-system';

/**
 * Lists directory entries relative to the instance base path.
 */
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options: SyncOption & ReaddirOptions<true, null> & { encoding: null }
): Buffer[];
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options: SyncOption & ReaddirOptions<true, BufferEncoding>
): string[];
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options: AsyncOption & ReaddirOptions<false, null> & { encoding: null }
): Promise<Buffer[]>;
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options?: AsyncOption & ReaddirOptions<false, BufferEncoding>
): Promise<string[]>;
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options?: MaybeSyncOption & ReaddirOptions<boolean, BufferEncoding | null>
): string[] | Buffer[] | Promise<string[] | Buffer[]>;
export function readdir(
  this: PoweredFileSystem,
  dir: string,
  options?: MaybeSyncOption & ReaddirOptions<boolean, BufferEncoding | null>
): string[] | Buffer[] | Promise<string[] | Buffer[]> {
  const { sync = false, encoding = 'utf8' } = options ?? {};

  if (sync) {
    return fs.readdirSync(this.resolve(dir), { encoding });
  }

  return new Promise<string[] | Buffer[]>((resolve, reject) => {
    try {
      dir = this.resolve(dir);
    }
    catch (err) {
      reject(err);
      return;
    }

    fs.readdir(dir, { encoding }, (err, list) => {
      if (err) {
        return reject(err);
      }

      resolve(list);
    });
  });
}
