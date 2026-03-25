import assert from 'node:assert';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

describe('stat(src [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    
    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' },
      [path.join(tmpDir, 'flexapp')]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      }
    });
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Must return information a file', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'tings.txt'));

    assert(stats.isFile());
  });

  it('Positive: Must return information a directory', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'digest'));

    assert(stats.isDirectory());
  });

  it('Positive: Must return information a symlink', async () => {
    const stats = await pfs.stat(path.join(tmpDir, 'flexapp'));

    assert(stats.isSymbolicLink());
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.stat(path.join(tmpDir, guid));
    });
  });

  it('[sync] Positive: Must return information a file', () => {
    const stats = pfs.stat(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert(stats.isFile());
  });

  it('[sync] Positive: Must return information a directory in ', () => {
    const stats = pfs.stat(path.join(tmpDir, 'digest'), {
      sync: true
    });

    assert(stats.isDirectory());
  });

  it('[sync] Positive: Must return information a symlink', () => {
    const stats = pfs.stat(path.join(tmpDir, 'flexapp'), {
      sync: true
    });

    assert(stats.isSymbolicLink());
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.stat(path.join(tmpDir, guid), {
        sync: true
      });
    });
  });
});
