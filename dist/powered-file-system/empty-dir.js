"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyDir = emptyDir;
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function emptyDir(src, options) {
    const { sync = false } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.emptyDirSync)(this.resolve(src));
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        (0, recurse_io_1.emptyDir)(src, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
