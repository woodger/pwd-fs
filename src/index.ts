import fs from 'fs';
import path from 'path';
import recurse from './recurse-io';
import recurseSync from './recurse-io-sync';

type Flag = 'a' | 'e' | 'r' | 'w' | 'x';

interface Constants {
  [key: string]: number
}

class PoweredFileSystem {
  readonly pwd: string = process.cwd()

  #constants: Constants = {
    e: fs.constants.F_OK,
    r: fs.constants.R_OK,
    w: fs.constants.W_OK,
    x: fs.constants.X_OK
  }

  constructor(pwd?: string) {
    if (pwd) {
      this.pwd = path.resolve(pwd);
    }
  }

  static bitmask(mode: number) {
    let umask = 0o000;

    if (mode & 256) {
      umask += 0o400;
    }

    if (mode & 128) {
      umask += 0o200;
    }

    if (mode & 64) {
      umask += 0o100;
    }

    if (mode & 32) {
      umask += 0o040;
    }

    if (mode & 16) {
      umask += 0o020;
    }

    if (mode & 8) {
      umask += 0o010;
    }

    if (mode & 4) {
      umask += 0o004;
    }

    if (mode & 2) {
      umask += 0o002;
    }

    if (mode & 1) {
      umask += 0o001;
    }

    return umask;
  }

  test(src: string, { sync = false, resolve = true, flag = 'e' }: { sync?: boolean, resolve?: boolean, flag?: Flag } = {}) {
    // if (this.#constants.hasOwnProperty(flag) === false) {
    //   throw new Error(`Unknown file test flag: ${flag}`);
    // }

    const mode = this.#constants[flag];

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

  stat(src: string, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

    if (sync) {
      return fs.lstatSync(src);
    }

    return new Promise((resolve, reject) => {
      fs.lstat(src, (err, stats) => {
        if (err) {
          return reject(err);
        }

        (<any>stats).bitmask = PoweredFileSystem.bitmask(stats.mode);

        resolve(stats);
      });
    });
  }

  chmod(src: string, mode: number, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  chown(src: string, uid: number, gid: number, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  symlink(src: string, use: string, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
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

  copy(src: string, dir: string, { sync = false, resolve = true, umask = 0o000 }: { sync?: boolean, resolve?: boolean, umask?: number } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      dir = path.resolve(this.pwd, dir);
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

  rename(src: string, use: string, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
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

  remove(src: string, { sync = false, resolve = true }: { sync?: boolean, resolve?: boolean } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  read(src: string, { sync = false, resolve = true, encoding = 'utf8', flag = 'r' }: { sync?: boolean, resolve?: boolean, encoding?: BufferEncoding | null, flag?: Flag } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  write(src: string, data: Buffer | string, { sync = false, resolve = true, encoding = 'utf8', umask = 0o000, flag = 'w' }: { sync?: boolean, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  append(src: string, data: Buffer | string, { sync = false, resolve = true, encoding = 'utf8', umask = 0o000, flag = 'a' }: { sync?: boolean, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag } = {}) {
    if (resolve) {
      src = path.resolve(this.pwd, src);
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

  readdir(dir: string, { sync = false, resolve = true, encoding = 'utf8' }: { sync?: boolean, resolve?: boolean, encoding?: BufferEncoding | null } = {}) {
    if (resolve) {
      dir = path.resolve(this.pwd, dir);
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

  mkdir(dir: string, { umask = 0o000, resolve = true, sync = false }: { umask?: number, resolve?: boolean, sync?: boolean } = {}) {
    if (resolve) {
      dir = path.resolve(this.pwd, dir);
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
}

export = PoweredFileSystem;
