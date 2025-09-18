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
    test(src, options) {
        const { sync = false, flag = 'e' } = options ?? {};
        const mode = this.constants[flag];
        src = node_path_1.default.resolve(this.pwd, src);
        if (sync) {
            return node_fs_1.default.existsSync(src);
        }
        return new Promise((resolve) => {
            node_fs_1.default.access(src, mode, (err) => {
                resolve(!err);
            });
        });
    }
    stat(src, options) {
        const { sync = false } = options ?? {};
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
    chmod(src, mode, options) {
        const { sync = false } = options ?? {};
        src = this.resolve(src);
        if (sync) {
            (0, recurse_io_sync_1.chmodSync)(src, mode);
            return undefined;
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
    chown(src, options) {
        const { sync = false, uid = 0, gid = 0 } = options ?? {};
        src = this.resolve(src);
        if (sync) {
            (0, recurse_io_sync_1.chownSync)(src, uid, gid);
            return undefined;
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
    symlink(src, dest, options) {
        src = this.resolve(src);
        dest = this.resolve(dest);
        const { sync = false } = options ?? {};
        if (sync) {
            node_fs_1.default.symlinkSync(src, dest);
            return undefined;
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.symlink(src, dest, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    copy(src, dest, options) {
        src = this.resolve(src);
        dest = this.resolve(dest);
        const { sync = false, umask = 0o000 } = options ?? {};
        if (sync) {
            (0, recurse_io_sync_1.copySync)(src, dest, umask);
            return undefined;
        }
        return new Promise((resolve, reject) => {
            (0, recurse_io_1.copy)(src, dest, umask, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    rename(src, dest, options) {
        src = this.resolve(src);
        dest = this.resolve(dest);
        const { sync = false } = options ?? {};
        if (sync) {
            node_fs_1.default.renameSync(src, dest);
            return undefined;
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.rename(src, dest, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    remove(src, options) {
        src = this.resolve(src);
        const { sync = false } = options ?? {};
        if (sync) {
            (0, recurse_io_sync_1.removeSync)(src);
            return undefined;
        }
        return new Promise((resolve, reject) => {
            const callback = (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            };
            if ('rm' in node_fs_1.default) {
                node_fs_1.default.rm(src, { recursive: true }, callback);
            }
            else {
                (0, recurse_io_1.remove)(src, callback);
            }
        });
    }
    read(src, options) {
        const { sync = false, encoding = 'utf8', flag = 'r' } = options ?? {};
        const resolved = this.resolve(src);
        if (sync) {
            if (encoding === null) {
                return node_fs_1.default.readFileSync(resolved, { encoding: null, flag });
            }
            else {
                return node_fs_1.default.readFileSync(resolved, { encoding, flag });
            }
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.readFile(resolved, { encoding, flag }, (err, raw) => {
                if (err) {
                    return reject(err);
                }
                resolve(raw);
            });
        });
    }
    write(src, data, options) {
        const { sync = false, encoding = 'utf8', umask = 0o000, flag = 'w', } = options ?? {};
        src = this.resolve(src);
        const mode = 0o666 - umask;
        if (sync) {
            node_fs_1.default.writeFileSync(src, data, { encoding, mode, flag });
            return undefined;
        }
        return new Promise((resolve, reject) => {
            node_fs_1.default.writeFile(src, data, { encoding, mode, flag }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    /**
    * @deprecated The method should not be used
    */
    append(src, data, options) {
        const { sync = false, encoding = 'utf8', umask = 0o000 } = options ?? {};
        return this.write(src, data, { sync, encoding, umask, flag: 'a' });
    }
    readdir(dir, options) {
        const { sync = false, encoding = 'utf8' } = options ?? {};
        dir = this.resolve(dir);
        if (sync) {
            return node_fs_1.default.readdirSync(dir, { encoding });
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
    mkdir(dir, options) {
        const { sync = false, umask = 0o000 } = options ?? {};
        dir = this.resolve(dir);
        if (sync) {
            (0, recurse_io_sync_1.mkdirSync)(dir, umask);
            return undefined;
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
