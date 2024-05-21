import fs from 'node:fs';
import path from 'node:path';

const { sep } = path;

function chmod(src: string, mode: number) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chmod(`${src}${sep}${loc}`, mode);
    }
  }

  fs.chmodSync(src, mode);
}

function chown(src: string, uid: number, gid: number) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      chown(`${src}${sep}${loc}`, uid, gid);
    }
  }

  fs.chownSync(src, uid, gid);
}

function copy(src: string, dir: string, umask: number) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    const paths = src.split(sep);
    const loc = paths[paths.length - 1];
    const mode = 0o777 - umask;

    dir = `${dir}${sep}${loc}`;
    fs.mkdirSync(dir, mode);

    for (const loc of list) {
      copy(`${src}${sep}${loc}`, dir, umask);
    }
  }
  else {
    const loc = path.basename(src);
    const use = `${dir}${sep}${loc}`;

    fs.copyFileSync(src, use);
  }
}

function remove(src: string) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const list = fs.readdirSync(src);

    for (const loc of list) {
      remove(`${src}${sep}${loc}`);
    }

    fs.rmdirSync(src);
  }
  else {
    fs.unlinkSync(src);
  }
}

function mkdir(dir: string, umask: number) {
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
      fs.mkdirSync(use, { mode });
    }
    catch (err) {
      if (err.errno !== -17) {
        throw err;
      }
    }
  }
}

export default {
  chmod,
  chown,
  copy,
  remove,
  mkdir
}
