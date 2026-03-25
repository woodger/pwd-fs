"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = copy;
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
/**
 * Resolves source and destination paths before delegating recursive copy work.
 */
function copy(src, dest, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    dest = node_path_1.default.resolve(this.pwd, dest);
    const { sync = false, umask = 0o000 } = options ?? {};
    if (sync) {
        (0, recurse_io_sync_1.copySync)(src, dest, umask);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        (0, recurse_io_1.copy)(src, dest, umask, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
