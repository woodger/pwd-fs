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
export function chownSync(src: string, uid: number | undefined, gid: number | undefined) {
  const stats = fs.statSync(src);
  // `0` is a valid uid/gid, so only nullish values mean "preserve current owner".
  const nextUid = uid ?? stats.uid;
  const nextGid = gid ?? stats.gid;

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chownSync(path.join(src, loc), nextUid, nextGid);
    }
  }

  fs.chownSync(src, nextUid, nextGid);
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

    // Overwrite is implemented as replace-before-copy to support directory targets.
    if (options.overwrite && fs.existsSync(dest)) {
      removeSync(dest);
    }

    fs.mkdirSync(dest, { mode });

    for (const loc of list) {
      copySync(path.join(src, loc), dest, options);
    }
  }
  else {
    // Match directory behavior by replacing the existing target before writing.
    if (options.overwrite && fs.existsSync(dest)) {
      removeSync(dest);
    }

    const flags = options.overwrite ? 0 : fs.constants.COPYFILE_EXCL;
    
    fs.copyFileSync(src, dest, flags);
    fs.chmodSync(dest, 0o666 & ~options.umask);
  }
}

/**
 * Synchronously removes files, directories, and symlinks without following links.
 */
export function removeSync(src: string) {
  fs.rmSync(src, { recursive: true, force: false });
}

/**
 * Synchronously removes all entries inside a directory while preserving it.
 */
export function emptyDirSync(src: string) {
  const list = fs.readdirSync(src);

  for (const loc of list) {
    fs.rmSync(path.join(src, loc), { recursive: true, force: false });
  }
}

/**
 * Synchronously creates a directory tree using permissions derived from umask.
 */
export function mkdirSync(dir: string, umask: number) {
  const mode = 0o777 & ~umask;
  fs.mkdirSync(dir, { recursive: true, mode });
}
