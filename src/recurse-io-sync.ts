import fs from 'node:fs';
import path from 'node:path';

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

export function copySync(src: string, dir: string, umask: number) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    const loc = path.basename(src);
    const mode = 0o777 & ~umask;

    dir = path.join(dir, loc);
    fs.mkdirSync(dir, { mode });

    for (const loc of list) {
      copySync(path.join(src, loc), dir, umask);
    }
  }
  else {
    const loc = path.basename(src);
    const use = path.join(dir, loc);

    fs.copyFileSync(src, use);
    fs.chmodSync(use, 0o666 & ~umask);
  }
}

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

export function mkdirSync(dir: string, umask: number) {
  const mode = 0o777 & ~umask;
  fs.mkdirSync(dir, { recursive: true, mode });
}
