import fs from 'node:fs';
import path from 'node:path';

const { sep } = path;

export function chmodSync(src: string, mode: number) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chmodSync(`${src}${sep}${loc}`, mode);
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
      chownSync(`${src}${sep}${loc}`, uid, gid);
    }
  }

  fs.chownSync(src, uid, gid);
}

export function copySync(src: string, dir: string, umask: number) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    const paths = src.split(sep);
    const loc = paths[paths.length - 1];
    const mode = 0o777 - umask;

    dir = `${dir}${sep}${loc}`;
    fs.mkdirSync(dir, mode);

    for (const loc of list) {
      copySync(`${src}${sep}${loc}`, dir, umask);
    }
  }
  else {
    const loc = path.basename(src);
    const use = `${dir}${sep}${loc}`;

    fs.copyFileSync(src, use);
  }
}

export function removeSync(src: string) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      removeSync(`${src}${sep}${loc}`);
    }

    fs.rmdirSync(src);
  }
  else {
    fs.unlinkSync(src);
  }
}

export function mkdirSync(dir: string, umask: number) {
  const mode = 0o777 - umask;
  const cwd = process.cwd();
  let use = '';

  if (dir.indexOf(cwd) === 0) {
    use = cwd;
    dir = dir.substring(cwd.length);
  }

  const ways = dir.split(sep).slice(1);

  for (const loc of ways) {
    use += `${sep}${loc}`;

    try {
      fs.mkdirSync(use, { mode });
    }
    catch (err) {
      if (err.errno !== -17) {
        throw err;
      }
    }
  }
}
