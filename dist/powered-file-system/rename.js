"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = rename;
const node_fs_1 = __importDefault(require("node:fs"));
function rename(src, dest, options) {
    const { sync = false } = options ?? {};
    if (sync) {
        src = this.resolve(src);
        dest = this.resolve(dest);
        node_fs_1.default.renameSync(src, dest);
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
            dest = this.resolve(dest);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.rename(src, dest, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
