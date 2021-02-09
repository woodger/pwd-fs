import fs from 'fs';
import path from 'path';

const {sep} = path;

export default {
  chmod(src: string, mode: number, callback: (err: Error) => void): void {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        return callback(err);
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            return callback(err);
          }

          if (list.length === 0) {
            return fs.chmod(src, mode, callback);
          }

          reduce += list.length;

          for (const loc of list) {
            this.chmod(`${src}${sep}${loc}`, mode, (err: Error) => {
              if (err) {
                return callback(err);
              }

              if (--reduce === 0) {
                fs.chmod(src, mode, callback);
              }
            });
          }
        });
      }
      else {
        fs.chmod(src, mode, callback);
      }
    });
  },

  chown(src: string, uid: number, gid: number, callback: (err: Error) => void): void {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        return callback(err);
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            return callback(err);
          }

          if (list.length === 0) {
            return fs.chown(src, uid, gid, callback);
          }

          reduce += list.length;

          for (const loc of list) {
            this.chown(`${src}${sep}${loc}`, uid, gid, (err: Error) => {
              if (err) {
                return callback(err);
              }

              if (--reduce === 0) {
                fs.chown(src, uid, gid, callback);
              }
            });
          }
        });
      }
      else {
        fs.chown(src, uid, gid, callback);
      }
    });
  },

  copy(src: string, dir: string, umask: number, callback: (err: Error) => void): void {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        return callback(err);
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            return callback(err);
          }

          reduce += list.length;

          const paths = src.split(sep);
          const loc = paths[paths.length - 1];
          const mode = 0o777 - umask;

          dir = `${dir}${sep}${loc}`;

          fs.mkdir(dir, { mode }, (err) => {
            if (err) {
              return callback(err);
            }

            if (reduce === 0) {
              return callback(null);
            }

            for (const loc of list) {
              this.copy(`${src}${sep}${loc}`, dir, umask, (err: Error) => {
                if (err) {
                  return callback(err);
                }

                if (--reduce === 0) {
                  callback(null);
                }
              });
            }
          });
        });
      }
      else {
        const mode = 0o666 - umask;
        const loc = path.basename(src);

        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(`${dir}${sep}${loc}`, {
          mode
        });

        readStream.on('error', callback);
        writeStream.on('error', callback);

        writeStream.on('close', () => {
          callback(null);
        });

        readStream.pipe(writeStream);
      }
    });
  },

  remove(src: string, callback: (err: Error) => void): void {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        return callback(err);
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            return callback(err);
          }

          if (list.length === 0) {
            return fs.rmdir(src, callback);
          }

          reduce += list.length;

          for (const loc of list) {
            this.remove(`${src}${sep}${loc}`, (err: Error) => {
              if (err) {
                return callback(err);
              }

              if (--reduce === 0) {
                fs.rmdir(src, callback);
              }
            });
          }
        });
      }
      else {
        fs.unlink(src, callback);
      }
    });
  },

  mkdir(dir: string, umask: number, callback: (err: Error) => void): void {
    const cwd = process.cwd();

    if (dir === cwd) {
      return callback(null);
    }

    const generator = function* (dir: string, ways: string, mode: number): number {
      const it = yield;

      for (let i = 1; i < ways.length; i++) {
        dir += `${sep}${ways[i]}`;

        fs.mkdir(dir, { mode }, (err) => {
          if (err && err.errno !== -17) {
            return callback(err);
          }

          it.next();
        });

        yield;
      }

      callback(null);
    };

    let use = '';

    if (dir.indexOf(cwd) === 0) {
      use = cwd;
      dir = dir.substr(cwd.length);
    }

    const ways = dir.split(sep);
    const mode = 0o777 - umask;

    const it = generator(use, ways, mode);

    it.next();
    it.next(it);
  }
}
