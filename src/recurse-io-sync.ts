import fs from 'node:fs';
import path from 'node:path';
import type { ICopyOptions } from './recurse-io';

/**
 * Synchronous counterpart of the recursive chmod implementation.
 */
export function chmodSync(src: string, mode: number) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chmodSync(path.join(src, loc), mode);
    }
  }

  fs.chmodSync(src, mode);
}

/**
 * Synchronous counterpart of the recursive chown implementation.
 */
export function chownSync(src: string, uid: number, gid: number) {
  const stats = fs.statSync(src);

  if (uid === 0) {
    uid = stats.uid;
  }

  if (gid === 0) {
    gid = stats.gid;
  }

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chownSync(path.join(src, loc), uid, gid);
    }
  }

  fs.chownSync(src, uid, gid);
}

/**
 * Synchronously copies a file system node into the target directory.
 */
export function copySync(src: string, dir: string, options: ICopyOptions) {
  const stat = fs.statSync(src);
  const loc = path.basename(src);
  const dest = path.join(dir, loc);

  if (dest === src) {
    throw new Error(`Source and destination are identical: ${src}`);
  }

  if (options.filter && options.filter(src, dest) === false) {
    return;
  }

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);
    const mode = 0o777 & ~options.umask;

    if (options.overwrite && fs.existsSync(dest)) {
      removeSync(dest);
    }

    fs.mkdirSync(dest, { mode });

    for (const loc of list) {
      copySync(path.join(src, loc), dest, options);
    }
  }
  else {
    if (options.overwrite && fs.existsSync(dest)) {
      removeSync(dest);
    }

    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0o666 & ~options.umask);
  }
}

/**
 * Synchronously removes files, directories, and symlinks without following links.
 */
export function removeSync(src: string) {
  const stats = fs.lstatSync(src);

  if (stats.isSymbolicLink()) {
    fs.unlinkSync(src);
    return;
  }

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      removeSync(path.join(src, loc));
    }

    fs.rmdirSync(src);
  }
  else {
    fs.unlinkSync(src);
  }
}

/**
 * Synchronously removes all entries inside a directory while preserving it.
 */
export function emptyDirSync(src: string) {
  const list = fs.readdirSync(src);

  for (const loc of list) {
    removeSync(path.join(src, loc));
  }
}

/**
 * Synchronously creates a directory tree using permissions derived from umask.
 */
export function mkdirSync(dir: string, umask: number) {
  const mode = 0o777 & ~umask;
  fs.mkdirSync(dir, { recursive: true, mode });
}
