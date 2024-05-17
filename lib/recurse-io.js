'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('node:fs');
var path = require('node:path');

const { sep } = path;
function chmod(src, mode, callback) {
    let reduce = 0;
    fs.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            fs.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return fs.chmod(src, mode, callback);
                }
                reduce += list.length;
                for (const loc of list) {
                    chmod(`${src}${sep}${loc}`, mode, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            fs.chmod(src, mode, callback);
                        }
                    });
                }
            });
        }
        else {
            fs.chmod(src, mode, callback);
        }
    });
}
function chown(src, uid, gid, callback) {
    let reduce = 0;
    fs.stat(src, (err, stats) => {
        if (err) {
            return callback(err);
        }
        if (stats.isDirectory()) {
            fs.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                if (list.length === 0) {
                    return fs.chown(src, uid, gid, callback);
                }
                reduce += list.length;
                for (const loc of list) {
                    chown(`${src}${sep}${loc}`, uid, gid, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            fs.chown(src, uid, gid, callback);
                        }
                    });
                }
            });
        }
        else {
            fs.chown(src, uid, gid, callback);
        }
    });
}
function copy(src, dir, umask, callback) {
    let reduce = 0;
    fs.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            fs.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                reduce += list.length;
                const paths = src.split(sep);
                const loc = paths[paths.length - 1];
                const mode = 0o777 - umask;
                dir = `${dir}${sep}${loc}`;
                fs.mkdir(dir, { mode }, (err) => {
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
            const loc = path.basename(src);
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(`${dir}${sep}${loc}`, {
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
function remove(src, callback) {
    fs.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            fs.readdir(src, (err, list) => {
                if (err) {
                    return callback(err);
                }
                let reduce = list.length;
                if (reduce === 0) {
                    return fs.rmdir(src, callback);
                }
                for (const loc of list) {
                    remove(`${src}${sep}${loc}`, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--reduce === 0) {
                            fs.rmdir(src, callback);
                        }
                    });
                }
            });
        }
        else {
            fs.unlink(src, callback);
        }
    });
}
function mkdir(dir, umask, callback) {
    const cwd = process.cwd();
    if (dir === cwd) {
        return callback(null);
    }
    const sequence = function* (dir, files, mode) {
        const iter = yield;
        for (const item of files) {
            dir += `${sep}${item}`;
            fs.mkdir(dir, { mode }, (err) => {
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
var recurse = {
    chmod,
    chown,
    copy,
    remove,
    mkdir
};

exports.default = recurse;