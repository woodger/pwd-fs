"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { sep } = path_1.default;
exports.default = {
    chmod(src, mode) {
        const stat = fs_1.default.statSync(src);
        if (stat.isDirectory()) {
            const list = fs_1.default.readdirSync(src);
            for (const loc of list) {
                this.chmod(`${src}${sep}${loc}`, mode);
            }
        }
        fs_1.default.chmodSync(src, mode);
    },
    chown(src, uid, gid) {
        const stat = fs_1.default.statSync(src);
        if (stat.isDirectory()) {
            const list = fs_1.default.readdirSync(src);
            for (const loc of list) {
                this.chown(`${src}${sep}${loc}`, uid, gid);
            }
        }
        fs_1.default.chownSync(src, uid, gid);
    },
    copy(src, dir, umask) {
        const stat = fs_1.default.statSync(src);
        if (stat.isDirectory()) {
            const list = fs_1.default.readdirSync(src);
            const paths = src.split(sep);
            const loc = paths[paths.length - 1];
            const mode = 0o777 - umask;
            dir = `${dir}${sep}${loc}`;
            fs_1.default.mkdirSync(dir, mode);
            for (const loc of list) {
                this.copy(`${src}${sep}${loc}`, dir, umask);
            }
        }
        else {
            const loc = path_1.default.basename(src);
            const use = `${dir}${sep}${loc}`;
            fs_1.default.copyFileSync(src, use);
        }
    },
    remove(src) {
        const stat = fs_1.default.statSync(src);
        if (stat.isDirectory()) {
            const list = fs_1.default.readdirSync(src);
            for (const loc of list) {
                this.remove(`${src}${sep}${loc}`);
            }
            fs_1.default.rmdirSync(src);
        }
        else {
            fs_1.default.unlinkSync(src);
        }
    },
    mkdir(dir, umask) {
        const mode = 0o777 - umask;
        const cwd = process.cwd();
        let use = '';
        if (dir.indexOf(cwd) === 0) {
            use = cwd;
            dir = dir.substr(cwd.length);
        }
        const ways = dir.split(sep).slice(1);
        for (const loc of ways) {
            use += `${sep}${loc}`;
            try {
                fs_1.default.mkdirSync(use, { mode });
            }
            catch (err) {
                if (err.errno !== -17) {
                    throw err;
                }
            }
        }
    }
};
//# sourceMappingURL=recurse-io-sync.js.map