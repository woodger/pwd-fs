import {
  type Mode as TMode,
  type Flag as TFlag,
  type Stats as TStats,
  PoweredFileSystem
} from './powered-file-system';

export type Mode = TMode;
export type Flag = TFlag;
export type Stats = TStats;

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

export const bitmask = PoweredFileSystem.bitmask;
export default PoweredFileSystem;