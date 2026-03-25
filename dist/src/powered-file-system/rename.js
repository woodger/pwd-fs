"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = rename;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function rename(src, dest, options) {
    src = node_path_1.default.resolve(this.pwd, src);
    dest = node_path_1.default.resolve(this.pwd, dest);
    const { sync = false } = options ?? {};
    if (sync) {
        node_fs_1.default.renameSync(src, dest);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.rename(src, dest, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
