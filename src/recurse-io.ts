import fs, { NoParamCallback } from 'node:fs';
import path from 'node:path';

export interface ICopyOptions {
  umask: number;
  overwrite: boolean;
  filter?: (src: string, dest: string) => boolean;
}

/**
 * Applies chmod depth-first so directories are updated after their contents.
 */
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

/**
 * Applies ownership recursively while preserving current values when uid/gid are omitted.
 */
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

/**
 * Copies a file system node into the target directory, creating directories as needed.
 */
export function copy(src: string, dir: string, options: ICopyOptions, callback: NoParamCallback) {
  fs.stat(src, (err, stat) => {
    if (err) {
      return callback(err);
    }

    const loc = path.basename(src);
    const dest = path.join(dir, loc);

    if (dest === src) {
      return callback(new Error(`Source and destination are identical: ${src}`));
    }

    if (options.filter && options.filter(src, dest) === false) {
      return callback(null);
    }

    if (stat.isDirectory()) {
      fs.readdir(src, (err, list) => {
        if (err) {
          return callback(err);
        }

        const mode = 0o777 & ~options.umask;

        const create = () => {
          fs.mkdir(dest, { mode }, (err) => {
            if (err) {
              if (err.code === 'EEXIST') {
                err = new Error(`Target already exists: ${dest}`);
              }

              return callback(err);
            }

            if (list.length === 0) {
              return callback(null);
            }

            let reduce = list.length;

            for (const item of list) {
              copy(path.join(src, item), dest, options, (err) => {
                if (err) {
                  return callback(err);
                }

                if (--reduce === 0) {
                  callback(null);
                }
              });
            }
          });
        };

        if (!options.overwrite) {
          return create();
        }

        fs.lstat(dest, (err, destStat) => {
          if (err) {
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
              return create();
            }

            return callback(err);
          }

          if (destStat.isDirectory()) {
            return remove(dest, (err) => {
              if (err) {
                return callback(err);
              }

              create();
            });
          }

          fs.unlink(dest, (err) => {
            if (err) {
              return callback(err);
            }

            create();
          });
        });
      });
    }
    else {
      const mode = 0o666 & ~options.umask;

      const write = () => {
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(dest, { mode });

        readStream.on('error', callback);
        writeStream.on('error', callback);
        writeStream.on('close', () => {
          fs.chmod(dest, mode, callback);
        });

        readStream.pipe(writeStream);
      };

      if (!options.overwrite) {
        return write();
      }

      fs.lstat(dest, (err, destStat) => {
        if (err) {
          if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            return write();
          }

          return callback(err);
        }

        if (destStat.isDirectory()) {
          return remove(dest, (err) => {
            if (err) {
              return callback(err);
            }

            write();
          });
        }

        fs.unlink(dest, (err) => {
          if (err) {
            return callback(err);
          }

          write();
        });
      });
    }
  });
}

/**
 * Removes files, directories, and symlinks without following symbolic links.
 */
export function remove(src: string, callback: NoParamCallback) {
  fs.lstat(src, (err, stat) => {
    if (err) {
      return callback(err);
    }

    if (stat.isSymbolicLink()) {
      return fs.unlink(src, callback);
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

/**
 * Removes all entries inside a directory while preserving the directory itself.
 */
export function emptyDir(src: string, callback: NoParamCallback) {
  fs.readdir(src, (err, list) => {
    if (err) {
      return callback(err);
    }

    if (list.length === 0) {
      return callback(null);
    }

    let reduce = list.length;

    for (const loc of list) {
      remove(path.join(src, loc), (err) => {
        if (err) {
          return callback(err);
        }

        if (--reduce === 0) {
          callback(null);
        }
      });
    }
  });
}

/**
 * Creates a directory tree with the permissions derived from the provided umask.
 */
export function mkdir(dir: string, umask: number, callback: NoParamCallback) {
  const mode = 0o777 & ~umask;

  fs.mkdir(dir, { recursive: true, mode }, (err) => {
    if (err && err.code !== 'EEXIST') {
      return callback(err);
    }

    callback(null);
  });
}
