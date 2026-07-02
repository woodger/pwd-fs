import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Ensures recursive permission updates affect both directories and nested files.
 */
const itUnix = process.platform === 'win32' ? it.skip : it;

describe('chmod', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  itUnix('updates directory and nested file modes recursively', async () => {
    await pfs.chmod(tmpDir, 0o555);

    const dirMode = fs.statSync(tmpDir).mode & 0o777;
    const fileMode = fs.statSync(path.join(tmpDir, 'tings.txt')).mode & 0o777;

    assert.strictEqual(dirMode, 0o555);
    assert.strictEqual(fileMode, 0o555);
  });

  it('rejects for a missing resource', async () => {
    await assert.rejects(async () => {
      await pfs.chmod('./non-existent-source', 0o744);
    });
  });

  itUnix('updates directory and nested file modes recursively with sync option', () => {
    pfs.chmod(tmpDir, 0o555, {
      sync: true
    });

    const dirMode = fs.statSync(tmpDir).mode & 0o777;
    const fileMode = fs.statSync(path.join(tmpDir, 'tings.txt')).mode & 0o777;

    assert.strictEqual(dirMode, 0o555);
    assert.strictEqual(fileMode, 0o555);
  });

  itUnix('updates file mode with sync option', () => {
    pfs.chmod(path.join(tmpDir, 'tings.txt'), 0o444, {
      sync: true
    });

    const fileMode = fs.statSync(path.join(tmpDir, 'tings.txt')).mode & 0o777;

    assert.strictEqual(fileMode, 0o444);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.chmod(`./${resourceName}`, 0o744, {
        sync: true
      });
    });
  });
});
