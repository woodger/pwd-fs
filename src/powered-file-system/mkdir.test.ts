import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PoweredFileSystem } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies recursive directory creation for absolute and instance-relative roots.
 */
describe('mkdir', () => {
  let tmpDir = '';
  let pfs = new PoweredFileSystem();

  beforeEach(() => {
    tmpDir = createTmpDir();
    pfs = new PoweredFileSystem();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('creates directories in the working directory', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    
    await pfs.mkdir(target);
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('creates the current directory', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    const nextPfs = new PoweredFileSystem(target);

    await nextPfs.mkdir('.');
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('succeeds when the directory already exists', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);

    for (let i = 2; i; i--) {
      await pfs.mkdir(target);
    }
    
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('rejects when creating a directory below a file', async () => {
    const resourceName = 'fixture-path';
    
    await assert.rejects(async () => {
      await pfs.mkdir(path.join(tmpDir, 'tings.txt', resourceName));
    });
  });

  it('creates directories in the working directory with sync option', () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);

    pfs.mkdir(target, {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('creates the current directory with sync option', () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    const nextPfs = new PoweredFileSystem(target);

    nextPfs.mkdir('.', {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('succeeds when the directory already exists with sync option', () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);

    for (let i = 2; i; i--) {
      pfs.mkdir(target, {
        sync: true
      });
    }
    
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('throws when creating a directory below a file with sync option', () => {
    const resourceName = 'fixture-path';
    
    assert.throws(() => {
      pfs.mkdir(path.join(tmpDir, 'tings.txt', resourceName), {
        sync: true
      });
    });
  });

  it('creates the target directory for an absolute pwd with sync option', () => {
    const parentDir = createTmpDir();
    const target = path.join(parentDir, 'fixture-path');
    const nextPfs = new PoweredFileSystem(target);

    try {
      nextPfs.mkdir('.', {
        sync: true
      });

      assert(fs.existsSync(target));
    }
    finally {
      removeFixtureTree(parentDir);
    }
  });
});
