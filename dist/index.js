"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _constants;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const recurse_io_1 = __importDefault(require("./recurse-io"));
const recurse_io_sync_1 = __importDefault(require("./recurse-io-sync"));
class PoweredFileSystem {
    constructor(pwd) {
        this.pwd = process.cwd();
        _constants.set(this, {
            e: fs_1.default.constants.F_OK,
            r: fs_1.default.constants.R_OK,
            w: fs_1.default.constants.W_OK,
            x: fs_1.default.constants.X_OK
        });
        if (pwd) {
            this.pwd = path_1.default.resolve(pwd);
        }
    }
    static bitmask(mode) {
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
    test(src, { flag = 'e', resolve = true, sync = false } = {}) {
        if (__classPrivateFieldGet(this, _constants).hasOwnProperty(flag) === false) {
            throw new Error(`Unknown file test flag: ${flag}`);
        }
        const mode = __classPrivateFieldGet(this, _constants)[flag];
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return fs_1.default.existsSync(src);
        }
        return new Promise((resolve, reject) => {
            fs_1.default.access(src, mode, (err) => {
                if (err) {
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }
    stat(src, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return fs_1.default.lstatSync(src);
        }
        return new Promise((resolve, reject) => {
            fs_1.default.lstat(src, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                stats.bitmask = PoweredFileSystem.bitmask(stats.mode);
                resolve(stats);
            });
        });
    }
    chmod(src, mode, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return recurse_io_sync_1.default.chmod(src, mode);
        }
        return new Promise((resolve, reject) => {
            recurse_io_1.default.chmod(src, mode, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    chown(src, uid, gid, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return recurse_io_sync_1.default.chown(src, uid, gid);
        }
        return new Promise((resolve, reject) => {
            recurse_io_1.default.chown(src, uid, gid, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    symlink(src, use, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
            use = path_1.default.resolve(this.pwd, use);
        }
        if (sync) {
            return fs_1.default.symlinkSync(src, use);
        }
        return new Promise((resolve, reject) => {
            fs_1.default.symlink(src, use, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    copy(src, dir, { umask = 0o000, resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
            dir = path_1.default.resolve(this.pwd, dir);
        }
        if (sync) {
            return recurse_io_sync_1.default.copy(src, dir, umask);
        }
        return new Promise((resolve, reject) => {
            recurse_io_1.default.copy(src, dir, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    rename(src, use, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
            use = path_1.default.resolve(this.pwd, use);
        }
        if (sync) {
            return fs_1.default.renameSync(src, use);
        }
        return new Promise((resolve, reject) => {
            fs_1.default.rename(src, use, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    remove(src, { resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return recurse_io_sync_1.default.remove(src);
        }
        return new Promise((resolve, reject) => {
            recurse_io_1.default.remove(src, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    read(src, { encoding = 'utf8', flag = 'r', resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        if (sync) {
            return fs_1.default.readFileSync(src, {
                encoding,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(src, {
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
    write(src, data, { encoding = 'utf8', umask = 0o000, flag = 'w', resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        const mode = 0o666 - umask;
        if (sync) {
            return fs_1.default.writeFileSync(src, data, {
                encoding,
                mode,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(src, data, {
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
    append(src, data, { encoding = 'utf8', umask = 0o000, flag = 'a', resolve = true, sync = false } = {}) {
        if (resolve) {
            src = path_1.default.resolve(this.pwd, src);
        }
        const mode = 0o666 - umask;
        if (sync) {
            return fs_1.default.appendFileSync(src, data, {
                encoding,
                mode,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            fs_1.default.appendFile(src, data, {
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
    readdir(dir, { encoding = 'utf8', resolve = true, sync = false } = {}) {
        if (resolve) {
            dir = path_1.default.resolve(this.pwd, dir);
        }
        if (sync) {
            return fs_1.default.readdirSync(dir, {
                encoding
            });
        }
        return new Promise((resolve, reject) => {
            fs_1.default.readdir(dir, { encoding }, (err, list) => {
                if (err) {
                    return reject(err);
                }
                resolve(list);
            });
        });
    }
    mkdir(dir, { umask = 0o000, resolve = true, sync = false } = {}) {
        if (resolve) {
            dir = path_1.default.resolve(this.pwd, dir);
        }
        if (sync) {
            return recurse_io_sync_1.default.mkdir(dir, umask);
        }
        return new Promise((resolve, reject) => {
            recurse_io_1.default.mkdir(dir, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}
_constants = new WeakMap();
module.exports = PoweredFileSystem;
//# sourceMappingURL=index.js.map