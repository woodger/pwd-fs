import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies symbolic link target resolution without dereferencing it.
 */
describe('readlink', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      },
      [path.join(tmpDir, 'flexapp')]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('reads the stored symlink target', async () => {
    const target = await pfs.readlink(path.join(tmpDir, 'flexapp'));

    assert(target === path.join(tmpDir, 'tings.txt'));
  });

  it('reads the stored symlink target with sync option', () => {
    const target = pfs.readlink(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(target === path.join(tmpDir, 'tings.txt'));
  });
});
