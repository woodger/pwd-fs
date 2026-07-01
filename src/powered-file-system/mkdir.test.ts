import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PoweredFileSystem } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies recursive directory creation for absolute and instance-relative roots.
 */
describe('mkdir(src [, options])', () => {
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

  it('Positive: Create directories in the working directory', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    
    await pfs.mkdir(target);
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Positive: Make current directory', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    const nextPfs = new PoweredFileSystem(target);

    await nextPfs.mkdir('.');
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Positive: Should work fine with the existing directory', async () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);

    for (let i = 2; i; i--) {
      await pfs.mkdir(target);
    }
    
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Negative: Throw an exception if trying to create a directory in file', async () => {
    const resourceName = 'fixture-path';
    
    await assert.rejects(async () => {
      await pfs.mkdir(path.join(tmpDir, 'tings.txt', resourceName));
    });
  });

  it('[sync] Positive: Create directories in the working directory', () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);

    pfs.mkdir(target, {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('[sync] Positive: Make current directory', () => {
    const resourceName = 'fixture-path';
    const target = path.join(tmpDir, resourceName);
    const nextPfs = new PoweredFileSystem(target);

    nextPfs.mkdir('.', {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('[sync] Positive: Should work fine with the existing directory', () => {
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

  it('[sync] Negative: Throw an exception if trying to create a directory in file', () => {
    const resourceName = 'fixture-path';
    
    assert.throws(() => {
      pfs.mkdir(path.join(tmpDir, 'tings.txt', resourceName), {
        sync: true
      });
    });
  });

  it('[sync] Positive: Absolute pwd should create the target directory itself', () => {
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
