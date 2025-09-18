import fs from 'node:fs';
import path from 'node:path';
import { chmod, chown, copy, remove, mkdir } from './recurse-io';
import { chmodSync, chownSync, copySync, removeSync, mkdirSync } from './recurse-io-sync';
import { bitmask } from './bitmask';

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
  
  private resolve(src: string) {
    return path.resolve(this.pwd, src);
  }

  test<T extends boolean = false>(
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
      return fs.existsSync(src) as any;
    }

    return new Promise<boolean>((resolve) => {
      fs.access(src, mode, (err) => {
        resolve(!err);
      });
    }) as any;
  }

  stat<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
    }
  ): T extends true ? Stats : Promise<Stats> {
    const { sync = false as T } = options ?? {};
    src = this.resolve(src);

    if (sync) {
      return fs.lstatSync(src) as any;
    }

    return new Promise<Stats>((resolve, reject) => {
      fs.lstat(src, (err, stats) => {
        if (err) {
          return reject(err);
        }

        resolve(stats);
      });
    }) as any;
  }

  chmod<T extends boolean = false>(
    src: string,
    mode: number,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    const { sync = false as T } = options ?? {};
    src = this.resolve(src);

    if (sync) {
      chmodSync(src, mode);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  chown<T extends boolean = false>(
    src: string,
    options?: { sync?: T; uid?: number; gid?: number }
  ): T extends true ? void : Promise<void> {
    const { sync = false as T, uid = 0, gid = 0 } = options ?? {};
    src = this.resolve(src);

    if (sync) {
      chownSync(src, uid, gid);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      chown(src, uid, gid, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  symlink<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    src = this.resolve(src);
    dest = this.resolve(dest);

    const { sync = false as T } = options ?? {};

    if (sync) {
      fs.symlinkSync(src, dest);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      fs.symlink(src, dest, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  copy<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    src = this.resolve(src);
    dest = this.resolve(dest);

    const { sync = false as T, umask = 0o000 } = options ?? {};

    if (sync) {
      copySync(src, dest, umask);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      copy(src, dest, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  rename<T extends boolean = false>(
    src: string,
    dest: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    src = this.resolve(src);
    dest = this.resolve(dest);

    const { sync = false as T } = options ?? {};

    if (sync) {
      fs.renameSync(src, dest);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      fs.rename(src, dest, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }

  remove<T extends boolean = false>(
    src: string,
    options?: { sync?: T }
  ): T extends true ? void : Promise<void> {
    src = this.resolve(src);
    const { sync = false as T } = options ?? {};

    if (sync) {
      removeSync(src);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      const callback: fs.NoParamCallback = (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      };

      if ('rm' in fs) {
        fs.rm(src, { recursive: true }, callback);
      }
      else {
        remove(src, callback);
      }
    }) as any;
  }

  read<T extends boolean = false>(
    src: string,
    options?: {
      sync?: T;
      encoding?: BufferEncoding | null;
      flag?: Flag;
    }
  ): T extends true ? string | Buffer : Promise<string | Buffer> {
    const { sync = false as T, encoding = 'utf8', flag = 'r' } = options ?? {};
    const resolved = this.resolve(src);

    if (sync) {
      if (encoding === null) {
        return fs.readFileSync(resolved, { encoding: null, flag }) as any;
      }
      else {
        return fs.readFileSync(resolved, { encoding, flag }) as any;
      }
    }

    return new Promise((resolve, reject) => {
      fs.readFile(resolved, { encoding, flag }, (err, raw) => {
        if (err) {
          return reject(err);
        }
        
        resolve(raw);
      });
    }) as any;
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
    const {
      sync = false as T,
      encoding = 'utf8',
      umask = 0o000,
      flag = 'w',
    } = options ?? {};
    src = this.resolve(src);

    const mode = 0o666 - umask;

    if (sync) {
      fs.writeFileSync(src, data, { encoding, mode, flag });
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      fs.writeFile(src, data, { encoding, mode, flag }, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
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
    const { sync = false as T, encoding = 'utf8', umask = 0o000 } = options ?? {};

    return this.write(src, data, { sync, encoding, umask, flag: 'a' }) as any;
  }

  readdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; encoding?: BufferEncoding | null }
  ): T extends true ? string[] : Promise<string[]> {
    const { sync = false as T, encoding = 'utf8' } = options ?? {};
    dir = this.resolve(dir);

    if (sync) {
      return fs.readdirSync(dir, { encoding }) as any;
    }

    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(dir, { encoding }, (err, list) => {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    }) as any;
  }

  mkdir<T extends boolean = false>(
    dir: string,
    options?: { sync?: T; umask?: number }
  ): T extends true ? void : Promise<void> {
    const { sync = false as T, umask = 0o000 } = options ?? {};
    dir = this.resolve(dir);

    if (sync) {
      mkdirSync(dir, umask);
      return undefined as any;
    }

    return new Promise<void>((resolve, reject) => {
      mkdir(dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    }) as any;
  }
}