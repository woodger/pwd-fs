"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chmod = chmod;
const node_path_1 = __importDefault(require("node:path"));
const recurse_io_1 = require("../recurse-io");
const recurse_io_sync_1 = require("../recurse-io-sync");
function chmod(src, mode, options) {
    const { sync = false } = options ?? {};
    src = node_path_1.default.resolve(this.pwd, src);
    if (sync) {
        (0, recurse_io_sync_1.chmodSync)(src, mode);
        return undefined;
    }
    return new Promise((resolve, reject) => {
        (0, recurse_io_1.chmod)(src, mode, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
