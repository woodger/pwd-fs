const fs = require('fs');
const path = require('path');

const {sep} = path;
const cwd = process.cwd();

module.exports = {
  chmod(src, mode, callback) {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        callback(err);
        return;
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            callback(err);
            return;
          }

          if (list.length === 0) {
            fs.chmod(src, mode, callback);
            return;
          }

          reduce += list.length;

          for (const loc of list) {
            this.chmod(`${src}${sep}${loc}`, mode, (err) => {
              if (err) {
                callback(err);
                return;
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

  chown(src, uid, gid, callback) {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        callback(err);
        return;
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            callback(err);
            return;
          }

          if (list.length === 0) {
            fs.chown(src, uid, gid, callback);
            return;
          }

          reduce += list.length;

          for (const loc of list) {
            this.chown(`${src}${sep}${loc}`, uid, gid, (err) => {
              if (err) {
                callback(err);
                return;
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

  copy(src, dir, umask, callback) {
    const fmask = 0o666 - umask;
    const dmask = 0o777 - umask;
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        callback(err);
        return;
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            callback(err);
            return;
          }

          reduce += list.length;

          const paths = src.split(sep);
          const loc = paths[paths.length - 1];

          dir = `${dir}${sep}${loc}`;

          fs.mkdir(dir, dmask, (err) => {
            if (err) {
              callback(err);
              return;
            }

            if (reduce === 0) {
              callback(null);
              return;
            }

            for (const loc of list) {
              this.copy(`${src}${sep}${loc}`, dir, umask, (err) => {
                if (err) {
                  callback(err);
                  return;
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
        use = `${dir}${sep}${path.basename(src)}`;

        const read = fs.createReadStream(src);
        const write = fs.createWriteStream(use, {
          mode: fmask
        });

        read.on('error', callback);
        write.on('error', callback);
        write.on('close', callback);

        read.pipe(write);
      }
    });
  },

  remove(src, callback) {
    let reduce = 0;

    fs.stat(src, (err, stat) => {
      if (err) {
        callback(err);
        return;
      }

      if (stat.isDirectory()) {
        fs.readdir(src, (err, list) => {
          if (err) {
            callback(err);
            return;
          }

          if (list.length === 0) {
            fs.rmdir(src, callback);
            return;
          }

          reduce += list.length;

          for (const loc of list) {
            this.remove(`${src}${sep}${loc}`, (err) => {
              if (err) {
                callback(err);
                return;
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

  mkdir(dir, umask, callback) {
    if (dir === cwd) {
      callback(null);
      return;
    }

    const generator = function* (dir, ways, mode) {
      const it = yield;

      for (let i = 1; i < ways.length; i++) {
        dir += `${sep}${ways[i]}`;

        fs.mkdir(dir, mode, (err) => {
          if (err && err.errno !== -17) {
            callback(err);
            return;
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
};
