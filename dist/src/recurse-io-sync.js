"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdirSync = exports.removeSync = exports.copySync = exports.chownSync = exports.chmodSync = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const { sep } = node_path_1.default;
function chmodSync(src, mode) {
    const stats = node_fs_1.default.statSync(src);
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chmodSync(`${src}${sep}${loc}`, mode);
        }
    }
    node_fs_1.default.chmodSync(src, mode);
}
exports.chmodSync = chmodSync;
function chownSync(src, uid, gid) {
    const stats = node_fs_1.default.statSync(src);
    if (uid === 0) {
        uid = stats.uid;
    }
    if (gid === 0) {
        gid = stats.gid;
    }
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chownSync(`${src}${sep}${loc}`, uid, gid);
        }
    }
    node_fs_1.default.chownSync(src, uid, gid);
}
exports.chownSync = chownSync;
function copySync(src, dir, umask) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        const paths = src.split(sep);
        const loc = paths[paths.length - 1];
        const mode = 0o777 - umask;
        dir = `${dir}${sep}${loc}`;
        node_fs_1.default.mkdirSync(dir, mode);
        for (const loc of list) {
            copySync(`${src}${sep}${loc}`, dir, umask);
        }
    }
    else {
        const loc = node_path_1.default.basename(src);
        const use = `${dir}${sep}${loc}`;
        node_fs_1.default.copyFileSync(src, use);
    }
}
exports.copySync = copySync;
function removeSync(src) {
    const stats = node_fs_1.default.statSync(src);
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            removeSync(`${src}${sep}${loc}`);
        }
        node_fs_1.default.rmdirSync(src);
    }
    else {
        node_fs_1.default.unlinkSync(src);
    }
}
exports.removeSync = removeSync;
function mkdirSync(dir, umask) {
    const mode = 0o777 - umask;
    const cwd = process.cwd();
    let use = '';
    if (dir.indexOf(cwd) === 0) {
        use = cwd;
        dir = dir.substring(cwd.length);
    }
    const ways = dir.split(sep).slice(1);
    for (const loc of ways) {
        use += `${sep}${loc}`;
        try {
            node_fs_1.default.mkdirSync(use, { mode });
        }
        catch (err) {
            if (err.errno !== -17) {
                throw err;
            }
        }
    }
}
exports.mkdirSync = mkdirSync;
