/**
 * Module public path-aware filesystem wrapper contract.
 *
 * Allowed here:
 * - defining public method overloads and shared option types;
 * - binding method modules to a resolved instance base path;
 * - exposing permission constants and public helpers.
 *
 * This file must not contain recursive filesystem algorithms or test fixture behavior.
 */

import fs from 'node:fs';
import path from 'node:path';
import { bitmask } from './bitmask';
import { append } from './powered-file-system/append';
import { chmod } from './powered-file-system/chmod';
import { chown } from './powered-file-system/chown';
import { copy } from './powered-file-system/copy';
import { emptyDir } from './powered-file-system/empty-dir';
import { mkdir } from './powered-file-system/mkdir';
import { read } from './powered-file-system/read';
import { readlink } from './powered-file-system/readlink';
import { readdir } from './powered-file-system/readdir';
import { realpath } from './powered-file-system/realpath';
import { remove } from './powered-file-system/remove';
import { rename } from './powered-file-system/rename';
import { stat } from './powered-file-system/stat';
import { symlink } from './powered-file-system/symlink';
import { test } from './powered-file-system/test';
import { write } from './powered-file-system/write';

/**
 * Public API entrypoint for the path-aware file system wrapper.
 */
export type Mode = keyof IConstants;
export type Flag = Extract<fs.OpenMode, string>;
export type Stats = fs.Stats;
export type CopyFilter = (src: string, dest: string) => boolean;
export type SyncResult<T extends boolean, TResult> = T extends true ? TResult : Promise<TResult>;
export type SyncOption = { sync: true };
export type AsyncOption = { sync?: false };
export type MaybeSyncOption = { sync?: boolean };
export type ReadResult<TEncoding> = TEncoding extends null ? Buffer : string;
export type ReaddirResult<TEncoding> = TEncoding extends null ? Buffer[] : string[];
export type ReadOptions<TSync extends boolean = boolean, TEncoding extends BufferEncoding | null = BufferEncoding> = {
  sync?: TSync;
  encoding?: TEncoding;
  flag?: Flag;
};
export type ReaddirOptions<TSync extends boolean = boolean, TEncoding extends BufferEncoding | null = BufferEncoding> = {
  sync?: TSync;
  encoding?: TEncoding;
};

export * from './bitmask';

export interface IConstants {
  e: number,
  r: number,
  w: number,
  x: number
}

/**
 * Path-aware wrapper around Node's file system APIs.
 *
 * Relative paths are resolved against `pwd`; absolute paths are preserved.
 */
export class PoweredFileSystem {
  readonly pwd: string;

  /**
   * Access mode aliases used by `test()`.
   */
  readonly constants: IConstants = {
    e: fs.constants.F_OK,
    r: fs.constants.R_OK,
    w: fs.constants.W_OK,
    x: fs.constants.X_OK
  };

  /**
   * Exposes permission mask normalization as a static helper.
   */
  static bitmask = bitmask;

  /**
   * @param pwd Base directory used to resolve all relative paths.
   */
  constructor(pwd?: string) {
    this.pwd = pwd ? path.resolve(pwd) : process.cwd();
  }

  /**
   * Resolves relative paths against `pwd` while preserving absolute paths.
   */
  resolve(src: string): string {
    return path.resolve(this.pwd, src);
  }

  /**
   * Checks whether the given path is accessible with the requested mode.
   */
  test(src: string, options: SyncOption & { flag?: Mode }): boolean;
  test(src: string, options?: AsyncOption & { flag?: Mode }): Promise<boolean>;
  test(src: string, options?: MaybeSyncOption & { flag?: Mode }): boolean | Promise<boolean> {
    return test.call(this, src, options);
  }

  /**
   * Returns `lstat` information for a path.
   */
  stat(src: string, options: SyncOption): Stats;
  stat(src: string, options?: AsyncOption): Promise<Stats>;
  stat(src: string, options?: MaybeSyncOption): Stats | Promise<Stats> {
    return stat.call(this, src, options);
  }

  /**
   * Applies a mode recursively to a file or directory tree.
   */
  chmod(src: string, mode: number, options: SyncOption): void;
  chmod(src: string, mode: number, options?: AsyncOption): Promise<void>;
  chmod(src: string, mode: number, options?: MaybeSyncOption): void | Promise<void> {
    return chmod.call(this, src, mode, options);
  }

  /**
   * Applies ownership recursively to a file or directory tree.
   */
  chown(src: string, options: SyncOption & { uid?: number; gid?: number }): void;
  chown(src: string, options?: AsyncOption & { uid?: number; gid?: number }): Promise<void>;
  chown(src: string, options?: MaybeSyncOption & { uid?: number; gid?: number }): void | Promise<void> {
    return chown.call(this, src, options);
  }

  /**
   * Creates a symbolic link from `dest` to `src`.
   */
  symlink(src: string, dest: string, options: SyncOption): void;
  symlink(src: string, dest: string, options?: AsyncOption): Promise<void>;
  symlink(src: string, dest: string, options?: MaybeSyncOption): void | Promise<void> {
    return symlink.call(this, src, dest, options);
  }

  /**
   * Copies `src` into the destination directory.
   */
  copy(src: string, dest: string, options: SyncOption & { umask?: number; overwrite?: boolean; filter?: CopyFilter }): void;
  copy(src: string, dest: string, options?: AsyncOption & { umask?: number; overwrite?: boolean; filter?: CopyFilter }): Promise<void>;
  copy(src: string, dest: string, options?: MaybeSyncOption & { umask?: number; overwrite?: boolean; filter?: CopyFilter }): void | Promise<void> {
    return copy.call(this, src, dest, options);
  }

  /**
   * Renames or moves a file system node.
   */
  rename(src: string, dest: string, options: SyncOption): void;
  rename(src: string, dest: string, options?: AsyncOption): Promise<void>;
  rename(src: string, dest: string, options?: MaybeSyncOption): void | Promise<void> {
    return rename.call(this, src, dest, options);
  }

  /**
   * Removes a file system node recursively.
   */
  remove(src: string, options: SyncOption): void;
  remove(src: string, options?: AsyncOption): Promise<void>;
  remove(src: string, options?: MaybeSyncOption): void | Promise<void> {
    return remove.call(this, src, options);
  }

  /**
   * Removes all directory entries while preserving the directory itself.
   */
  emptyDir(src: string, options: SyncOption): void;
  emptyDir(src: string, options?: AsyncOption): Promise<void>;
  emptyDir(src: string, options?: MaybeSyncOption): void | Promise<void> {
    return emptyDir.call(this, src, options);
  }

  /**
   * Reads a file relative to the current instance path.
   */
  read(src: string, options: SyncOption & ReadOptions<true, null> & { encoding: null }): Buffer;
  read(src: string, options: SyncOption & ReadOptions<true, BufferEncoding>): string;
  read(src: string, options: AsyncOption & ReadOptions<false, null> & { encoding: null }): Promise<Buffer>;
  read(src: string, options?: AsyncOption & ReadOptions<false, BufferEncoding>): Promise<string>;
  read(src: string, options?: MaybeSyncOption & ReadOptions<boolean, BufferEncoding | null>): string | Buffer | Promise<string | Buffer> {
    return read.call(this, src, options);
  }

  /**
   * Writes a file and applies the resulting permissions explicitly.
   */
  write(src: string, data: Buffer | string, options: SyncOption & { encoding?: BufferEncoding | null; umask?: number; flag?: Flag }): void;
  write(src: string, data: Buffer | string, options?: AsyncOption & { encoding?: BufferEncoding | null; umask?: number; flag?: Flag }): Promise<void>;
  write(src: string, data: Buffer | string, options?: MaybeSyncOption & { encoding?: BufferEncoding | null; umask?: number; flag?: Flag }): void | Promise<void> {
    return write.call(this, src, data, options);
  }

  /**
   * @deprecated Use `write(..., { flag: 'a' })` instead.
   */
  append(src: string, data: Buffer | string, options: SyncOption & { encoding?: BufferEncoding | null; umask?: number }): void;
  append(src: string, data: Buffer | string, options?: AsyncOption & { encoding?: BufferEncoding | null; umask?: number }): Promise<void>;
  append(src: string, data: Buffer | string, options?: MaybeSyncOption & { encoding?: BufferEncoding | null; umask?: number }): void | Promise<void> {
    return append.call(this, src, data, options);
  }

  /**
   * Lists directory entries relative to the current instance path.
   */
  readdir(dir: string, options: SyncOption & ReaddirOptions<true, null> & { encoding: null }): Buffer[];
  readdir(dir: string, options: SyncOption & ReaddirOptions<true, BufferEncoding>): string[];
  readdir(dir: string, options: AsyncOption & ReaddirOptions<false, null> & { encoding: null }): Promise<Buffer[]>;
  readdir(dir: string, options?: AsyncOption & ReaddirOptions<false, BufferEncoding>): Promise<string[]>;
  readdir(dir: string, options?: MaybeSyncOption & ReaddirOptions<boolean, BufferEncoding | null>): string[] | Buffer[] | Promise<string[] | Buffer[]> {
    return readdir.call(this, dir, options);
  }

  /**
   * Resolves the target of a symbolic link.
   */
  readlink(src: string, options: SyncOption & { encoding?: BufferEncoding }): string;
  readlink(src: string, options?: AsyncOption & { encoding?: BufferEncoding }): Promise<string>;
  readlink(src: string, options?: MaybeSyncOption & { encoding?: BufferEncoding }): string | Promise<string> {
    return readlink.call(this, src, options);
  }

  /**
   * Resolves a path to its canonical absolute location.
   */
  realpath(src: string, options: SyncOption & { encoding?: BufferEncoding }): string;
  realpath(src: string, options?: AsyncOption & { encoding?: BufferEncoding }): Promise<string>;
  realpath(src: string, options?: MaybeSyncOption & { encoding?: BufferEncoding }): string | Promise<string> {
    return realpath.call(this, src, options);
  }

  /**
   * Creates a directory tree relative to the current instance path.
   */
  mkdir(dir: string, options: SyncOption & { umask?: number }): void;
  mkdir(dir: string, options?: AsyncOption & { umask?: number }): Promise<void>;
  mkdir(dir: string, options?: MaybeSyncOption & { umask?: number }): void | Promise<void> {
    return mkdir.call(this, dir, options);
  }
}
