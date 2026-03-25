"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = write;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function write(src, data, options) {
    const { sync = false, encoding = 'utf8', umask = 0o000, flag = 'w', } = options ?? {};
    src = node_path_1.default.resolve(this.pwd, src);
    const mode = 0o666 & ~umask;
    if (sync) {
        node_fs_1.default.writeFileSync(src, data, { encoding, mode, flag });
        node_fs_1.default.chmodSync(src, mode);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        node_fs_1.default.writeFile(src, data, { encoding, mode, flag }, (err) => {
            if (err) {
                return reject(err);
            }
            node_fs_1.default.chmod(src, mode, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}
