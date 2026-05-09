"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symlink = symlink;
const node_fs_1 = __importDefault(require("node:fs"));
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
    const { sync = false } = options ?? {};
    if (sync) {
        src = this.resolve(src);
        dest = this.resolve(dest);
        const type = resolveSymlinkType(src);
        node_fs_1.default.symlinkSync(src, dest, type);
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
            dest = this.resolve(dest);
        }
        catch (err) {
            reject(err);
            return;
        }
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
