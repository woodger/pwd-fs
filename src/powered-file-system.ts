import fs, { NoParamCallback } from 'node:fs';
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

  test(src: string, options: {
    sync: true,
    flag?: Mode
  }): boolean;
  
  test(src: string, options?: {
    sync?: false,
    flag?: Mode
  }): Promise<boolean>;
  
  test(src: string, { sync = false, flag = 'e' }: {
    sync?: boolean,
    flag?: Mode
  } = {}) {
    const mode = this.constants[flag];

    src = path.resolve(this.pwd, src);

    if (sync) {
      return fs.existsSync(src);
    }

    return new Promise((resolve) => {
      fs.access(src, mode, (err) => {
        if (err) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }

  stat(src: string, options: { sync: true }): Stats;
  
  stat(src: string, options?: { sync?: false }): Promise<Stats>;
  
  stat(src: string, { sync = false }: { sync?: boolean } = {}) {
    src = this.resolve(src);

    if (sync) {
      return fs.lstatSync(src);
    }

    return new Promise((resolve, reject) => {
      fs.lstat(src, (err, stats) => {
        if (err) {
          return reject(err);
        }

        resolve(stats);
      });
    });
  }

  chmod(src: string, mode: number, options: {
    sync: true
  }): void;
  
  chmod(src: string, mode: number, options?: {
    sync?: false
  }): Promise<void>;
  
  chmod(src: string, mode: number, { sync = false }: { sync?: boolean } = {}) {
    src = this.resolve(src);

    if (sync) {
      return chmodSync(src, mode);
    }

    return new Promise<void>((resolve, reject) => {
      chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  chown(src: string, options: {
    sync: true,
    uid?: number,
    gid?: number
  }): void;

  chown(src: string, options?: {
    sync?: false,
    uid?: number,
    gid?: number
  }): Promise<void>;

  chown(src: string, { sync = false, uid = 0, gid = 0 }: { sync?: boolean, uid?: number, gid?: number } = {}) {
    src = this.resolve(src);

    if (sync) {
      return chownSync(src, uid, gid);
    }

    return new Promise<void>((resolve, reject) => {
      chown(src, uid, gid, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  symlink(src: string, use: string, options: {
    sync: true
  }): void;

  symlink(src: string, use: string, options?: {
    sync?: false
  }): Promise<void>;

  symlink(src: string, use: string, { sync = false }: { sync?: boolean } = {}) {
    src = this.resolve(src);
    use = this.resolve(use);

    if (sync) {
      return fs.symlinkSync(src, use);
    }

    return new Promise<void>((resolve, reject) => {
      fs.symlink(src, use, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  copy(src: string, dir: string, options: {
    sync: true,
    umask?: number
  }): void;

  copy(src: string, dir: string, options?: {
    sync?: false,
    umask?: number
  }): Promise<void>;

  copy(src: string, dir: string, { sync = false, umask = 0o000 }: {
    sync?: boolean,
    umask?: number
  } = {}) {
    src = this.resolve(src);
    dir = this.resolve(dir);
    
    if (sync) {
      return copySync(src, dir, umask);
    }

    return new Promise<void>((resolve, reject) => {
      copy(src, dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  rename(src: string, use: string, options: {
    sync: true
  }): void;

  rename(src: string, use: string, options?: {
    sync?: false
  }): Promise<void>;

  rename(src: string, use: string, { sync = false }: { sync?: boolean } = {}) {
    src = this.resolve(src);
    use = this.resolve(use);

    if (sync) {
      return fs.renameSync(src, use);
    }

    return new Promise<void>((resolve, reject) => {
      fs.rename(src, use, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  remove(src: string, options: {
    sync: true
  }): void;

  remove(src: string, options?: {
    sync?: false
  }): Promise<void>;

  remove(src: string, { sync = false }: { sync?: boolean } = {}) {
    src = this.resolve(src);

    if (sync) {
      removeSync(src);
    }

    return new Promise<void>((resolve, reject) => {
      const callback: NoParamCallback = (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      };

      if ('rm' in fs) {
        return fs.rm(src, { recursive: true }, callback);
      }
      
      remove(src, callback);
    });
  }

  read(src: string, options: {
    sync: true,
    encoding?: BufferEncoding,
    flag?: Flag
  }): string;

  read(src: string, options: {
    sync: true,
    encoding?: null,
    flag?: Flag
  }): Buffer;

  read(src: string, options: {
    sync?: false,
    encoding: null,
    flag?: Flag
  }): Promise<Buffer>;

  read(src: string, options?: {
    sync?: false,
    encoding?: BufferEncoding,
    flag?: Flag
  }): Promise<string>;

  read(src: string, { sync = false, encoding = 'utf8', flag = 'r' }: {
    sync?: boolean,
    encoding?: BufferEncoding | null,
    flag?: Flag
  } = {}) {
    src = this.resolve(src);

    if (sync) {
      return fs.readFileSync(src, {
        encoding,
        flag
      });
    }

    return new Promise((resolve, reject) => {
      fs.readFile(src, {
        encoding,
        flag
      },
      (err, raw) => {
        if (err) {
          return reject(err);
        }

        resolve(raw);
      });
    });
  }

  write(src: string, data: Buffer, options: {
    sync: true,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): void;

  write(src: string, data: string, options: {
    sync: true,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): void;

  write(src: string, data: Buffer, options: {
    sync?: false,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  write(src: string, data: string, options?: {
    sync?: false,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  write(src: string, data: Buffer | string, { sync = false, encoding = 'utf8', umask = 0o000, flag = 'w' }: {
    sync?: boolean,
    encoding?: BufferEncoding | null,
    umask?: number,
    flag?: Flag
  } = {}) {
    src = this.resolve(src);

    const mode = 0o666 - umask;

    if (sync) {
      return fs.writeFileSync(src, data, {
        encoding,
        mode,
        flag
      });
    }

    return new Promise<void>((resolve, reject) => {
      fs.writeFile(src, data, {
        encoding,
        mode,
        flag
      },
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  /**
  * @deprecated The method should not be used
  */
  append(src: string, data: Buffer, options: {
    sync: true,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): void;

  /**
  * @deprecated The method should not be used
  */
  append(src: string, data: string, options: {
    sync: true,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): void;

  /**
  * @deprecated The method should not be used
  */
  append(src: string, data: Buffer, options: {
    sync?: false,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  /**
  * @deprecated The method should not be used
  */
  append(src: string, data: string, options?: {
    sync?: false,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  /**
  * @deprecated The method should not be used
  */
  append(src: string, data: Buffer | string, { sync = false, encoding = 'utf8', umask = 0o000, flag = 'a' }: {
    sync?: boolean,
    encoding?: BufferEncoding | null,
    umask?: number,
    flag?: Flag
  } = {}) {
    src = this.resolve(src);
    const mode = 0o666 - umask;

    if (sync) {
      return fs.appendFileSync(src, data, {
        encoding,
        mode,
        flag
      });
    }

    return new Promise<void>((resolve, reject) => {
      fs.appendFile(src, data, {
        encoding,
        mode,
        flag
      },
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  readdir(dir: string, options: {
    sync: true,
    encoding?: BufferEncoding | null
  }): string[];

  readdir(dir: string, options?: {
    sync?: false,
    encoding?: BufferEncoding | null
  }): Promise<string[]>;

  readdir(dir: string, { sync = false, encoding = 'utf8' }: {
    sync?: boolean,
    encoding?: BufferEncoding | null
  } = {}) {
    dir = this.resolve(dir);

    if (sync) {
      return fs.readdirSync(dir, {
        encoding
      });
    }

    return new Promise((resolve, reject) => {
      fs.readdir(dir, { encoding }, (err, list) => {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  }

  mkdir(dir: string, options: {
    sync: true,
    umask?: number
  }): void;

  mkdir(dir: string, options?: {
    sync?: false,
    umask?: number
  }): Promise<void>;

  mkdir(dir: string, { umask = 0o000, sync = false }: {
    umask?: number,
    sync?: boolean
  } = {}) {
    dir = this.resolve(dir);

    if (sync) {
      return mkdirSync(dir, umask);
    }

    return new Promise<void>((resolve, reject) => {
      mkdir(dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}