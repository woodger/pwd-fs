import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { FixtureTree, createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies directory cleanup while preserving the directory itself.
 */
describe('emptyDir', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    const frame: FixtureTree = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' },
      [path.join(tmpDir, 'digest', 'nested.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    };

    createFixtureTree(frame);
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('removes all directory contents but preserves the directory', async () => {
    await pfs.emptyDir(tmpDir);

    assert(fs.existsSync(tmpDir));
    assert.deepStrictEqual(fs.readdirSync(tmpDir), []);
  });

  it('rejects when resource is not a directory', async () => {
    await assert.rejects(async () => {
      await pfs.emptyDir(path.join(tmpDir, 'tings.txt'));
    });
  });

  it('removes all directory contents but preserves the directory with sync option', () => {
    pfs.emptyDir(tmpDir, {
      sync: true
    });

    assert(fs.existsSync(tmpDir));
    assert.deepStrictEqual(fs.readdirSync(tmpDir), []);
  });

  it('throws when resource is not a directory with sync option', () => {
    assert.throws(() => {
      pfs.emptyDir(path.join(tmpDir, 'tings.txt'), {
        sync: true
      });
    });
  });
});
