"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmodSync = chmodSync;
exports.chownSync = chownSync;
exports.copySync = copySync;
exports.removeSync = removeSync;
exports.emptyDirSync = emptyDirSync;
exports.mkdirSync = mkdirSync;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Synchronous counterpart of the recursive chmod implementation.
 */
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
/**
 * Synchronous counterpart of the recursive chown implementation.
 */
function chownSync(src, uid, gid) {
    const stats = node_fs_1.default.statSync(src);
    // `0` is a valid uid/gid, so only nullish values mean "preserve current owner".
    const nextUid = uid ?? stats.uid;
    const nextGid = gid ?? stats.gid;
    if (stats.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        for (const loc of list) {
            chownSync(node_path_1.default.join(src, loc), nextUid, nextGid);
        }
    }
    node_fs_1.default.chownSync(src, nextUid, nextGid);
}
/**
 * Synchronously copies a file system node into the target directory.
 */
function copySync(src, dir, options) {
    const stat = node_fs_1.default.statSync(src);
    const loc = node_path_1.default.basename(src);
    const dest = node_path_1.default.join(dir, loc);
    if (dest === src) {
        throw new Error(`Source and destination are identical: ${src}`);
    }
    if (options.filter && options.filter(src, dest) === false) {
        return;
    }
    if (stat.isDirectory()) {
        const list = node_fs_1.default.readdirSync(src);
        const mode = 0o777 & ~options.umask;
        // Overwrite is implemented as replace-before-copy to support directory targets.
        if (options.overwrite && node_fs_1.default.existsSync(dest)) {
            removeSync(dest);
        }
        node_fs_1.default.mkdirSync(dest, { mode });
        for (const loc of list) {
            copySync(node_path_1.default.join(src, loc), dest, options);
        }
    }
    else {
        // Match directory behavior by replacing the existing target before writing.
        if (options.overwrite && node_fs_1.default.existsSync(dest)) {
            removeSync(dest);
        }
        const flags = options.overwrite ? 0 : node_fs_1.default.constants.COPYFILE_EXCL;
        node_fs_1.default.copyFileSync(src, dest, flags);
        node_fs_1.default.chmodSync(dest, 0o666 & ~options.umask);
    }
}
/**
 * Synchronously removes files, directories, and symlinks without following links.
 */
function removeSync(src) {
    node_fs_1.default.rmSync(src, { recursive: true, force: false });
}
/**
 * Synchronously removes all entries inside a directory while preserving it.
 */
function emptyDirSync(src) {
    const list = node_fs_1.default.readdirSync(src);
    for (const loc of list) {
        node_fs_1.default.rmSync(node_path_1.default.join(src, loc), { recursive: true, force: false });
    }
}
/**
 * Synchronously creates a directory tree using permissions derived from umask.
 */
function mkdirSync(dir, umask) {
    const mode = 0o777 & ~umask;
    node_fs_1.default.mkdirSync(dir, { recursive: true, mode });
}
