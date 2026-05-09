"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readdir = readdir;
const node_fs_1 = __importDefault(require("node:fs"));
function readdir(dir, options) {
    const { sync = false, encoding = 'utf8' } = options ?? {};
    if (sync) {
        return node_fs_1.default.readdirSync(this.resolve(dir), { encoding });
    }
    return new Promise((resolve, reject) => {
        try {
            dir = this.resolve(dir);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.readdir(dir, { encoding }, (err, list) => {
            if (err) {
                return reject(err);
            }
            resolve(list);
        });
    });
}
