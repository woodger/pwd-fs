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

          for (let loc of list) {
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

          for (let loc of list) {
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
    let fmask = 0o666 - umask;
    let dmask = 0o777 - umask;
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

          let paths = src.split(sep);
          let loc = paths[paths.length - 1];

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

            for (let loc of list) {
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

        let read = fs.createReadStream(src);
        let write = fs.createWriteStream(use, {
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

          for (let loc of list) {
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
    fs.access(dir, (err) => {
      if (err === null) {
        callback(null);
        return;
      }

      let lessdir = (dir, callback) => {
        let it = generator();
        it.next();

        function* generator() {
          let {root} = path.parse(dir);
          let paths = dir.split(sep);
          let less = [];
          let item;

          while ((item = paths.pop())) {
            less.push(item);
            let dir = paths.join(sep);

            fs.access(dir, (err) => {
              if (err) {
                it.next();
                return;
              }

              it.return();

              callback(dir, less);
            });

            yield;
          }
        }
      };

      let mkdir = (dir, paths, mode, callback) => {
        let it = generator();
        it.next();

        function* generator() {
          for (let i = paths.length - 1; i >= 0; i--) {
            let use = paths[i];
            dir += `${sep}${use}`;

            fs.mkdir(dir, mode, (err) => {
              if (err) {
                callback(err);
                return;
              }

              it.next();
            });

            yield;
          }

          callback(null);
        }
      };

      lessdir(dir, (left, batch) => {
        let mode = 0o777 - umask;

        mkdir(left, batch, mode, callback);
      });
    });
  }
};
