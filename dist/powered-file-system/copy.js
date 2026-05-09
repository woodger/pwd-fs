"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = copy;
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function copy(src, dest, options) {
    const { sync = false, umask = 0o000, overwrite = false, filter } = options ?? {};
    const copyOptions = filter ? { umask, overwrite, filter } : { umask, overwrite };
    if (sync) {
        (0, recurse_io_sync_1.copySync)(this.resolve(src), this.resolve(dest), copyOptions);
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
        (0, recurse_io_1.copy)(src, dest, copyOptions, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
