import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface Iframe {
  [key: string]: any
}

export function createTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'pwd-fs-'));
}

export function fmock(frame: Iframe) {
  for (const src of Object.keys(frame)) {
    const { dir } = path.parse(src);
    const value = frame[src];

    fs.mkdirSync(dir, { recursive: true });

    if (value.type === 'directory') {
      fs.mkdirSync(src);
    }

    if (value.type === 'file') {
      fs.writeFileSync(src, value.data);
    }

    if (value.type === 'symlink') {
      let type: fs.symlink.Type | undefined;

      if (process.platform === 'win32') {
        const stats = fs.lstatSync(value.target);
        type = stats.isDirectory() ? 'junction' : 'file';
      }

      fs.symlinkSync(value.target, src, type);
    }
  }
}

export function restore(tmpDir: string) {
  const removeRecursive = (src: string) => {
    if (fs.existsSync(src)) {
      const stats = fs.lstatSync(src);

      if (stats.isSymbolicLink()) {
        fs.unlinkSync(src);
        return;
      }

      fs.chmodSync(src, 0o755);

      fs.readdirSync(src).forEach((item) => {
        const curl = path.join(src, item);
        const stats = fs.lstatSync(curl);

        if (stats.isSymbolicLink()) {
          fs.unlinkSync(curl);
        }
        else if (stats.isDirectory()) {
          removeRecursive(curl);
        }
        else {
          fs.chmodSync(curl, 0o666);
          fs.unlinkSync(curl);
        }
      });

      fs.rmdirSync(src);
    }
  };

  removeRecursive(tmpDir);
}
