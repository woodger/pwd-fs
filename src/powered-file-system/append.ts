import type { PoweredFileSystem } from '../powered-file-system';

/**
 * Backward-compatible append wrapper implemented on top of `write()`.
 */
export function append<T extends boolean = false>(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
  }
): T extends true ? void : Promise<void> {
  const { sync = false as T, encoding = 'utf8', umask = 0o000 } = options ?? {};

  return this.write(src, data, { sync, encoding, umask, flag: 'a' }) as any;
}
