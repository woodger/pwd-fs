import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';
import { PoweredFileSystem } from './index';
import { createTmpDir, removeFixtureTree } from './test-utils';

/**
 * Verifies constructor path resolution semantics for the main API surface.
 */
describe('PoweredFileSystem', () => {
  it('uses process.cwd() as the default pwd', () => {
    const { pwd } = new PoweredFileSystem();
    assert(pwd === process.cwd());
  });

  it('uses an absolute path as pwd', () => {
    const { pwd } = new PoweredFileSystem(__dirname);
    assert(pwd === __dirname);
  });

  it('resolves relative paths against pwd', () => {
    const tmpDir = createTmpDir();

    try {
      const pfs = new PoweredFileSystem(tmpDir);
      const resolved = pfs.resolve('./nested/file.txt');

      assert(resolved === path.join(tmpDir, 'nested', 'file.txt'));
    }
    finally {
      removeFixtureTree(tmpDir);
    }
  });

  it('preserves absolute paths outside pwd', () => {
    const tmpDir = createTmpDir();
    const outsidePath = path.resolve(path.dirname(tmpDir), 'outside.txt');

    try {
      const pfs = new PoweredFileSystem(tmpDir);
      const resolved = pfs.resolve(outsidePath);

      assert(resolved === outsidePath);
    }
    finally {
      removeFixtureTree(tmpDir);
    }
  });
});
