"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chown = chown;
const node_fs_1 = __importDefault(require("node:fs"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function chown(src, options) {
    const { sync = false, uid, gid } = options ?? {};
    if (sync) {
        src = this.resolve(src);
        if (process.platform === 'win32') {
            // Windows does not expose POSIX ownership changes; keep existence checks consistent.
            node_fs_1.default.lstatSync(src);
            return;
        }
        (0, recurse_io_sync_1.chownSync)(src, uid, gid);
        return;
    }
    if (process.platform === 'win32') {
        return new Promise((resolve, reject) => {
            try {
                src = this.resolve(src);
            }
            catch (err) {
                reject(err);
                return;
            }
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
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        (0, recurse_io_1.chown)(src, uid, gid, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
