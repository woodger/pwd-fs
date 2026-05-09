import fs from 'node:fs';
import type { AsyncOption, MaybeSyncOption, Mode, PoweredFileSystem, SyncOption } from '../powered-file-system';

/**
 * Thin wrapper around `fs.access` that resolves paths against the instance base path.
 */
export function test(
  this: PoweredFileSystem,
  src: string,
  options: SyncOption & { flag?: Mode }
): boolean;
export function test(
  this: PoweredFileSystem,
  src: string,
  options?: AsyncOption & { flag?: Mode }
): Promise<boolean>;
export function test(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & { flag?: Mode }
): boolean | Promise<boolean>;
export function test(
  this: PoweredFileSystem,
  src: string,
  options?: MaybeSyncOption & { flag?: Mode }
): boolean | Promise<boolean> {
  const { sync = false, flag = 'e' } = options ?? {};
  const mode = this.constants[flag];

  if (sync) {
    try {
      src = this.resolve(src);
      fs.accessSync(src, mode);
      return true;
    }
    catch {
      return false;
    }
  }

  return new Promise<boolean>((resolve) => {
    try {
      src = this.resolve(src);
    }
    catch {
      resolve(false);
      return;
    }

    fs.access(src, mode, (err) => {
      resolve(!err);
    });
  });
}
