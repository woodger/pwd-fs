"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { sep } = path_1.default;
exports.default = {
    chmod(src, mode, callback) {
        let reduce = 0;
        fs_1.default.stat(src, (err, stat) => {
            if (err) {
                return callback(err);
            }
            if (stat.isDirectory()) {
                fs_1.default.readdir(src, (err, list) => {
                    if (err) {
                        return callback(err);
                    }
                    if (list.length === 0) {
                        return fs_1.default.chmod(src, mode, callback);
                    }
                    reduce += list.length;
                    for (const loc of list) {
                        this.chmod(`${src}${sep}${loc}`, mode, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            if (--reduce === 0) {
                                fs_1.default.chmod(src, mode, callback);
                            }
                        });
                    }
                });
            }
            else {
                fs_1.default.chmod(src, mode, callback);
            }
        });
    },
    chown(src, uid, gid, callback) {
        let reduce = 0;
        fs_1.default.stat(src, (err, stats) => {
            if (err) {
                return callback(err);
            }
            if (stats.isDirectory()) {
                fs_1.default.readdir(src, (err, list) => {
                    if (err) {
                        return callback(err);
                    }
                    if (list.length === 0) {
                        return fs_1.default.chown(src, uid, gid, callback);
                    }
                    reduce += list.length;
                    for (const loc of list) {
                        this.chown(`${src}${sep}${loc}`, uid, gid, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            if (--reduce === 0) {
                                fs_1.default.chown(src, uid, gid, callback);
                            }
                        });
                    }
                });
            }
            else {
                fs_1.default.chown(src, uid, gid, callback);
            }
        });
    },
    copy(src, dir, umask, callback) {
        let reduce = 0;
        fs_1.default.stat(src, (err, stat) => {
            if (err) {
                return callback(err);
            }
            if (stat.isDirectory()) {
                fs_1.default.readdir(src, (err, list) => {
                    if (err) {
                        return callback(err);
                    }
                    reduce += list.length;
                    const paths = src.split(sep);
                    const loc = paths[paths.length - 1];
                    const mode = 0o777 - umask;
                    dir = `${dir}${sep}${loc}`;
                    fs_1.default.mkdir(dir, { mode }, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (reduce === 0) {
                            return callback(null);
                        }
                        for (const loc of list) {
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
                const mode = 0o666 - umask;
                const loc = path_1.default.basename(src);
                const readStream = fs_1.default.createReadStream(src);
                const writeStream = fs_1.default.createWriteStream(`${dir}${sep}${loc}`, {
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
    },
    remove(src, callback) {
        let reduce = 0;
        fs_1.default.stat(src, (err, stat) => {
            if (err) {
                return callback(err);
            }
            if (stat.isDirectory()) {
                fs_1.default.readdir(src, (err, list) => {
                    if (err) {
                        return callback(err);
                    }
                    if (list.length === 0) {
                        return fs_1.default.rmdir(src, callback);
                    }
                    reduce += list.length;
                    for (const loc of list) {
                        this.remove(`${src}${sep}${loc}`, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            if (--reduce === 0) {
                                fs_1.default.rmdir(src, callback);
                            }
                        });
                    }
                });
            }
            else {
                fs_1.default.unlink(src, callback);
            }
        });
    },
    mkdir(dir, umask, callback) {
        const cwd = process.cwd();
        if (dir === cwd) {
            return callback(null);
        }
        const sequence = function* (dir, files, mode) {
            const iter = yield;
            for (const item of files) {
                dir += `${sep}${item}`;
                fs_1.default.mkdir(dir, { mode }, (err) => {
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
            dir = dir.substr(cwd.length);
        }
        const files = dir.split(sep);
        const mode = 0o777 - umask;
        const iter = sequence(use, files, mode);
        iter.next();
        iter.next(iter);
    }
};
