import fs from 'fs';
import path from 'path';
import recurse from './recurse-io';
import recurseSync from './recurse-io-sync';

type Files = Array<string>;

class PoweredFileSystem {
  readonly pwd: string = process.cwd()

  #constants: object = {
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

  test(src: string, { flag = 'e', resolve = true, sync = false }: { flag?: string, resolve?: boolean, sync?: boolean } = {}): Promise<boolean> | boolean {
    if (this.#constants.hasOwnProperty(flag) === false) {
      throw new Error(`Unknown file test flag: ${flag}`);
    }

    const mode = this.#constants[flag];

    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

    if (sync) {
      return fs.existsSync(src);
    }

    return new Promise((resolve, reject) => {
      fs.access(src, mode, (err) => {
        if (err) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }

  stat(src: string, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<fs.Stats> | fs.Stats {
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

  chmod(src: string, mode: number, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

    if (sync) {
      return recurseSync.chmod(src, mode);
    }

    return new Promise((resolve, reject) => {
      recurse.chmod(src, mode, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  chown(src: string, uid: number, gid: number, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

    if (sync) {
      return recurseSync.chown(src, uid, gid);
    }

    return new Promise((resolve, reject) => {
      recurse.chown(src, uid, gid, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  symlink(src: string, use: string, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
    }

    if (sync) {
      return fs.symlinkSync(src, use);
    }

    return new Promise((resolve, reject) => {
      fs.symlink(src, use, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  copy(src: string, dir: string, { umask = 0o000, resolve = true, sync = false }: { umask?: number, resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      dir = path.resolve(this.pwd, dir);
    }

    if (sync) {
      return recurseSync.copy(src, dir, umask);
    }

    return new Promise((resolve, reject) => {
      recurse.copy(src, dir, umask, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  rename(src: string, use: string, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
    }

    if (sync) {
      return fs.renameSync(src, use);
    }

    return new Promise((resolve, reject) => {
      fs.rename(src, use, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  remove(src: string, { resolve = true, sync = false }: { resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      src = path.resolve(this.pwd, src);
    }

    if (sync) {
      return recurseSync.remove(src);
    }

    return new Promise((resolve, reject) => {
      recurse.remove(src, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  read(src: string, { encoding = 'utf8', flag = 'r', resolve = true, sync = false }: { encoding?: BufferEncoding | null, flag?: string, resolve?: boolean, sync?: boolean } = {}): Promise<string> | string {
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
      (err, content) => {
        if (err) {
          return reject(err);
        }

        resolve(content);
      });
    });
  }

  write(src: string, data: string, { encoding = 'utf8', umask = 0o000, flag = 'w', resolve = true, sync = false }: { encoding?: BufferEncoding | null, umask?: number, flag?: string, resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
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

    return new Promise((resolve, reject) => {
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

  append(src: string, data: string, { encoding = 'utf8', umask = 0o000, flag = 'a', resolve = true, sync = false }: { encoding?: BufferEncoding | null, umask?: number, flag?: string, resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
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

    return new Promise((resolve, reject) => {
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

  readdir(dir: string, { encoding = 'utf8', resolve = true, sync = false }: { encoding?: BufferEncoding | null, resolve?: boolean, sync?: boolean } = {}): Promise<Files> | Files {
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

  mkdir(dir: string, { umask = 0o000, resolve = true, sync = false }: { umask?: number, resolve?: boolean, sync?: boolean } = {}): Promise<void> | void {
    if (resolve) {
      dir = path.resolve(this.pwd, dir);
    }

    if (sync) {
      return recurseSync.mkdir(dir, umask);
    }

    return new Promise((resolve, reject) => {
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
