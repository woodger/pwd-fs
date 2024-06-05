"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdir = exports.remove = exports.copy = exports.chown = exports.chmod = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const { sep } = node_path_1.default;
function chmod(src, mode, callback) {
    let reduce = 0;
    node_fs_1.default.stat(src, (err, stats) => {
        if (err) {
            return callback(err);
        }
        if (stats.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return node_fs_1.default.chmod(src, mode, callback);
                }
                reduce += list.length;
                for (const loc of list) {
                    chmod(`${src}${sep}${loc}`, mode, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            node_fs_1.default.chmod(src, mode, callback);
                        }
                    });
                }
            });
        }
        else {
            node_fs_1.default.chmod(src, mode, callback);
        }
    });
}
exports.chmod = chmod;
function chown(src, uid, gid, callback) {
    let reduce = 0;
    node_fs_1.default.stat(src, (err, stats) => {
        if (err) {
            return callback(err);
        }
        if (uid === 0) {
            uid = stats.uid;
        }
        if (gid === 0) {
            gid = stats.gid;
        }
        if (stats.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return node_fs_1.default.chown(src, uid, gid, callback);
                }
                reduce += list.length;
                for (const loc of list) {
                    chown(`${src}${sep}${loc}`, uid, gid, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            node_fs_1.default.chown(src, uid, gid, callback);
                        }
                    });
                }
            });
        }
        else {
            node_fs_1.default.chown(src, uid, gid, callback);
        }
    });
}
exports.chown = chown;
function copy(src, dir, umask, callback) {
    let reduce = 0;
    node_fs_1.default.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                reduce += list.length;
                const paths = src.split(sep);
                const loc = paths[paths.length - 1];
                const mode = 0o777 - umask;
                dir = `${dir}${sep}${loc}`;
                node_fs_1.default.mkdir(dir, { mode }, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    if (reduce === 0) {
                        return callback(null);
                    }
                    for (const loc of list) {
                        copy(`${src}${sep}${loc}`, dir, umask, (err) => {
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
            const mode = 0o666 - umask;
            const loc = node_path_1.default.basename(src);
            const readStream = node_fs_1.default.createReadStream(src);
            const writeStream = node_fs_1.default.createWriteStream(`${dir}${sep}${loc}`, {
                mode
            });
            readStream.on('error', callback);
            writeStream.on('error', callback);
            writeStream.on('close', () => {
                callback(null);
            });
            readStream.pipe(writeStream);
        }
    });
}
exports.copy = copy;
function remove(src, callback) {
    node_fs_1.default.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                let reduce = list.length;
                if (reduce === 0) {
                    return node_fs_1.default.rmdir(src, callback);
                }
                for (const loc of list) {
                    remove(`${src}${sep}${loc}`, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            node_fs_1.default.rmdir(src, callback);
                        }
                    });
                }
            });
        }
        else {
            node_fs_1.default.unlink(src, callback);
        }
    });
}
exports.remove = remove;
function mkdir(dir, umask, callback) {
    const cwd = process.cwd();
    if (dir === cwd) {
        return callback(null);
    }
    const sequence = function* (dir, files, mode) {
        const iter = yield;
        for (const item of files) {
            dir += `${sep}${item}`;
            node_fs_1.default.mkdir(dir, { mode }, (err) => {
                if (err && err.errno !== -17) {
                    return callback(err);
                }
                iter.next();
            });
            yield;
        }
        callback(null);
    };
    let use = '';
    if (dir.indexOf(cwd) === 0) {
        use = cwd;
        dir = dir.substring(cwd.length);
    }
    const files = dir.split(sep);
    const mode = 0o777 - umask;
    const iter = sequence(use, files, mode);
    iter.next();
    iter.next(iter);
}
exports.mkdir = mkdir;
