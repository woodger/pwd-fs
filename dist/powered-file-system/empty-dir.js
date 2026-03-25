"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyDir = emptyDir;
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
/**
 * Removes directory contents while preserving the directory itself.
 */
function emptyDir(src, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    const { sync = false } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.emptyDirSync)(src);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        (0, recurse_io_1.emptyDir)(src, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
