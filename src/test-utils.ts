import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type FixtureNode =
  | { type: 'directory' }
  | { type: 'file'; data: string | Buffer }
  | { type: 'symlink'; target: string };

/**
 * Declarative description of a temporary file system tree.
 */
export type FixtureTree = Record<string, FixtureNode>;

/**
 * Creates an isolated temporary directory for a single test case.
 */
export function createTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'pwd-fs-'));
}

/**
 * Materializes a test fixture tree on disk from a declarative frame description.
 */
export function createFixtureTree(frame: FixtureTree) {
  for (const [src, value] of Object.entries(frame)) {
    const { dir } = path.parse(src);

    fs.mkdirSync(dir, { recursive: true });

    switch (value.type) {
      case 'directory':
        fs.mkdirSync(src, { recursive: true });
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
export function removeFixtureTree(tmpDir: string) {
  const removeRecursive = (src: string) => {
    if (fs.existsSync(src)) {
      const stats = fs.lstatSync(src);

      if (stats.isSymbolicLink()) {
        fs.unlinkSync(src);
        return;
      }

      fs.chmodSync(src, 0o755);

      fs.readdirSync(src).forEach((item) => {
        const entryPath = path.join(src, item);
        const stats = fs.lstatSync(entryPath);

        if (stats.isSymbolicLink()) {
          fs.unlinkSync(entryPath);
        }
        else if (stats.isDirectory()) {
          removeRecursive(entryPath);
        }
        else {
          fs.chmodSync(entryPath, 0o666);
          fs.unlinkSync(entryPath);
        }
      });

      fs.rmdirSync(src);
    }
  };

  removeRecursive(tmpDir);
}
