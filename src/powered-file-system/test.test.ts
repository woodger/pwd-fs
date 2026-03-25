import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

describe('test(src[, options])', () => {
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

  it(`Positive: Should return 'true' for current working directory`, async () => {
    const exist = await pfs.test('.');

    assert(exist);
  });

  it(`Positive: For existing file should return 'true'`, async () => {
    const exist = await pfs.test(path.join(tmpDir, 'tings.txt'));

    assert(exist);
  });

  it(`Positive: For existing directory should return 'true'`, async () => {
    const exist = await pfs.test(path.join(tmpDir, 'digest'));

    assert(exist);
  });

  it(`Positive: A non-existent file must return 'false'`, async () => {
    const guid = chance.guid();
    const exist = await pfs.test(path.join(tmpDir, guid));

    assert(exist === false);
  });

  it(`Positive: For existing file should return 'true'`, () => {
    const exist = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert(exist);
  });

  it(`[sync] Positive: For existing directory should return 'true'`, () => {
    const exist = pfs.test(path.join(tmpDir, 'digest'), {
      sync: true
    });

    assert(exist);
  });

  it(`[sync] Positive: A non-existent file must return 'false'`, () => {
    const guid = chance.guid();

    const exist = pfs.test(path.join(tmpDir, guid), {
      sync: true
    });

    assert(exist === false);
  });

  it('[sync] Positive: Should respect access flag checks', () => {
    fs.chmodSync(path.join(tmpDir, 'tings.txt'), 0o444);

    const writable = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });
});
