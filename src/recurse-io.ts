import fs, { NoParamCallback } from 'node:fs';
import path from 'node:path';

export interface ICopyOptions {
  umask: number;
  overwrite: boolean;
  filter?: (src: string, dest: string) => boolean;
}

function once(callback: NoParamCallback): NoParamCallback {
  let called = false;

  return (err) => {
    // Recursive branches can fail concurrently; report only the first terminal result.
    if (called) {
      return;
    }

    called = true;
    callback(err);
  };
}

/**
 * Applies chmod depth-first so directories are updated after their contents.
 */
export function chmod(src: string, mode: number, callback: NoParamCallback) {
  callback = once(callback);
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
export function chown(src: string, uid: number | undefined, gid: number | undefined, callback: NoParamCallback) {
  callback = once(callback);
  let reduce = 0;

  fs.stat(src, (err, stats) => {
    if (err) {
      return callback(err);
    }

    // `0` is a valid uid/gid, so only nullish values mean "preserve current owner".
    const nextUid = uid ?? stats.uid;
    const nextGid = gid ?? stats.gid;

    if (stats.isDirectory()) {
      fs.readdir(src, (err, list) => {
        if (err) {
          return callback(err);
        }
        
        if (list.length === 0) {
          return fs.chown(src, nextUid, nextGid, callback);
        }

        reduce = list.length;

        for (const loc of list) {
          chown(path.join(src, loc), nextUid, nextGid, (err) => {
            if (err) {
              return callback(err);
            }

            if (--reduce === 0) {
              fs.chown(src, nextUid, nextGid, callback);
            }
          });
        }
      });
    }
    else {
      fs.chown(src, nextUid, nextGid, callback);
    }
  });
}

/**
 * Copies a file system node into the target directory, creating directories as needed.
 */
export function copy(src: string, dir: string, options: ICopyOptions, callback: NoParamCallback) {
  callback = once(callback);

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

        // Overwrite is implemented as replace-before-copy to support directory targets.
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
        const flags = options.overwrite ? 0 : fs.constants.COPYFILE_EXCL;

        fs.copyFile(src, dest, flags, (err) => {
          if (err) {
            return callback(err);
          }

          fs.chmod(dest, mode, callback);
        });
      };

      if (!options.overwrite) {
        return write();
      }

      // Match directory behavior by replacing the existing target before writing.
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
  fs.rm(src, { recursive: true, force: false }, once(callback));
}

/**
 * Removes all entries inside a directory while preserving the directory itself.
 */
export function emptyDir(src: string, callback: NoParamCallback) {
  callback = once(callback);

  fs.readdir(src, (err, list) => {
    if (err) {
      return callback(err);
    }

    if (list.length === 0) {
      return callback(null);
    }

    let reduce = list.length;

    for (const loc of list) {
      fs.rm(path.join(src, loc), { recursive: true, force: false }, (err) => {
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
