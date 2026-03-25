import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PoweredFileSystem } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

describe('mkdir(src [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';
  let pfs = new PoweredFileSystem();

  beforeEach(() => {
    tmpDir = createTmpDir();
    pfs = new PoweredFileSystem();

    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      }
    });
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Create directories in the working directory', async () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);
    
    await pfs.mkdir(target);
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Positive: Make current directory', async () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);
    const nextPfs = new PoweredFileSystem(target);

    await nextPfs.mkdir('.');
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Positive: Should work fine with the existing directory', async () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);

    for (let i = 2; i; i--) {
      await pfs.mkdir(target);
    }
    
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('Negative: Throw an exception if trying to create a directory in file', async () => {
    const guid = chance.guid();
    
    await assert.rejects(async () => {
      await pfs.mkdir(path.join(tmpDir, 'tings.txt', guid));
    });
  });

  it('[sync] Positive: Create directories in the working directory', () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);

    pfs.mkdir(target, {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('[sync] Positive: Make current directory', () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);
    const nextPfs = new PoweredFileSystem(target);

    nextPfs.mkdir('.', {
      sync: true
    });

    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('[sync] Positive: Should work fine with the existing directory', () => {
    const guid = chance.guid();
    const target = path.join(tmpDir, guid);

    for (let i = 2; i; i--) {
      pfs.mkdir(target, {
        sync: true
      });
    }
    
    const exist = fs.existsSync(target);

    assert(exist);
  });

  it('[sync] Negative: Throw an exception if trying to create a directory in file', () => {
    const guid = chance.guid();
    
    assert.throws(() => {
      pfs.mkdir(path.join(tmpDir, 'tings.txt', guid), {
        sync: true
      });
    });
  });

  it('[sync] Positive: Absolute pwd should create the target directory itself', () => {
    const guid = chance.guid();
    const target = path.join(os.tmpdir(), guid);
    const nextPfs = new PoweredFileSystem(target);

    try {
      nextPfs.mkdir('.', {
        sync: true
      });

      assert(fs.existsSync(target));
    }
    finally {
      fs.rmSync(target, { recursive: true, force: true });
    }
  });
});
