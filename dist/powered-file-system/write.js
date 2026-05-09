"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = write;
const node_fs_1 = __importDefault(require("node:fs"));
function write(src, data, options) {
    const { sync = false, encoding = 'utf8', umask = 0o000, flag = 'w', } = options ?? {};
    const mode = 0o666 & ~umask;
    if (sync) {
        src = this.resolve(src);
        // Apply chmod explicitly so the final mode is deterministic across runtimes.
        node_fs_1.default.writeFileSync(src, data, { encoding, mode, flag });
        node_fs_1.default.chmodSync(src, mode);
        return;
    }
    return new Promise((resolve, reject) => {
        try {
            src = this.resolve(src);
        }
        catch (err) {
            reject(err);
            return;
        }
        node_fs_1.default.writeFile(src, data, { encoding, mode, flag }, (err) => {
            if (err) {
                return reject(err);
            }
            // Align async behavior with the synchronous branch.
            node_fs_1.default.chmod(src, mode, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}
