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
const bitmask_1 = require("./bitmask");
const append_1 = require("./powered-file-system/append");
const chmod_1 = require("./powered-file-system/chmod");
const chown_1 = require("./powered-file-system/chown");
const copy_1 = require("./powered-file-system/copy");
const empty_dir_1 = require("./powered-file-system/empty-dir");
const mkdir_1 = require("./powered-file-system/mkdir");
const read_1 = require("./powered-file-system/read");
const readlink_1 = require("./powered-file-system/readlink");
const readdir_1 = require("./powered-file-system/readdir");
const realpath_1 = require("./powered-file-system/realpath");
const remove_1 = require("./powered-file-system/remove");
const rename_1 = require("./powered-file-system/rename");
const stat_1 = require("./powered-file-system/stat");
const symlink_1 = require("./powered-file-system/symlink");
const test_1 = require("./powered-file-system/test");
const write_1 = require("./powered-file-system/write");
__exportStar(require("./bitmask"), exports);
/**
 * Path-aware wrapper around Node's file system APIs.
 *
 * All relative paths are resolved against `pwd`, which makes the instance
 * suitable for sandboxed or virtual working-directory workflows.
 */
class PoweredFileSystem {
    pwd;
    /**
     * Access mode aliases used by `test()`.
     */
    constants = {
        e: node_fs_1.default.constants.F_OK,
        r: node_fs_1.default.constants.R_OK,
        w: node_fs_1.default.constants.W_OK,
        x: node_fs_1.default.constants.X_OK
    };
    /**
     * Exposes permission mask normalization as a static helper.
     */
    static bitmask = bitmask_1.bitmask;
    /**
     * @param pwd Base directory used to resolve all relative paths.
     */
    constructor(pwd) {
        this.pwd = pwd ? node_path_1.default.resolve(pwd) : process.cwd();
    }
    /**
     * Checks whether the given path is accessible with the requested mode.
     */
    test(src, options) {
        return test_1.test.call(this, src, options);
    }
    /**
     * Returns `lstat` information for a path.
     */
    stat(src, options) {
        return stat_1.stat.call(this, src, options);
    }
    /**
     * Applies a mode recursively to a file or directory tree.
     */
    chmod(src, mode, options) {
        return chmod_1.chmod.call(this, src, mode, options);
    }
    /**
     * Applies ownership recursively to a file or directory tree.
     */
    chown(src, options) {
        return chown_1.chown.call(this, src, options);
    }
    /**
     * Creates a symbolic link from `dest` to `src`.
     */
    symlink(src, dest, options) {
        return symlink_1.symlink.call(this, src, dest, options);
    }
    /**
     * Copies `src` into the destination directory.
     */
    copy(src, dest, options) {
        return copy_1.copy.call(this, src, dest, options);
    }
    /**
     * Renames or moves a file system node.
     */
    rename(src, dest, options) {
        return rename_1.rename.call(this, src, dest, options);
    }
    /**
     * Removes a file system node recursively.
     */
    remove(src, options) {
        return remove_1.remove.call(this, src, options);
    }
    /**
     * Removes all directory entries while preserving the directory itself.
     */
    emptyDir(src, options) {
        return empty_dir_1.emptyDir.call(this, src, options);
    }
    /**
     * Reads a file relative to the current instance root.
     */
    read(src, options) {
        return read_1.read.call(this, src, options);
    }
    /**
     * Writes a file and applies the resulting permissions explicitly.
     */
    write(src, data, options) {
        return write_1.write.call(this, src, data, options);
    }
    /**
     * @deprecated Use `write(..., { flag: 'a' })` instead.
     */
    append(src, data, options) {
        return append_1.append.call(this, src, data, options);
    }
    /**
     * Lists directory entries relative to the current instance root.
     */
    readdir(dir, options) {
        return readdir_1.readdir.call(this, dir, options);
    }
    /**
     * Resolves the target of a symbolic link.
     */
    readlink(src, options) {
        return readlink_1.readlink.call(this, src, options);
    }
    /**
     * Resolves a path to its canonical absolute location.
     */
    realpath(src, options) {
        return realpath_1.realpath.call(this, src, options);
    }
    /**
     * Creates a directory tree relative to the current instance root.
     */
    mkdir(dir, options) {
        return mkdir_1.mkdir.call(this, dir, options);
    }
}
exports.PoweredFileSystem = PoweredFileSystem;
