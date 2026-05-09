"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readlink = readlink;
const node_fs_1 = __importDefault(require("node:fs"));
function readlink(src, options) {
    const { sync = false, encoding = 'utf8' } = options ?? {};
    if (sync) {
        return node_fs_1.default.readlinkSync(this.resolve(src), { encoding });
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.readlink(src, { encoding }, (err, resolved) => {
            if (err) {
                return reject(err);
            }
            resolve(resolved);
        });
    });
}
