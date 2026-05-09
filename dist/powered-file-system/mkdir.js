"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdir = mkdir;
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function mkdir(dir, options) {
    const { sync = false, umask = 0o000 } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.mkdirSync)(this.resolve(dir), umask);
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            dir = this.resolve(dir);
        }
        catch (err) {
            reject(err);
            return;
        }
        (0, recurse_io_1.mkdir)(dir, umask, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
