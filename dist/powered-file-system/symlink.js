"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symlink = symlink;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Windows requires an explicit link type. Non-Windows platforms infer it.
 */
function resolveSymlinkType(src) {
    if (process.platform !== 'win32') {
        return undefined;
    }
    const stats = node_fs_1.default.lstatSync(src);
    return stats.isDirectory() ? 'junction' : 'file';
}
function symlink(src, dest, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    dest = node_path_1.default.resolve(this.pwd, dest);
    const { sync = false } = options ?? {};
    if (sync) {
        const type = resolveSymlinkType(src);
        node_fs_1.default.symlinkSync(src, dest, type);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        if (process.platform === 'win32') {
            node_fs_1.default.lstat(src, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                const type = stats.isDirectory() ? 'junction' : 'file';
                node_fs_1.default.symlink(src, dest, type, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        }
        else {
            node_fs_1.default.symlink(src, dest, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }
    });
}
