"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = append;
function append(src, data, options) {
    const { sync = false, encoding = 'utf8', umask = 0o000 } = options ?? {};
    return this.write(src, data, { sync, encoding, umask, flag: 'a' });
}
