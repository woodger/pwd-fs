import fs from 'node:fs';
import path from 'node:path';
import type { Mode, PoweredFileSystem } from '../powered-file-system';

/**
 * Thin wrapper around `fs.access` that resolves paths against the instance root.
 */
export function test<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  options?: {
    sync?: T;
    flag?: Mode;
  }
): T extends true ? boolean : Promise<boolean> {
  const { sync = false as T, flag = 'e' } = options ?? {};
  const mode = this.constants[flag];
  src = path.resolve(this.pwd, src);

  if (sync) {
    try {
      fs.accessSync(src, mode);
      return true as any;
    }
    catch {
      return false as any;
    }
  }

  return new Promise<boolean>((resolve) => {
    fs.access(src, mode, (err) => {
      resolve(!err);
    });
  }) as any;
}
