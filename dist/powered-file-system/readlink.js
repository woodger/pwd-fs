"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readlink = readlink;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Reads the target path stored in a symbolic link.
 */
function readlink(src, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    const { sync = false, encoding = 'utf8' } = options ?? {};
    if (sync) {
        return node_fs_1.default.readlinkSync(src, { encoding });
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.readlink(src, { encoding }, (err, resolved) => {
            if (err) {
                return reject(err);
            }
            resolve(resolved);
        });
    });
}
