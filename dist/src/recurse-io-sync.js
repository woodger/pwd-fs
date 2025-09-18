"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmodSync = chmodSync;
exports.chownSync = chownSync;
exports.copySync = copySync;
exports.removeSync = removeSync;
exports.mkdirSync = mkdirSync;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function chmodSync(src, mode) {
    const stats = node_fs_1.default.statSync(src);
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chmodSync(node_path_1.default.join(src, loc), mode);
        }
    }
    node_fs_1.default.chmodSync(src, mode);
}
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
            chownSync(node_path_1.default.join(src, loc), uid, gid);
        }
    }
    node_fs_1.default.chownSync(src, uid, gid);
}
function copySync(src, dir, umask) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        const loc = node_path_1.default.basename(src);
        const mode = 0o777 - umask;
        dir = node_path_1.default.join(dir, loc);
        node_fs_1.default.mkdirSync(dir, mode);
        for (const loc of list) {
            copySync(node_path_1.default.join(src, loc), dir, umask);
        }
    }
    else {
        const loc = node_path_1.default.basename(src);
        const use = node_path_1.default.join(dir, loc);
        node_fs_1.default.copyFileSync(src, use);
    }
}
function removeSync(src) {
    const stats = node_fs_1.default.statSync(src);
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            removeSync(node_path_1.default.join(src, loc));
        }
        node_fs_1.default.rmdirSync(src);
    }
    else {
        node_fs_1.default.unlinkSync(src);
    }
}
function mkdirSync(dir, umask) {
    const mode = 0o777 - umask;
    const cwd = process.cwd();
    let use = '';
    if (dir.indexOf(cwd) === 0) {
        use = cwd;
        dir = dir.substring(cwd.length);
    }
    const ways = dir.split(node_path_1.default.sep).slice(1);
    for (const loc of ways) {
        use = node_path_1.default.join(use, loc);
        try {
            node_fs_1.default.mkdirSync(use, { mode });
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    }
}
