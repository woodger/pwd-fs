"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = append;
function append(src, data, options) {
    const { sync = false, encoding = 'utf8', umask = 0o000 } = options ?? {};
    if (sync) {
        return this.write(src, data, { sync: true, encoding, umask, flag: 'a' });
    }
    return this.write(src, data, { encoding, umask, flag: 'a' });
}
