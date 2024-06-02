"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restore = exports.fmock = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function fmock(frame) {
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
            node_fs_1.default.symlinkSync(value.target, src);
        }
    }
}
exports.fmock = fmock;
function restore(tmpDir) {
    const removeRecursive = (src) => {
        if (node_fs_1.default.existsSync(src)) {
            node_fs_1.default.readdirSync(src).forEach((item) => {
                const curl = `${src}/${item}`;
                node_fs_1.default.lstatSync(curl).isDirectory()
                    ? removeRecursive(curl)
                    : node_fs_1.default.unlinkSync(curl);
            });
            node_fs_1.default.rmdirSync(src);
        }
    };
    removeRecursive(tmpDir);
}
exports.restore = restore;
