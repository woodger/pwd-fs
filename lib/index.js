'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var poweredFileSystem = require('./powered-file-system.js');

// const pfs = new PoweredFileSystem();
// export const test = pfs.test;
// export const stat = pfs.stat;
// export const chmod = pfs.chmod;
// export const chown = pfs.chown;
// export const symlink = pfs.symlink;
// export const copy = pfs.copy;
// export const rename = pfs.rename;
// export const remove = pfs.remove;
// export const read = pfs.read;
// export const write = pfs.write;
// export const append = pfs.append;
// export const readdir = pfs.readdir;
// export const mkdir = pfs.mkdir;
const bitmask = poweredFileSystem.PoweredFileSystem.bitmask;

exports.default = poweredFileSystem.PoweredFileSystem;
exports.bitmask = bitmask;
