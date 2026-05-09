"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
const node_fs_1 = __importDefault(require("node:fs"));
function test(src, options) {
    const { sync = false, flag = 'e' } = options ?? {};
    const mode = this.constants[flag];
    if (sync) {
        try {
            src = this.resolve(src);
            node_fs_1.default.accessSync(src, mode);
            return true;
        }
        catch {
            return false;
        }
    }
    return new Promise((resolve) => {
        try {
            src = this.resolve(src);
        }
        catch {
            resolve(false);
            return;
        }
        node_fs_1.default.access(src, mode, (err) => {
            resolve(!err);
        });
    });
}
