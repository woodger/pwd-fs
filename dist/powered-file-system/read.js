"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = read;
const node_fs_1 = __importDefault(require("node:fs"));
function read(src, options) {
    const { sync = false, encoding = 'utf8', flag = 'r' } = options ?? {};
    if (sync) {
        const resolved = this.resolve(src);
        if (encoding === null) {
            return node_fs_1.default.readFileSync(resolved, { encoding: null, flag });
        }
        return node_fs_1.default.readFileSync(resolved, { encoding, flag });
    }
    return new Promise((resolve, reject) => {
        let resolved;
        try {
            resolved = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.readFile(resolved, { encoding, flag }, (err, raw) => {
            if (err) {
                return reject(err);
            }
            resolve(raw);
        });
    });
}
