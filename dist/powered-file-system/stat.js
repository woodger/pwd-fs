"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stat = stat;
const node_fs_1 = __importDefault(require("node:fs"));
function stat(src, options) {
    const { sync = false } = options ?? {};
    if (sync) {
        return node_fs_1.default.lstatSync(this.resolve(src));
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.lstat(src, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats);
        });
    });
}
