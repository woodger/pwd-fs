import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Ensures `stat()` preserves file type reporting for files, directories, and symlinks.
 */
describe('stat', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    
    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' },
      [path.join(tmpDir, 'flexapp')]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('returns information for a file', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'tings.txt'));

    assert(stats.isFile());
  });

  it('returns information for a directory', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'digest'));

    assert(stats.isDirectory());
  });

  it('returns information for a symlink', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'flexapp'));

    assert(stats.isSymbolicLink());
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.stat(path.join(tmpDir, resourceName));
    });
  });

  it('returns information for a file with sync option', () => {
    const stats = pfs.stat(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert(stats.isFile());
  });

  it('returns information for a directory with sync option', () => {
    const stats = pfs.stat(path.join(tmpDir, 'digest'), {
      sync: true
    });

    assert(stats.isDirectory());
  });

  it('returns information for a symlink with sync option', () => {
    const stats = pfs.stat(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(stats.isSymbolicLink());
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.stat(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
