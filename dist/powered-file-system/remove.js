"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = remove;
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function remove(src, options) {
    const { sync = false } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.removeSync)(this.resolve(src));
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
        (0, recurse_io_1.remove)(src, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
