"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = read;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Reads a file relative to `pwd` and preserves Buffer mode when `encoding` is `null`.
 */
function read(src, options) {
    const { sync = false, encoding = 'utf8', flag = 'r' } = options ?? {};
    const resolved = node_path_1.default.resolve(this.pwd, src);
    if (sync) {
        if (encoding === null) {
            return node_fs_1.default.readFileSync(resolved, { encoding: null, flag });
        }
        return node_fs_1.default.readFileSync(resolved, { encoding, flag });
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.readFile(resolved, { encoding, flag }, (err, raw) => {
            if (err) {
                return reject(err);
            }
            resolve(raw);
        });
    });
}
