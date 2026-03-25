"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chown = chown;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function chown(src, options) {
    const { sync = false, uid = 0, gid = 0 } = options ?? {};
    src = node_path_1.default.resolve(this.pwd, src);
    if (sync) {
        if (process.platform === 'win32') {
            // Windows does not expose POSIX ownership changes; keep existence checks consistent.
            node_fs_1.default.lstatSync(src);
            return undefined;
        }
        (0, recurse_io_sync_1.chownSync)(src, uid, gid);
        return undefined;
    }
    if (process.platform === 'win32') {
        return new Promise((resolve, reject) => {
            // Match Unix behavior by validating the path even when ownership cannot be changed.
            node_fs_1.default.lstat(src, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    return new Promise((resolve, reject) => {
        (0, recurse_io_1.chown)(src, uid, gid, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
