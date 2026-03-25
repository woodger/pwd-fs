import assert from 'node:assert';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { Iframe, createTmpDir, fmock, restore } from '../test-utils';

/**
 * Verifies directory listing behavior and invalid-target failures.
 */
describe('readdir(src[, options])', () => {
  const chance = new Chance();
  let counter = 0;
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    const frame: Iframe = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      }
    };

    counter = chance.natural({ max: 7 });
    
    for (let i = 0; i < counter; i++) {
      frame[path.join(tmpDir, String(i))] = { type: 'directory' };
    }

    fmock(frame);
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Must return a directory listing', async () => {
    const { length } = await pfs.readdir(tmpDir);

    assert(counter + 1 === length);
  });

  it('Negative: Throw if resource is not directory', async () => {
    await assert.rejects(async () => {
      await pfs.readdir(path.join(tmpDir, 'tings.txt'));
    });
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.readdir(path.join(tmpDir, guid));
    });
  });

  it('[sync] Positive: Must return a directory listing', () => {
    const { length } = pfs.readdir(tmpDir, {
      sync: true
    });

    assert(counter + 1 === length);
  });

  it('Negative: Throw if resource is not directory', () => {
    assert.throws(() => {
      pfs.readdir(path.join(tmpDir, 'tings.txt'), {
        sync: true
      });
    });
  });

  it('Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.readdir(path.join(tmpDir, guid), {
        sync: true
      });
    });
  });
});
