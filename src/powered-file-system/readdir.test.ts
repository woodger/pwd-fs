import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies directory listing behavior and invalid-target failures.
 */
describe('readdir', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('returns directory entry names', async () => {
    createFixtureTree({
      [path.join(tmpDir, 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    const entries = await pfs.readdir(tmpDir);

    assert.deepStrictEqual(entries, ['entry.txt']);
  });

  it('returns buffer entry names when encoding is null', async () => {
    createFixtureTree({
      [path.join(tmpDir, 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    const entries = await pfs.readdir(tmpDir, {
      encoding: null
    });

    assert.deepStrictEqual(entries, [Buffer.from('entry.txt')]);
  });

  it('returns an empty listing for an empty directory', async () => {
    const entries = await pfs.readdir(tmpDir);

    assert.deepStrictEqual(entries, []);
  });

  it('rejects when resource is not a directory', async () => {
    const filePath = path.join(tmpDir, 'entry.txt');
    createFixtureTree({
      [filePath]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    await assert.rejects(async () => {
      await pfs.readdir(filePath);
    });
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.readdir(path.join(tmpDir, resourceName));
    });
  });

  it('returns directory entry names with sync option', () => {
    createFixtureTree({
      [path.join(tmpDir, 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    const entries = pfs.readdir(tmpDir, {
      sync: true
    });

    assert.deepStrictEqual(entries, ['entry.txt']);
  });

  it('returns buffer entry names when encoding is null with sync option', () => {
    createFixtureTree({
      [path.join(tmpDir, 'entry.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    const entries = pfs.readdir(tmpDir, {
      sync: true,
      encoding: null
    });

    assert.deepStrictEqual(entries, [Buffer.from('entry.txt')]);
  });

  it('returns an empty listing for an empty directory with sync option', () => {
    const entries = pfs.readdir(tmpDir, {
      sync: true
    });

    assert.deepStrictEqual(entries, []);
  });

  it('throws when resource is not a directory with sync option', () => {
    const filePath = path.join(tmpDir, 'entry.txt');
    createFixtureTree({
      [filePath]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    assert.throws(() => {
      pfs.readdir(filePath, {
        sync: true
      });
    });
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.readdir(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
