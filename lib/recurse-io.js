const fs = require('fs');
const path = require('path');



const {sep} = path;
const cwd = process.cwd();



module.exports = {
  chmod(src, mode, callback) {
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

          for (let loc of list) {
            this.chmod(`${src}${sep}${loc}`, mode, (err) => {
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



  chown(src, uid, gid, callback) {
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

          for (let loc of list) {
            this.chown(`${src}${sep}${loc}`, uid, gid, (err) => {
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



  copy(src, dir, umask, callback) {
    let fmask = 0o666 - umask;
    let dmask = 0o777 - umask;
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

          let paths = src.split(sep);
          let loc = paths[paths.length - 1];

          dir = `${dir}${sep}${loc}`;

          fs.mkdir(dir, dmask, (err) => {
            if (err) {
              return callback(err);
            }

            if (reduce === 0) {
              return callback(null);
            }

            for (let loc of list) {
              this.copy(`${src}${sep}${loc}`, dir, umask, (err) => {
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

          for (let loc of list) {
            this.remove(`${src}${sep}${loc}`, (err) => {
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



  mkdir(dir, umask, callback) {
    let index = dir.indexOf(cwd);
    let mode = 0o777 - umask;

    if (index === -1) {
      start = path.parse(dir).root.length;
    }
    else {
      start = cwd.length + 1;
    }

    dir = dir.substring(start);
    let iterator = dir.split(sep).entries();

    const loop = (cwd) => {
      let {done, value} = iterator.next();

      if (done === true) {
        return callback(null);
      }

      let [, loc] = value;
      let dir = `${cwd}${sep}${loc}`;

      fs.access(dir, (err) => {
        if (err === null) {
          return loop(dir);
        }

        fs.mkdir(dir, mode, (err) => {
          if (err && err.errno !== -17) {
            return callback(err);
          }

          loop(dir);
        });
      });
    };

    loop(index === 0 ? cwd : '');
  }
};
