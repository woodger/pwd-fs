"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmock = fmock;
exports.restore = restore;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function fmock(frame) {
    const roots = new Set(Object.keys(frame)
        .map((src) => node_path_1.default.normalize(src).split(node_path_1.default.sep).filter(Boolean)[0])
        .filter(Boolean));
    for (const root of roots) {
        restore(root);
    }
    for (const src of Object.keys(frame)) {
        const { dir } = node_path_1.default.parse(src);
        const value = frame[src];
        node_fs_1.default.mkdirSync(dir, { recursive: true });
        if (value.type === 'directory') {
            node_fs_1.default.mkdirSync(src);
        }
        if (value.type === 'file') {
            node_fs_1.default.writeFileSync(src, value.data);
        }
        if (value.type === 'symlink') {
            let type;
            if (process.platform === 'win32') {
                const stats = node_fs_1.default.lstatSync(value.target);
                type = stats.isDirectory() ? 'junction' : 'file';
            }
            node_fs_1.default.symlinkSync(value.target, src, type);
        }
    }
}
function restore(tmpDir) {
    const removeRecursive = (src) => {
        if (node_fs_1.default.existsSync(src)) {
            const stats = node_fs_1.default.lstatSync(src);
            if (stats.isSymbolicLink()) {
                node_fs_1.default.unlinkSync(src);
                return;
            }
            node_fs_1.default.chmodSync(src, 0o755);
            node_fs_1.default.readdirSync(src).forEach((item) => {
                const curl = node_path_1.default.join(src, item);
                const stats = node_fs_1.default.lstatSync(curl);
                if (stats.isSymbolicLink()) {
                    node_fs_1.default.unlinkSync(curl);
                }
                else if (stats.isDirectory()) {
                    removeRecursive(curl);
                }
                else {
                    node_fs_1.default.chmodSync(curl, 0o666);
                    node_fs_1.default.unlinkSync(curl);
                }
            });
            node_fs_1.default.rmdirSync(src);
        }
    };
    removeRecursive(tmpDir);
}
