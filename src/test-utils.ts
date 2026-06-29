import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type FixtureNode =
  | { type: 'directory' }
  | { type: 'file'; data: string | Buffer }
  | { type: 'symlink'; target: string };

/**
 * Lightweight in-memory-like description of a temporary file system tree.
 */
export type Iframe = Record<string, FixtureNode>;

/**
 * Creates an isolated temporary directory for a single test case.
 */
export function createTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'pwd-fs-'));
}

/**
 * Materializes a test fixture tree on disk from a declarative frame description.
 */
export function fmock(frame: Iframe) {
  for (const [src, value] of Object.entries(frame)) {
    const { dir } = path.parse(src);

    fs.mkdirSync(dir, { recursive: true });

    switch (value.type) {
      case 'directory':
        fs.mkdirSync(src);
        break;

      case 'file':
        fs.writeFileSync(src, value.data);
        break;

      case 'symlink': {
        let type: fs.symlink.Type | undefined;

        if (process.platform === 'win32') {
          const stats = fs.lstatSync(value.target);
          type = stats.isDirectory() ? 'junction' : 'file';
        }

        fs.symlinkSync(value.target, src, type);
        break;
      }
    }
  }
}

/**
 * Removes the temporary fixture tree while resetting restrictive permissions first.
 */
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
