"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmod = chmod;
exports.chown = chown;
exports.copy = copy;
exports.remove = remove;
exports.mkdir = mkdir;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Applies chmod depth-first so directories are updated after their contents.
 */
function chmod(src, mode, callback) {
    let reduce = 0;
    node_fs_1.default.stat(src, (err, stats) => {
        if (err)
            return callback(err);
        if (stats.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return node_fs_1.default.chmod(src, mode, callback);
                }
                reduce = list.length;
                for (const loc of list) {
                    chmod(node_path_1.default.join(src, loc), mode, (err) => {
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
/**
 * Applies ownership recursively while preserving current values when uid/gid are omitted.
 */
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
                reduce = list.length;
                for (const loc of list) {
                    chown(node_path_1.default.join(src, loc), uid, gid, (err) => {
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
/**
 * Copies a file system node into the target directory, creating directories as needed.
 */
function copy(src, dir, umask, callback) {
    node_fs_1.default.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                const loc = node_path_1.default.basename(src);
                const destDir = node_path_1.default.join(dir, loc);
                const mode = 0o777 & ~umask;
                node_fs_1.default.mkdir(destDir, { mode }, (err) => {
                    if (err) {
                        if (err.code === 'EEXIST') {
                            err = new Error(`Target already exists: ${destDir}`);
                        }
                        return callback(err);
                    }
                    if (list.length === 0) {
                        return callback(null);
                    }
                    let reduce = list.length;
                    for (const item of list) {
                        copy(node_path_1.default.join(src, item), destDir, umask, (err) => {
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
            const loc = node_path_1.default.basename(src);
            const dest = node_path_1.default.join(dir, loc);
            const mode = 0o666 & ~umask;
            const readStream = node_fs_1.default.createReadStream(src);
            const writeStream = node_fs_1.default.createWriteStream(dest, { mode });
            readStream.on('error', callback);
            writeStream.on('error', callback);
            writeStream.on('close', () => {
                node_fs_1.default.chmod(dest, mode, callback);
            });
            readStream.pipe(writeStream);
        }
    });
}
/**
 * Removes files, directories, and symlinks without following symbolic links.
 */
function remove(src, callback) {
    node_fs_1.default.lstat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isSymbolicLink()) {
            return node_fs_1.default.unlink(src, callback);
        }
        if (stat.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return node_fs_1.default.rmdir(src, callback);
                }
                let reduce = list.length;
                for (const loc of list) {
                    remove(node_path_1.default.join(src, loc), (err) => {
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
/**
 * Creates a directory tree with the permissions derived from the provided umask.
 */
function mkdir(dir, umask, callback) {
    const mode = 0o777 & ~umask;
    node_fs_1.default.mkdir(dir, { recursive: true, mode }, (err) => {
        if (err && err.code !== 'EEXIST') {
            return callback(err);
        }
        callback(null);
    });
}
