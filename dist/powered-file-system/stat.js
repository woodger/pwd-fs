"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stat = stat;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Returns `lstat` data so symlinks are reported as links instead of followed targets.
 */
function stat(src, options) {
    const { sync = false } = options ?? {};
    src = node_path_1.default.resolve(this.pwd, src);
    if (sync) {
        return node_fs_1.default.lstatSync(src);
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.lstat(src, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats);
        });
    });
}
