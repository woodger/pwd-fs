"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoweredFileSystem = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("./recurse-io");
const recurse_io_sync_1 = require("./recurse-io-sync");
const bitmask_1 = require("./bitmask");
__exportStar(require("./bitmask"), exports);
class PoweredFileSystem {
    pwd;
    constants = {
        e: node_fs_1.default.constants.F_OK,
        r: node_fs_1.default.constants.R_OK,
        w: node_fs_1.default.constants.W_OK,
        x: node_fs_1.default.constants.X_OK
    };
    static bitmask = bitmask_1.bitmask;
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
            return (0, recurse_io_sync_1.chmodSync)(src, mode);
        }
        return new Promise((resolve, reject) => {
            (0, recurse_io_1.chmod)(src, mode, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    chown(src, { sync = false, uid = 0, gid = 0 } = {}) {
        src = this.resolve(src);
        if (sync) {
            return (0, recurse_io_sync_1.chownSync)(src, uid, gid);
        }
        return new Promise((resolve, reject) => {
            (0, recurse_io_1.chown)(src, uid, gid, (err) => {
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
            return (0, recurse_io_sync_1.copySync)(src, dir, umask);
        }
        return new Promise((resolve, reject) => {
            (0, recurse_io_1.copy)(src, dir, umask, (err) => {
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
            (0, recurse_io_sync_1.removeSync)(src);
        }
        return new Promise((resolve, reject) => {
            const callback = (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            };
            if ('rm' in node_fs_1.default) {
                return node_fs_1.default.rm(src, { recursive: true }, callback);
            }
            (0, recurse_io_1.remove)(src, callback);
        });
    }
    read(src, { sync = false, encoding = 'utf8', flag = 'r' } = {}) {
        src = this.resolve(src);
        if (sync) {
            const content = node_fs_1.default.readFileSync(src, {
                encoding,
                flag
            });
            return encoding === null
                ? Buffer.from(content)
                : content;
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
            return (0, recurse_io_sync_1.mkdirSync)(dir, umask);
        }
        return new Promise((resolve, reject) => {
            (0, recurse_io_1.mkdir)(dir, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}
exports.PoweredFileSystem = PoweredFileSystem;
