import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers recursive removal, including the symlink edge case.
 */
describe('remove', () => {
  let tmpDir = '';
  
  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('removes a directory with nested contents', async () => {
    createFixtureTree({
      [path.join(tmpDir, 'nested', 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    await pfs.remove(tmpDir);
    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.remove(path.join(tmpDir, resourceName));
    });
  }); 

  it('removes a directory with nested contents with sync option', () => {
    createFixtureTree({
      [path.join(tmpDir, 'nested', 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    pfs.remove(tmpDir, {
      sync: true
    });

    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.remove(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });

  it('removes only the link for a symlink to a directory with sync option', () => {
    const targetPath = path.join(tmpDir, 'target');
    const linkPath = path.join(tmpDir, 'target-link');
    createFixtureTree({
      [targetPath]: { type: 'directory' },
      [linkPath]: {
        type: 'symlink',
        target: targetPath
      }
    });

    pfs.remove(linkPath, {
      sync: true
    });

    assert.strictEqual(fs.existsSync(linkPath), false);
    assert(fs.existsSync(targetPath));
  });
});
