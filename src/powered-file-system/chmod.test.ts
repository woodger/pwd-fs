import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Ensures recursive permission updates affect both directories and nested files.
 */
describe('chmod(src, mode [, options])', () => {
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

  it('Positive: Changes directory and file permissions', async () => {
    await pfs.chmod(tmpDir, 0o444);

    const writable = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });

  it('Negative: Throw if not exists resource', async () => {
    await assert.rejects(async () => {
      await pfs.chmod('./non-existent-source', 0o744);
    });
  });

  it('[sync] Positive: Changes permissions of directory', () => {
    pfs.chmod(tmpDir, 0o444, {
      sync: true
    });

    const writable = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });

  it('[sync] Positive: Changes file permissions', () => {
    pfs.chmod(path.join(tmpDir, 'tings.txt'), 0o444, {
      sync: true
    });

    const writable = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.chmod(`./${resourceName}`, 0o744, {
        sync: true
      });
    });
  });
});
