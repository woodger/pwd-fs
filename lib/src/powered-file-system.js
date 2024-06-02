"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoweredFileSystem = exports.bitmask = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = __importDefault(require("./recurse-io"));
const recurse_io_sync_1 = __importDefault(require("./recurse-io-sync"));
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
function bitmask(mode) {
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
exports.bitmask = bitmask;
class PoweredFileSystem {
    pwd;
    constants = {
        e: node_fs_1.default.constants.F_OK,
        r: node_fs_1.default.constants.R_OK,
        w: node_fs_1.default.constants.W_OK,
        x: node_fs_1.default.constants.X_OK
    };
    static bitmask = bitmask;
    constructor(pwd) {
        this.pwd = pwd ? node_path_1.default.resolve(pwd) : process.cwd();
    }
    resolve(src) {
        return node_path_1.default.resolve(this.pwd, src);
    }
    test(src, { sync = false, flag = 'e' } = {}) {
        const mode = this.constants[flag];
        src = node_path_1.default.resolve(this.pwd, src);
        if (sync) {
            return node_fs_1.default.existsSync(src);
        }
        return new Promise((resolve) => {
            node_fs_1.default.access(src, mode, (err) => {
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
            return node_fs_1.default.lstatSync(src);
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.lstat(src, (err, stats) => {
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
    chown(src, uid, gid, { sync = false } = {}) {
        src = this.resolve(src);
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
    symlink(src, use, { sync = false } = {}) {
        src = this.resolve(src);
        use = this.resolve(use);
        if (sync) {
            return node_fs_1.default.symlinkSync(src, use);
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.symlink(src, use, (err) => {
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
    rename(src, use, { sync = false } = {}) {
        src = this.resolve(src);
        use = this.resolve(use);
        if (sync) {
            return node_fs_1.default.renameSync(src, use);
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.rename(src, use, (err) => {
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
    read(src, { sync = false, encoding = 'utf8', flag = 'r' } = {}) {
        src = this.resolve(src);
        if (sync) {
            return node_fs_1.default.readFileSync(src, {
                encoding,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.readFile(src, {
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
            return node_fs_1.default.writeFileSync(src, data, {
                encoding,
                mode,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.writeFile(src, data, {
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
            return node_fs_1.default.appendFileSync(src, data, {
                encoding,
                mode,
                flag
            });
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.appendFile(src, data, {
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
            return node_fs_1.default.readdirSync(dir, {
                encoding
            });
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.readdir(dir, { encoding }, (err, list) => {
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
exports.PoweredFileSystem = PoweredFileSystem;
