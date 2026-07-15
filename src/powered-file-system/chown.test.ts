import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Validates ownership preservation while keeping path validation semantics.
 */
describe('chown', () => {
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

  it('preserves file owner and group when options are omitted', async () => {
    const filePath = path.join(tmpDir, 'tings.txt');
    const before = fs.statSync(filePath);

    await pfs.chown(filePath);

    const after = fs.statSync(filePath);
    assert.strictEqual(after.uid, before.uid);
    assert.strictEqual(after.gid, before.gid);
  });

  it('preserves directory owner and group when options are omitted', async () => {
    const dirPath = path.join(tmpDir, 'digest');
    const before = fs.statSync(dirPath);

    await pfs.chown(dirPath);

    const after = fs.statSync(dirPath);
    assert.strictEqual(after.uid, before.uid);
    assert.strictEqual(after.gid, before.gid);
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.chown(path.join(tmpDir, resourceName));
    });
  });

  it('preserves file owner and group when uid and gid are omitted with sync option', () => {
    const filePath = path.join(tmpDir, 'tings.txt');
    const before = fs.statSync(filePath);

    pfs.chown(filePath, {
      sync: true
    });

    const after = fs.statSync(filePath);
    assert.strictEqual(after.uid, before.uid);
    assert.strictEqual(after.gid, before.gid);
  });

  it('preserves directory owner and group when uid and gid are omitted with sync option', () => {
    const dirPath = path.join(tmpDir, 'digest');
    const before = fs.statSync(dirPath);

    pfs.chown(dirPath, {
      sync: true
    });

    const after = fs.statSync(dirPath);
    assert.strictEqual(after.uid, before.uid);
    assert.strictEqual(after.gid, before.gid);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.chown(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
