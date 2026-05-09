"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realpath = realpath;
const node_fs_1 = __importDefault(require("node:fs"));
function realpath(src, options) {
    const { sync = false, encoding = 'utf8' } = options ?? {};
    if (sync) {
        return node_fs_1.default.realpathSync(this.resolve(src), { encoding });
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.realpath(src, { encoding }, (err, resolved) => {
            if (err) {
                return reject(err);
            }
            resolve(resolved);
        });
    });
}
