'use strict';

var fs = require('node:fs');
var path = require('node:path');
var recurseIo = require('./recurse-io.js');
var recurseIoSync = require('./recurse-io-sync.js');

const permissions = [
    0o400, // OWNER_READ
    0o200, // OWNER_WRITE
    0o100, // OWNER_EXECUTE
    0o040, // GROUP_READ
    0o020, // GROUP_WRITE
    0o010, // GROUP_EXECUTE
    0o004, // OTHERS_READ
    0o002, // OTHERS_WRITE
    0o001 // OTHERS_EXECUTE
];
class PoweredFileSystem {
    pwd;
    constants = {
        e: fs.constants.F_OK,
        r: fs.constants.R_OK,
        w: fs.constants.W_OK,
        x: fs.constants.X_OK
    };
    constructor(pwd) {
        this.pwd = pwd ? path.resolve(pwd) : process.cwd();
    }
    resolve(src) {
        return path.resolve(this.pwd, src);
    }
    static bitmask(mode) {
        const type = typeof mode;
        if (type !== 'number') {
            throw new Error(`Argument of type '${type}' is not assignable to parameter of type 'number'.`);
        }
        let umask = 0o000;
        for (const flag of permissions) {
            if (mode & flag) {
                umask += flag;
            }
        }
        return umask;
    }
    test(src, { sync = false, flag = 'e' } = {}) {
        const mode = this.constants[flag];
        src = path.resolve(this.pwd, src);
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
    stat(src, { sync = false } = {}) {
        src = this.resolve(src);
        if (sync) {
            return fs.lstatSync(src);
        }
        return new Promise((resolve, reject) => {
            fs.lstat(src, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(stats);
            });
        });
    }
    chmod(src, mode, { sync = false } = {}) {
        src = this.resolve(src);
        if (sync) {
            return recurseIoSync.default.chmod(src, mode);
        }
        return new Promise((resolve, reject) => {
            recurseIo.default.chmod(src, mode, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    chown(src, uid, gid, { sync = false } = {}) {
        src = this.resolve(src);
        if (sync) {
            return recurseIoSync.default.chown(src, uid, gid);
        }
        return new Promise((resolve, reject) => {
            recurseIo.default.chown(src, uid, gid, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    symlink(src, use, { sync = false } = {}) {
        src = this.resolve(src);
        use = this.resolve(use);
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
    copy(src, dir, { sync = false, umask = 0o000 } = {}) {
        src = this.resolve(src);
        dir = this.resolve(dir);
        if (sync) {
            return recurseIoSync.default.copy(src, dir, umask);
        }
        return new Promise((resolve, reject) => {
            recurseIo.default.copy(src, dir, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    rename(src, use, { sync = false } = {}) {
        src = this.resolve(src);
        use = this.resolve(use);
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
    remove(src, { sync = false } = {}) {
        src = this.resolve(src);
        if (sync) {
            return recurseIoSync.default.remove(src);
        }
        return new Promise((resolve, reject) => {
            recurseIo.default.remove(src, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    read(src, { sync = false, encoding = 'utf8', flag = 'r' } = {}) {
        src = this.resolve(src);
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
            }, (err, raw) => {
                if (err) {
                    return reject(err);
                }
                resolve(raw);
            });
        });
    }
    write(src, data, { sync = false, encoding = 'utf8', umask = 0o000, flag = 'w' } = {}) {
        src = this.resolve(src);
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
            }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    append(src, data, { sync = false, encoding = 'utf8', umask = 0o000, flag = 'a' } = {}) {
        src = this.resolve(src);
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
            }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    readdir(dir, { sync = false, encoding = 'utf8' } = {}) {
        dir = this.resolve(dir);
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
    mkdir(dir, { umask = 0o000, sync = false } = {}) {
        dir = this.resolve(dir);
        if (sync) {
            return recurseIoSync.default.mkdir(dir, umask);
        }
        return new Promise((resolve, reject) => {
            recurseIo.default.mkdir(dir, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

exports.PoweredFileSystem = PoweredFileSystem;
