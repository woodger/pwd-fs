import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies canonical path resolution through symbolic links.
 */
describe('realpath', () => {
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

  it('resolves the canonical target path', async () => {
    const target = await pfs.realpath(path.join(tmpDir, 'flexapp'));

    assert(target === path.join(tmpDir, 'tings.txt'));
  });

  it('resolves the canonical target path with sync option', () => {
    const target = pfs.realpath(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(target === path.join(tmpDir, 'tings.txt'));
  });
});
