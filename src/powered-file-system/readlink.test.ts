import assert from 'node:assert';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies symbolic link target resolution without dereferencing it.
 */
describe('readlink(src [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
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

  it('Positive: Reads the stored symlink target', async () => {
    const target = await pfs.readlink(path.join(tmpDir, 'flexapp'));

    assert(target === path.join(tmpDir, 'tings.txt'));
  });

  it('[sync] Positive: Reads the stored symlink target', () => {
    const target = pfs.readlink(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(target === path.join(tmpDir, 'tings.txt'));
  });
});
