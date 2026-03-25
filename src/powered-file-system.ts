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

export type Mode = keyof IConstants;
export type Flag = Mode | 'a';
export type Stats = fs.Stats;

export * from './bitmask';

export interface IConstants {
  e: number,
  r: number,
  w: number,
  x: number
}

export class PoweredFileSystem {
  readonly pwd: string;

  readonly constants: IConstants = {
    e: fs.constants.F_OK,
    r: fs.constants.R_OK,
    w: fs.constants.W_OK,
    x: fs.constants.X_OK
  };

  static bitmask = bitmask;

  constructor(pwd?: string) {
    this.pwd = pwd ? path.resolve(pwd) : process.cwd();
  }

  test<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
      flag?: Mode;
    }
  ): T extends true ? boolean : Promise<boolean> {
    return test.call(this, src, options);
  }

  stat<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
    }
  ): T extends true ? Stats : Promise<Stats> {
    return stat.call(this, src, options);
  }

  chmod<T extends boolean = false>(
    src: string,
    mode: number,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return chmod.call(this, src, mode, options);
  }

  chown<T extends boolean = false>(
    src: string,
    options?: { sync?: T; uid?: number; gid?: number }
  ): T extends true ? void : Promise<void> {
    return chown.call(this, src, options);
  }

  symlink<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return symlink.call(this, src, dest, options);
  }

  copy<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    return copy.call(this, src, dest, options);
  }

  rename<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return rename.call(this, src, dest, options);
  }

  remove<T extends boolean = false>(
    src: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    return remove.call(this, src, options);
  }

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
  * @deprecated The method should not be used
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

  readdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; encoding?: BufferEncoding | null }
  ): T extends true ? string[] : Promise<string[]> {
    return readdir.call(this, dir, options);
  }

  mkdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    return mkdir.call(this, dir, options);
  }
}
