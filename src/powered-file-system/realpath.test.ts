import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies canonical path resolution through symbolic links.
 */
describe('realpath(src [, options])', () => {
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

  it('Positive: Resolves the canonical target path', async () => {
    const target = await pfs.realpath(path.join(tmpDir, 'flexapp'));

    assert(target === path.join(tmpDir, 'tings.txt'));
  });

  it('[sync] Positive: Resolves the canonical target path', () => {
    const target = pfs.realpath(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(target === path.join(tmpDir, 'tings.txt'));
  });
});
