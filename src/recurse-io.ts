import fs, { NoParamCallback } from 'node:fs';
import path from 'node:path';

export function chmod(src: string, mode: number, callback: NoParamCallback) {
  let reduce = 0;

  fs.stat(src, (err, stats) => {
    if (err) return callback(err);

    if (stats.isDirectory()) {
      fs.readdir(src, (err, list) => {
        if (err) {
          return callback(err);
        }

        if (list.length === 0) {
          return fs.chmod(src, mode, callback);
        }

        reduce = list.length;

        for (const loc of list) {
          chmod(path.join(src, loc), mode, (err) => {
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
}

export function chown(src: string, uid: number, gid: number, callback: NoParamCallback) {
  let reduce = 0;

  fs.stat(src, (err, stats) => {
    if (err) {
      return callback(err);
    }

    if (uid === 0) {
      uid = stats.uid;
    }

    if (gid === 0) {
      gid = stats.gid;
    }

    if (stats.isDirectory()) {
      fs.readdir(src, (err, list) => {
        if (err) {
          return callback(err);
        }
        
        if (list.length === 0) {
          return fs.chown(src, uid, gid, callback);
        }

        reduce = list.length;

        for (const loc of list) {
          chown(path.join(src, loc), uid, gid, (err) => {
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
}

export function copy(src: string, dir: string, umask: number, callback: NoParamCallback) {
  fs.stat(src, (err, stat) => {
    if (err) {
      return callback(err);
    }

    if (stat.isDirectory()) {
      fs.readdir(src, (err, list) => {
        if (err) {
          return callback(err);
        }

        const loc = path.basename(src);
        const destDir = path.join(dir, loc);
        const mode = 0o777 - umask;

        fs.mkdir(destDir, { mode }, (err) => {
          if (err) {
            if (err.code === 'EEXIST') {
              err = new Error(`Target already exists: ${destDir}`);
            }

            return callback(err);
          }

          if (list.length === 0) {
            return callback(null);
          }

          let reduce = list.length;

          for (const item of list) {
            copy(path.join(src, item), destDir, umask, (err) => {
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
      const loc = path.basename(src);
      const dest = path.join(dir, loc);
      const mode = 0o666 - umask;

      const readStream = fs.createReadStream(src);
      const writeStream = fs.createWriteStream(dest, { mode });

      readStream.on('error', callback);
      writeStream.on('error', callback);
      writeStream.on('close', () => callback(null));

      readStream.pipe(writeStream);
    }
  });
}

export function remove(src: string, callback: NoParamCallback) {
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

        let reduce = list.length;

        for (const loc of list) {
          remove(path.join(src, loc), (err) => {
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
}

export function mkdir(dir: string, umask: number, callback: NoParamCallback) {
  const cwd = process.cwd();

  if (dir === cwd) {
    return callback(null);
  }

  let base = '';
  const mode = 0o777 - umask;

  if (dir.startsWith(cwd)) {
    base = cwd;
    dir = dir.slice(cwd.length);
  }

  const parts = dir.split(path.sep).filter(Boolean);

  function next(index: number) {
    if (index >= parts.length) {
      return callback(null);
    }

    base = path.join(base, parts[index]);

    fs.mkdir(base, { mode }, (err) => {
      if (err && err.code !== 'EEXIST') {
        return callback(err);
      }

      next(index + 1);
    });
  }

  next(0);
}
