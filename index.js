const fs = require('fs');
const path = require('path');
const te = require('./lib/te');
const recurse = require('./lib/recurse-io');



const {sep} = path;
const cwd = process.cwd();
const flags = {
  test: {
    // Flag indicating that the file is visible
    e: fs.constants.F_OK,

    // Flag indicating that the file can be read
    r: fs.constants.R_OK,

    // Flag indicating that the file can be written
    w: fs.constants.W_OK,

    // Flag indicating that the file can be executed
    x: fs.constants.X_OK
  }
};




class FileSystem {
  constructor(pwd = cwd) {
    this.pwd = path.resolve(cwd, pwd);
  }



  static bitmask(mode) {
    let err = te.validate('bitmask', {
      mode
    });

    if (err) {
      throw err;
    }

    let mask = 0o000;

    if (mode & 256) {
      mask += 0o400;
    }

    if (mode & 128) {
      mask += 0o200;
    }

    if (mode & 64) {
      mask += 0o100;
    }

    if (mode & 32) {
      mask += 0o040;
    }

    if (mode & 16) {
      mask += 0o020;
    }

    if (mode & 8) {
      mask += 0o010;
    }

    if (mode & 4) {
      mask += 0o004;
    }

    if (mode & 2) {
      mask += 0o002;
    }

    if (mode & 1) {
      mask += 0o001;
    }

    return mask;
  }



  test(src, {flag = 'e', resolve = true} = {}) {
    let err = te.validate('test', {
      src,
      flag,
      resolve
    });

    if (err) {
      throw err;
    }

    if (flags.test.hasOwnProperty(flag) === false) {
      throw new Error(`Unknown file test flag: ${flag}`);
    }

    flag = flags.test[flag];

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
    }

    return new Promise((resolve, reject) => {
      fs.access(src, flag, (err) => {
        if (err) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }



  stat(src, {resolve = true} = {}) {
    let err = te.validate('stat', {
      src,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
    }

    return new Promise((resolve, reject) => {
      fs.lstat(src, (err, info) => {
        if (err) {
          return reject(err);
        }

        info.bitmask = this.constructor.bitmask(info.mode);

        resolve(info);
      });
    });
  }



  chmod(src, mode, {resolve = true} = {}) {
    let err = te.validate('chmod', {
      src,
      mode,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
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



  chown(src, uid, gid, {resolve = true} = {}) {
    let err = te.validate('chown', {
      src,
      uid,
      gid,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
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



  symlink(src, use, {resolve = true} = {}) {
    let err = te.validate('symlink', {
      src,
      use,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
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



  copy(src, dir, {umask = 0o000, resolve = true} = {}) {
    let err = te.validate('copy', {
      src,
      dir,
      umask,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
      dir = path.resolve(this.pwd, dir);
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



  rename(src, use, {resolve = true} = {}) {
    let err = te.validate('rename', {
      src,
      use,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
      use = path.resolve(this.pwd, use);
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



  remove(src, {resolve = true} = {}) {
    let err = te.validate('remove', {
      src,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
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



  read(src, {encoding = 'utf8', flag = 'r', resolve = true} = {}) {
    let err = te.validate('read', {
      src,
      encoding,
      flag,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
    }

    return new Promise((resolve, reject) => {
      fs.readFile(src, {
        encoding,
        flag
      }, (err, content) => {
        if (err) {
          return reject(err);
        }

        resolve(content);
      });
    });
  }



  write(src, data, {encoding = 'utf8', umask = 0o000, flag = 'w', resolve = true} = {}) {
    let err = te.validate('write', {
      src,
      encoding,
      umask,
      flag,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
    }

    let mode = 0o666 - umask;

    return new Promise((resolve, reject) => {
      fs.writeFile(src, data, {
        encoding,
        mode,
        flag
      }, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }



  append(src, data, {encoding = 'utf8', umask = 0o000, flag = 'a', resolve = true} = {}) {
    let err = te.validate('append', {
      src,
      encoding,
      umask,
      flag,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      src = path.resolve(this.pwd, src);
    }

    let mode = 0o666 - umask;

    return new Promise((resolve, reject) => {
      fs.appendFile(src, data, {
        encoding,
        mode,
        flag
      }, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }



  readdir(dir, {encoding = 'utf8', resolve = true} = {}) {
    let err = te.validate('readdir', {
      dir,
      encoding,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      dir = path.resolve(this.pwd, dir);
    }

    return new Promise((resolve, reject) => {
      fs.readdir(dir, {
        encoding
      }, (err, list) => {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  }



  mkdir(dir, {umask = 0o000, resolve = true} = {}) {
    let err = te.validate('mkdir', {
      dir,
      umask,
      resolve
    });

    if (err) {
      throw err;
    }

    if (resolve === true) {
      dir = path.resolve(this.pwd, dir);
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




module.exports = FileSystem;
