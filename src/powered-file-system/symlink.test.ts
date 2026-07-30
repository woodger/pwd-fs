import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers symlink creation for file and directory targets.
 */
describe('symlink', () => {
  let tmpDir = '';
  
  beforeEach(() => {
    tmpDir = createTmpDir();
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('creates a symbolic link to a file', async () => {
    const targetPath = path.join(tmpDir, 'target.txt');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [targetPath]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    await pfs.symlink(targetPath, linkPath);

    assert(fs.lstatSync(linkPath).isSymbolicLink());
    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(targetPath));
  });

  it('creates a symbolic link to a directory', async () => {
    const targetPath = path.join(tmpDir, 'target');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [targetPath]: { type: 'directory' }
    });

    await pfs.symlink(targetPath, linkPath);

    assert(fs.lstatSync(linkPath).isSymbolicLink());
    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(targetPath));
  });

  it('rejects and preserves the link when destination already exists', async () => {
    const requestedTargetPath = path.join(tmpDir, 'requested.txt');
    const existingTargetPath = path.join(tmpDir, 'existing.txt');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [requestedTargetPath]: {
        type: 'file',
        data: 'requested'
      },
      [existingTargetPath]: {
        type: 'file',
        data: 'existing'
      },
      [linkPath]: {
        type: 'symlink',
        target: existingTargetPath
      }
    });

    await assert.rejects(async () => {
      await pfs.symlink(requestedTargetPath, linkPath);
    });

    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(existingTargetPath));
  });

  it('creates a symbolic link to a file with sync option', () => {
    const targetPath = path.join(tmpDir, 'target.txt');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [targetPath]: {
        type: 'file',
        data: 'fixture content'
      }
    });

    pfs.symlink(targetPath, linkPath, {
      sync: true
    });

    assert(fs.lstatSync(linkPath).isSymbolicLink());
    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(targetPath));
  });

  it('creates a symbolic link to a directory with sync option', () => {
    const targetPath = path.join(tmpDir, 'target');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [targetPath]: { type: 'directory' }
    });

    pfs.symlink(targetPath, linkPath, {
      sync: true
    });

    assert(fs.lstatSync(linkPath).isSymbolicLink());
    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(targetPath));
  });

  it('throws and preserves the link when destination already exists with sync option', () => {
    const requestedTargetPath = path.join(tmpDir, 'requested.txt');
    const existingTargetPath = path.join(tmpDir, 'existing.txt');
    const linkPath = path.join(tmpDir, 'linkapp');
    createFixtureTree({
      [requestedTargetPath]: {
        type: 'file',
        data: 'requested'
      },
      [existingTargetPath]: {
        type: 'file',
        data: 'existing'
      },
      [linkPath]: {
        type: 'symlink',
        target: existingTargetPath
      }
    });

    assert.throws(() => {
      pfs.symlink(requestedTargetPath, linkPath, {
        sync: true
      });
    });

    assert.strictEqual(fs.realpathSync(linkPath), fs.realpathSync(existingTargetPath));
  });
});
