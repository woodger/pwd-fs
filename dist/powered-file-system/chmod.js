"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmod = chmod;
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function chmod(src, mode, options) {
    const { sync = false } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.chmodSync)(this.resolve(src), mode);
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
        (0, recurse_io_1.chmod)(src, mode, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
