import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies move semantics for both files and directories.
 */
describe('rename(src, use [, options])', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('Positive: Must be recursive rename file', async () => {
    await pfs.rename(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'newapp.txt'));
    const exist = fs.existsSync(path.join(tmpDir, 'newapp.txt'));

    assert(exist);
  });

  it('Positive: Must be recursive rename directory', async () => {
    await pfs.rename(path.join(tmpDir, 'digest'), path.join(tmpDir, 'newxbase'));
    const exist = fs.existsSync(path.join(tmpDir, 'newxbase'));

    assert(exist);
  });

  it('Negative: Throw if not exists resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'));
    });
  });

  it('[sync] Positive: Must be recursive rename file', () => {
    pfs.rename(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'newapp.txt'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'newapp.txt'));

    assert(exist);
  });

  it('[sync] Positive: Must be recursive rename directory', () => {
    pfs.rename(path.join(tmpDir, 'digest'), path.join(tmpDir, 'newxbase'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'newxbase'));

    assert(exist);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'), {
        sync: true
      });
    });
  });
});
