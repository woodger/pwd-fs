/**
 * Module write method adapter for the path-aware filesystem wrapper.
 *
 * Allowed here:
 * - resolving file paths against the instance base path;
 * - applying write options and explicit final permissions;
 * - selecting async or sync file write execution.
 *
 * This file must not contain append compatibility routing or stream handling.
 */

import fs from 'node:fs';
import type { AsyncOption, Flag, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';

type WriteOptions = {
  encoding?: BufferEncoding | null;
  umask?: number;
  flag?: Flag;
};

/**
 * Writes a file relative to `pwd` and then reapplies the computed permissions explicitly.
 */
export function write(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options: SyncOption & WriteOptions
): void;
export function write(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: AsyncOption & WriteOptions
): Promise<void>;
export function write(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: MaybeSyncOption & WriteOptions
): void | Promise<void>;
export function write(
  this: PoweredFileSystem,
  src: string,
  data: Buffer | string,
  options?: MaybeSyncOption & WriteOptions
): void | Promise<void> {
  const {
    sync = false,
    encoding = 'utf8',
    umask = 0o000,
    flag = 'w',
  } = options ?? {};

  const mode = 0o666 & ~umask;

  if (sync) {
    src = this.resolve(src);
    // Apply chmod explicitly so the final mode is deterministic across runtimes.
    fs.writeFileSync(src, data, { encoding, mode, flag });
    fs.chmodSync(src, mode);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    try {
      src = this.resolve(src);
    }
    catch (err) {
      reject(err);
      return;
    }

    fs.writeFile(src, data, { encoding, mode, flag }, (err) => {
      if (err) {
        return reject(err);
      }

      // Align async behavior with the synchronous branch.
      fs.chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}
