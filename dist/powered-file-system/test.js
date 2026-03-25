"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function test(src, options) {
    const { sync = false, flag = 'e' } = options ?? {};
    const mode = this.constants[flag];
    src = node_path_1.default.resolve(this.pwd, src);
    if (sync) {
        try {
            node_fs_1.default.accessSync(src, mode);
            return true;
        }
        catch {
            return false;
        }
    }
    return new Promise((resolve) => {
        node_fs_1.default.access(src, mode, (err) => {
            resolve(!err);
        });
    });
}
