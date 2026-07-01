import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Validates ownership changes while preserving path validation semantics.
 */
describe('chown(src, [, options])', () => {
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

  it('Positive: Changes the permissions of a file', async () => {
    const filePath = path.join(tmpDir, 'tings.txt');
    const { uid, gid } = fs.statSync(filePath);
    await pfs.chown(filePath, { uid, gid });

    assert(fs.existsSync(filePath));
  });

  it('Positive: Changes the permissions of a directory', async () => {
    const dirPath = path.join(tmpDir, 'digest');
    const { uid, gid } = fs.statSync(dirPath);
    await pfs.chown(dirPath, { uid, gid });

    assert(fs.existsSync(dirPath));
  });

  it('Negative: To a non-existent resource to return an Error', async () => {
    const resourceName = 'fixture-path';
    const { uid, gid } = fs.statSync(path.join(tmpDir, 'tings.txt'));

    await assert.rejects(async () => {
      await pfs.chown(path.join(tmpDir, resourceName), { uid, gid });
    });
  });

  it('[sync] Positive: Changes the permissions of a file', () => {
    const filePath = path.join(tmpDir, 'tings.txt');
    const { uid, gid } = fs.statSync(filePath);

    pfs.chown(filePath, {
      sync: true,
      uid,
      gid
    });

    assert(fs.existsSync(filePath));
  });

  it('[sync] Positive: Changes the permissions of a directory', () => {
    const dirPath = path.join(tmpDir, 'digest');
    const { uid, gid } = fs.statSync(dirPath);

    pfs.chown(dirPath, {
      sync: true,
      uid,
      gid
    });

    assert(fs.existsSync(dirPath));
  });

  it('[sync] Negative: To a non-existent resource to return an Error', () => {
    const resourceName = 'fixture-path';
    const { uid, gid } = fs.statSync(path.join(tmpDir, 'tings.txt'));

    assert.throws(() => {
      pfs.chown(path.join(tmpDir, resourceName), {
        sync: true,
        uid,
        gid
      });
    });
  });
});
