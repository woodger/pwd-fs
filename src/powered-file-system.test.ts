import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';
import { PoweredFileSystem } from './index';
import { createTmpDir, restore } from './test-utils';

/**
 * Verifies constructor path resolution semantics for the main API surface.
 */
describe('#constructor: new PoweredFileSystem(pwd?)', () => {
  it('Positive: An empty path must match the context of the cwd', () => {
    const { pwd } = new PoweredFileSystem();
    assert(pwd === process.cwd());
  });

  it('Positive: Absolute path must match the context of the pwd', () => {
    const { pwd } = new PoweredFileSystem(__dirname);
    assert(pwd === __dirname);
  });

  it('Positive: Resolve should accept paths inside the working directory', () => {
    const tmpDir = createTmpDir();

    try {
      const pfs = new PoweredFileSystem(tmpDir);
      const resolved = pfs.resolve('./nested/file.txt');

      assert(resolved === path.join(tmpDir, 'nested', 'file.txt'));
    }
    finally {
      restore(tmpDir);
    }
  });

  it('Positive: Resolve should preserve absolute paths outside the working directory', () => {
    const tmpDir = createTmpDir();
    const outsidePath = path.resolve(path.dirname(tmpDir), 'outside.txt');

    try {
      const pfs = new PoweredFileSystem(tmpDir);
      const resolved = pfs.resolve(outsidePath);

      assert(resolved === outsidePath);
    }
    finally {
      restore(tmpDir);
    }
  });
});
