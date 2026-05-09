import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

type AppendOptions = {
  encoding?: BufferEncoding | null;
  umask?: number;
};

/**
 * Backward-compatible append wrapper implemented on top of `write()`.
 */
export function append(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options: SyncOption & AppendOptions
): void;
export function append(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: AsyncOption & AppendOptions
): Promise<void>;
export function append(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: MaybeSyncOption & AppendOptions
): void | Promise<void>;
export function append(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: MaybeSyncOption & AppendOptions
): void | Promise<void> {
  const { sync = false, encoding = 'utf8', umask = 0o000 } = options ?? {};

  if (sync) {
    return this.write(src, data, { sync: true, encoding, umask, flag: 'a' });
  }

  return this.write(src, data, { encoding, umask, flag: 'a' });
}
