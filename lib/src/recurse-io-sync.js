"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const { sep } = node_path_1.default;
function chmod(src, mode) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chmod(`${src}${sep}${loc}`, mode);
        }
    }
    node_fs_1.default.chmodSync(src, mode);
}
function chown(src, uid, gid) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chown(`${src}${sep}${loc}`, uid, gid);
        }
    }
    node_fs_1.default.chownSync(src, uid, gid);
}
function copy(src, dir, umask) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        const paths = src.split(sep);
        const loc = paths[paths.length - 1];
        const mode = 0o777 - umask;
        dir = `${dir}${sep}${loc}`;
        node_fs_1.default.mkdirSync(dir, mode);
        for (const loc of list) {
            copy(`${src}${sep}${loc}`, dir, umask);
        }
    }
    else {
        const loc = node_path_1.default.basename(src);
        const use = `${dir}${sep}${loc}`;
        node_fs_1.default.copyFileSync(src, use);
    }
}
function remove(src) {
    const stat = node_fs_1.default.statSync(src);
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            remove(`${src}${sep}${loc}`);
        }
        node_fs_1.default.rmdirSync(src);
    }
    else {
        node_fs_1.default.unlinkSync(src);
    }
}
function mkdir(dir, umask) {
    const mode = 0o777 - umask;
    const cwd = process.cwd();
    let use = '';
    if (dir.indexOf(cwd) === 0) {
        use = cwd;
        dir = dir.substr(cwd.length);
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
exports.default = {
    chmod,
    chown,
    copy,
    remove,
    mkdir
};
