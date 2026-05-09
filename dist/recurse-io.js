"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmod = chmod;
exports.chown = chown;
exports.copy = copy;
exports.remove = remove;
exports.emptyDir = emptyDir;
exports.mkdir = mkdir;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function once(callback) {
    let called = false;
    return (err) => {
        // Recursive branches can fail concurrently; report only the first terminal result.
        if (called) {
            return;
        }
        called = true;
        callback(err);
    };
}
/**
 * Applies chmod depth-first so directories are updated after their contents.
 */
function chmod(src, mode, callback) {
    callback = once(callback);
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
    callback = once(callback);
    let reduce = 0;
    node_fs_1.default.stat(src, (err, stats) => {
        if (err) {
            return callback(err);
        }
        // `0` is a valid uid/gid, so only nullish values mean "preserve current owner".
        const nextUid = uid ?? stats.uid;
        const nextGid = gid ?? stats.gid;
        if (stats.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return node_fs_1.default.chown(src, nextUid, nextGid, callback);
                }
                reduce = list.length;
                for (const loc of list) {
                    chown(node_path_1.default.join(src, loc), nextUid, nextGid, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            node_fs_1.default.chown(src, nextUid, nextGid, callback);
                        }
                    });
                }
            });
        }
        else {
            node_fs_1.default.chown(src, nextUid, nextGid, callback);
        }
    });
}
/**
 * Copies a file system node into the target directory, creating directories as needed.
 */
function copy(src, dir, options, callback) {
    callback = once(callback);
    node_fs_1.default.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        const loc = node_path_1.default.basename(src);
        const dest = node_path_1.default.join(dir, loc);
        if (dest === src) {
            return callback(new Error(`Source and destination are identical: ${src}`));
        }
        if (options.filter && options.filter(src, dest) === false) {
            return callback(null);
        }
        if (stat.isDirectory()) {
            node_fs_1.default.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                const mode = 0o777 & ~options.umask;
                const create = () => {
                    node_fs_1.default.mkdir(dest, { mode }, (err) => {
                        if (err) {
                            if (err.code === 'EEXIST') {
                                err = new Error(`Target already exists: ${dest}`);
                            }
                            return callback(err);
                        }
                        if (list.length === 0) {
                            return callback(null);
                        }
                        let reduce = list.length;
                        for (const item of list) {
                            copy(node_path_1.default.join(src, item), dest, options, (err) => {
                                if (err) {
                                    return callback(err);
                                }
                                if (--reduce === 0) {
                                    callback(null);
                                }
                            });
                        }
                    });
                };
                if (!options.overwrite) {
                    return create();
                }
                // Overwrite is implemented as replace-before-copy to support directory targets.
                node_fs_1.default.lstat(dest, (err, destStat) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            return create();
                        }
                        return callback(err);
                    }
                    if (destStat.isDirectory()) {
                        return remove(dest, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            create();
                        });
                    }
                    node_fs_1.default.unlink(dest, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        create();
                    });
                });
            });
        }
        else {
            const mode = 0o666 & ~options.umask;
            const write = () => {
                const flags = options.overwrite ? 0 : node_fs_1.default.constants.COPYFILE_EXCL;
                node_fs_1.default.copyFile(src, dest, flags, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    node_fs_1.default.chmod(dest, mode, callback);
                });
            };
            if (!options.overwrite) {
                return write();
            }
            // Match directory behavior by replacing the existing target before writing.
            node_fs_1.default.lstat(dest, (err, destStat) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return write();
                    }
                    return callback(err);
                }
                if (destStat.isDirectory()) {
                    return remove(dest, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        write();
                    });
                }
                node_fs_1.default.unlink(dest, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    write();
                });
            });
        }
    });
}
/**
 * Removes files, directories, and symlinks without following symbolic links.
 */
function remove(src, callback) {
    node_fs_1.default.rm(src, { recursive: true, force: false }, once(callback));
}
/**
 * Removes all entries inside a directory while preserving the directory itself.
 */
function emptyDir(src, callback) {
    callback = once(callback);
    node_fs_1.default.readdir(src, (err, list) => {
        if (err) {
            return callback(err);
        }
        if (list.length === 0) {
            return callback(null);
        }
        let reduce = list.length;
        for (const loc of list) {
            node_fs_1.default.rm(node_path_1.default.join(src, loc), { recursive: true, force: false }, (err) => {
                if (err) {
                    return callback(err);
                }
                if (--reduce === 0) {
                    callback(null);
                }
            });
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
