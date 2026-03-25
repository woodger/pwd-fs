import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

describe('copy(src, dir [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' }
    });
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Copying a item file', async () => {
    await pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'));
    const exist = fs.existsSync(path.join(tmpDir, 'digest', 'tings.txt'));

    assert(exist);
  });

  it('Positive: Recursive copying a directory', async () => {
    await pfs.copy(path.resolve('./src'), tmpDir);
    const exist = fs.existsSync(path.join(tmpDir, 'src'));

    assert(exist);
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();
    
    await assert.rejects(async () => {
      await pfs.copy(path.join(tmpDir, guid), tmpDir);
    });
  });

  it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
    await assert.rejects(async () => {
      await pfs.copy(tmpDir, path.dirname(tmpDir));
    });
  });

  it('[sync] Positive: Copying a file', () => {
    pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'digest', 'tings.txt'));

    assert(exist);
  });

  it('[sync] Positive: Recursive copying a directory', () => {
    pfs.copy(path.resolve('./src'), tmpDir, {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'src'));

    assert(exist);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.copy(path.join(tmpDir, guid), tmpDir, {
        sync: true
      });
    });
  });

  it('[sync] Negative: An attempt to copy to an existing resource should return an Error', () => {
    assert.throws(() => {
      pfs.copy(tmpDir, path.dirname(tmpDir), {
        sync: true
      });
    });
  });
});
