import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies move semantics for both files and directories.
 */
describe('rename', () => {
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

  it('renames a file', async () => {
    await pfs.rename(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'newapp.txt'));
    const exist = fs.existsSync(path.join(tmpDir, 'newapp.txt'));

    assert(exist);
  });

  it('renames a directory', async () => {
    await pfs.rename(path.join(tmpDir, 'digest'), path.join(tmpDir, 'newxbase'));
    const exist = fs.existsSync(path.join(tmpDir, 'newxbase'));

    assert(exist);
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'));
    });
  });

  it('renames a file with sync option', () => {
    pfs.rename(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'newapp.txt'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'newapp.txt'));

    assert(exist);
  });

  it('renames a directory with sync option', () => {
    pfs.rename(path.join(tmpDir, 'digest'), path.join(tmpDir, 'newxbase'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'newxbase'));

    assert(exist);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'), {
        sync: true
      });
    });
  });
});
