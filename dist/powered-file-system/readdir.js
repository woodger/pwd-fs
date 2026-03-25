"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readdir = readdir;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Lists directory entries relative to the current instance root.
 */
function readdir(dir, options) {
    const { sync = false, encoding = 'utf8' } = options ?? {};
    dir = node_path_1.default.resolve(this.pwd, dir);
    if (sync) {
        return node_fs_1.default.readdirSync(dir, { encoding });
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.readdir(dir, { encoding }, (err, list) => {
            if (err) {
                return reject(err);
            }
            resolve(list);
        });
    });
}
