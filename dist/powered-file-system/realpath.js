"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realpath = realpath;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Resolves a path to its canonical absolute location.
 */
function realpath(src, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    const { sync = false, encoding = 'utf8' } = options ?? {};
    if (sync) {
        return node_fs_1.default.realpathSync(src, { encoding });
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.realpath(src, { encoding }, (err, resolved) => {
            if (err) {
                return reject(err);
            }
            resolve(resolved);
        });
    });
}
