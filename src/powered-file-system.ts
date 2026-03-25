import fs from 'node:fs';
import path from 'node:path';
import { bitmask } from './bitmask';
import { append } from './powered-file-system/append';
import { chmod } from './powered-file-system/chmod';
import { chown } from './powered-file-system/chown';
import { copy } from './powered-file-system/copy';
import { mkdir } from './powered-file-system/mkdir';
import { read } from './powered-file-system/read';
import { readdir } from './powered-file-system/readdir';
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
 * All relative paths are resolved against `pwd`, which makes the instance
 * suitable for sandboxed or virtual working-directory workflows.
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
   * Checks whether the given path is accessible with the requested mode.
   */
  test<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
      flag?: Mode;
    }
  ): T extends true ? boolean : Promise<boolean> {
    return test.call(this, src, options);
  }

  /**
   * Returns `lstat` information for a path.
   */
  stat<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
    }
  ): T extends true ? Stats : Promise<Stats> {
    return stat.call(this, src, options);
  }

  /**
   * Applies a mode recursively to a file or directory tree.
   */
  chmod<T extends boolean = false>(
    src: string,
    mode: number,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return chmod.call(this, src, mode, options);
  }

  /**
   * Applies ownership recursively to a file or directory tree.
   */
  chown<T extends boolean = false>(
    src: string,
    options?: { sync?: T; uid?: number; gid?: number }
  ): T extends true ? void : Promise<void> {
    return chown.call(this, src, options);
  }

  /**
   * Creates a symbolic link from `dest` to `src`.
   */
  symlink<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return symlink.call(this, src, dest, options);
  }

  /**
   * Copies `src` into the destination directory.
   */
  copy<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    return copy.call(this, src, dest, options);
  }

  /**
   * Renames or moves a file system node.
   */
  rename<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return rename.call(this, src, dest, options);
  }

  /**
   * Removes a file system node recursively.
   */
  remove<T extends boolean = false>(
    src: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return remove.call(this, src, options);
  }

  /**
   * Reads a file relative to the current instance root.
   */
  read<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
      encoding?: BufferEncoding | null;
      flag?: Flag;
    }
  ): T extends true ? string | Buffer : Promise<string | Buffer> {
    return read.call(this, src, options);
  }

  /**
   * Writes a file and applies the resulting permissions explicitly.
   */
  write<T extends boolean = false>(
    src: string,
    data: Buffer | string,
    options?: {
      sync?: T;
      encoding?: BufferEncoding | null;
      umask?: number;
      flag?: Flag;
    }
  ): T extends true ? void : Promise<void> {
    return write.call(this, src, data, options);
  }

  /**
   * @deprecated Use `write(..., { flag: 'a' })` instead.
   */
  append<T extends boolean = false>(
    src: string,
    data: Buffer | string,
    options?: {
      sync?: T;
      encoding?: BufferEncoding | null;
      umask?: number;
    }
  ): T extends true ? void : Promise<void> {
    return append.call(this, src, data, options);
  }

  /**
   * Lists directory entries relative to the current instance root.
   */
  readdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; encoding?: BufferEncoding | null }
  ): T extends true ? string[] : Promise<string[]> {
    return readdir.call(this, dir, options);
  }

  /**
   * Creates a directory tree relative to the current instance root.
   */
  mkdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    return mkdir.call(this, dir, options);
  }
}
