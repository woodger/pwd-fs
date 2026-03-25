"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = remove;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
/**
 * Removes a path relative to the instance root, preferring native recursive APIs when available.
 */
function remove(src, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    const { sync = false } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.removeSync)(src);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        const callback = (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        };
        if ('rm' in node_fs_1.default) {
            // Prefer the native recursive removal when the runtime supports it.
            node_fs_1.default.rm(src, { recursive: true }, callback);
        }
        else {
            (0, recurse_io_1.remove)(src, callback);
        }
    });
}
