import fs from 'node:fs';
import path from 'node:path';
import recurse, { Files, NoParamCallback } from './recurse-io';
import recurseSync from './recurse-io-sync';

export type Mode = keyof Constants;
export type Flag = Mode | 'a';
export type Stats = fs.Stats;

export interface Constants {
  e: number,
  r: number,
  w: number,
  x: number
}

const permissions = [
  0o400, // OWNER_READ
  0o200, // OWNER_WRITE
  0o100, // OWNER_EXECUTE
  0o040, // GROUP_READ
  0o020, // GROUP_WRITE
  0o010, // GROUP_EXECUTE
  0o004, // OTHERS_READ
  0o002, // OTHERS_WRITE
  0o001, // OTHERS_EXECUTE
];

export default class PoweredFileSystem {
  readonly pwd: string;

  readonly constants: Constants = {
    e: fs.constants.F_OK,
    r: fs.constants.R_OK,
    w: fs.constants.W_OK,
    x: fs.constants.X_OK
  };

  constructor(pwd?: string) {
    this.pwd = pwd ? path.resolve(pwd) : process.cwd();
  }

  test(src: string, options: {
    sync: true,
    resolve?: boolean,
    flag?: Mode
  }): boolean;

  test(src: string, options?: {
    sync?: false,
    resolve?: boolean,
    flag?: Mode
  }): Promise<boolean>;

  test(src: string, { sync = false, resolve = true, flag = 'e' }: {
    sync?: boolean,
    resolve?: boolean,
    flag?: Mode
  } = {}) {
    const mode = this.constants[flag];

    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

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

  stat(src: string, options: { sync: true, resolve?: boolean }): Stats;

  stat(src: string, options?: { sync?: false, resolve?: boolean }): Promise<Stats>;

  stat(src: string, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

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
    sync: true,
    resolve?: boolean
  }): void;

  chmod(src: string, mode: number, options?: {
    sync?: false,
    resolve?: boolean
  }): Promise<void>;

  chmod(src: string, mode: number, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

    if (sync) {
      return recurseSync.chmod(src, mode);
    }

    return new Promise<void>((resolve, reject) => {
      recurse.chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  chown(src: string, uid: number, gid: number, options: {
    sync: true,
    resolve?: boolean
  }): void;

  chown(src: string, uid: number, gid: number, options?: {
    sync?: false,
    resolve?: boolean
  }): Promise<void>;

  chown(src: string, uid: number, gid: number, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

    if (sync) {
      return recurseSync.chown(src, uid, gid);
    }

    return new Promise<void>((resolve, reject) => {
      recurse.chown(src, uid, gid, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  symlink(src: string, use: string, options: {
    sync: true,
    resolve?: boolean
  }): void;

  symlink(src: string, use: string, options?: {
    sync?: false,
    resolve?: boolean
  }): Promise<void>;

  symlink(src: string, use: string, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
      use = this.resolve(use);
    }

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
    resolve?: boolean,
    umask?: number
  }): void;

  copy(src: string, dir: string, options?: {
    sync?: false,
    resolve?: boolean,
    umask?: number
  }): Promise<void>;

  copy(src: string, dir: string, { sync = false, resolve = true, umask = 0o000 }: {
    sync?: boolean,
    resolve?: boolean,
    umask?: number
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
      dir = this.resolve(dir);
    }

    if (sync) {
      return recurseSync.copy(src, dir, umask);
    }

    return new Promise<void>((resolve, reject) => {
      recurse.copy(src, dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  rename(src: string, use: string, options: {
    sync: true,
    resolve?: boolean
  }): void;

  rename(src: string, use: string, options?: {
    sync?: false,
    resolve?: boolean
  }): Promise<void>;

  rename(src: string, use: string, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
      use = this.resolve(use);
    }

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
    sync: true,
    resolve?: boolean
  }): void;

  remove(src: string, options?: {
    sync?: false,
    resolve?: boolean
  }): Promise<void>;

  remove(src: string, { sync = false, resolve = true }: {
    sync?: boolean,
    resolve?: boolean
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

    if (sync) {
      return recurseSync.remove(src);
    }

    return new Promise<void>((resolve, reject) => {
      recurse.remove(src, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  read(src: string, options: {
    sync: true,
    resolve?: boolean,
    encoding?: BufferEncoding,
    flag?: Flag
  }): string;

  read(src: string, options: {
    sync: true,
    resolve?: boolean,
    encoding?: null,
    flag?: Flag
  }): Buffer;

  read(src: string, options: {
    sync?: false,
    resolve?: boolean,
    encoding: null,
    flag?: Flag
  }): Promise<Buffer>;

  read(src: string, options?: {
    sync?: false,
    resolve?: boolean,
    encoding?: BufferEncoding,
    flag?: Flag
  }): Promise<string>;

  read(src: string, { sync = false, resolve = true, encoding = 'utf8', flag = 'r' }: {
    sync?: boolean,
    resolve?: boolean,
    encoding?: BufferEncoding | null,
    flag?: Flag
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

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
    resolve?: boolean,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): void;

  write(src: string, data: string, options: {
    sync: true,
    resolve?: boolean,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): void;

  write(src: string, data: Buffer, options: {
    sync?: false,
    resolve?: boolean,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  write(src: string, data: string, options?: {
    sync?: false,
    resolve?: boolean,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  write(src: string, data: Buffer | string, { sync = false, resolve = true, encoding = 'utf8', umask = 0o000, flag = 'w' }: {
    sync?: boolean,
    resolve?: boolean,
    encoding?: BufferEncoding | null,
    umask?: number,
    flag?: Flag
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

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

  append(src: string, data: Buffer, options: {
    sync: true,
    resolve?: boolean,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): void;

  append(src: string, data: string, options: {
    sync: true,
    resolve?: boolean,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): void;

  append(src: string, data: Buffer, options: {
    sync?: false,
    resolve?: boolean,
    encoding: null,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  append(src: string, data: string, options?: {
    sync?: false,
    resolve?: boolean,
    encoding?: BufferEncoding,
    umask?: number,
    flag?: Flag
  }): Promise<void>;

  append(src: string, data: Buffer | string, { sync = false, resolve = true, encoding = 'utf8', umask = 0o000, flag = 'a' }: {
    sync?: boolean,
    resolve?: boolean,
    encoding?: BufferEncoding | null,
    umask?: number,
    flag?: Flag
  } = {}) {
    if (resolve) {
      src = this.resolve(src);
    }

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
    resolve?: boolean,
    encoding?: BufferEncoding | null
  }): string[];

  readdir(dir: string, options?: {
    sync?: false,
    resolve?: boolean,
    encoding?: BufferEncoding | null
  }): Promise<string[]>;

  readdir(dir: string, { sync = false, resolve = true, encoding = 'utf8' }: {
    sync?: boolean,
    resolve?: boolean,
    encoding?: BufferEncoding | null
  } = {}) {
    if (resolve) {
      dir = this.resolve(dir);
    }

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
    resolve?: boolean,
    umask?: number
  }): void;

  mkdir(dir: string, options?: {
    sync?: false,
    resolve?: boolean,
    umask?: number
  }): Promise<void>;

  mkdir(dir: string, { umask = 0o000, resolve = true, sync = false }: {
    umask?: number,
    resolve?: boolean,
    sync?: boolean
  } = {}) {
    if (resolve) {
      dir = this.resolve(dir);
    }

    if (sync) {
      return recurseSync.mkdir(dir, umask);
    }

    return new Promise<void>((resolve, reject) => {
      recurse.mkdir(dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  private resolve(src: string): string {
    return path.resolve(this.pwd, src);
  }

  static bitmask(mode: number) {
    if (typeof mode !== 'number') {
      throw new Error(
        `Argument of type '${typeof mode}' is not assignable to parameter of type 'number'.`
      );
    }

    let umask = 0o000;

    for (const flag of permissions) {
      if (mode & flag) {
        umask += flag;
      }
    }

    return umask;
  }
}
