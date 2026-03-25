"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdir = mkdir;
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
/**
 * Creates directories relative to the instance root.
 */
function mkdir(dir, options) {
    const { sync = false, umask = 0o000 } = options ?? {};
    dir = node_path_1.default.resolve(this.pwd, dir);
    if (sync) {
        (0, recurse_io_sync_1.mkdirSync)(dir, umask);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        (0, recurse_io_1.mkdir)(dir, umask, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
