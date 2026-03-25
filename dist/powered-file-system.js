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
const mkdir_1 = require("./powered-file-system/mkdir");
const read_1 = require("./powered-file-system/read");
const readdir_1 = require("./powered-file-system/readdir");
const remove_1 = require("./powered-file-system/remove");
const rename_1 = require("./powered-file-system/rename");
const stat_1 = require("./powered-file-system/stat");
const symlink_1 = require("./powered-file-system/symlink");
const test_1 = require("./powered-file-system/test");
const write_1 = require("./powered-file-system/write");
__exportStar(require("./bitmask"), exports);
class PoweredFileSystem {
    pwd;
    constants = {
        e: node_fs_1.default.constants.F_OK,
        r: node_fs_1.default.constants.R_OK,
        w: node_fs_1.default.constants.W_OK,
        x: node_fs_1.default.constants.X_OK
    };
    static bitmask = bitmask_1.bitmask;
    constructor(pwd) {
        this.pwd = pwd ? node_path_1.default.resolve(pwd) : process.cwd();
    }
    test(src, options) {
        return test_1.test.call(this, src, options);
    }
    stat(src, options) {
        return stat_1.stat.call(this, src, options);
    }
    chmod(src, mode, options) {
        return chmod_1.chmod.call(this, src, mode, options);
    }
    chown(src, options) {
        return chown_1.chown.call(this, src, options);
    }
    symlink(src, dest, options) {
        return symlink_1.symlink.call(this, src, dest, options);
    }
    copy(src, dest, options) {
        return copy_1.copy.call(this, src, dest, options);
    }
    rename(src, dest, options) {
        return rename_1.rename.call(this, src, dest, options);
    }
    remove(src, options) {
        return remove_1.remove.call(this, src, options);
    }
    read(src, options) {
        return read_1.read.call(this, src, options);
    }
    write(src, data, options) {
        return write_1.write.call(this, src, data, options);
    }
    /**
    * @deprecated The method should not be used
    */
    append(src, data, options) {
        return append_1.append.call(this, src, data, options);
    }
    readdir(dir, options) {
        return readdir_1.readdir.call(this, dir, options);
    }
    mkdir(dir, options) {
        return mkdir_1.mkdir.call(this, dir, options);
    }
}
exports.PoweredFileSystem = PoweredFileSystem;
