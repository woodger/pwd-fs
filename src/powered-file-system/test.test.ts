import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies existence and access checks exposed by `test()`.
 */
describe('test(src[, options])', () => {
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
    const resourceName = 'fixture-path';
    const exist = await pfs.test(path.join(tmpDir, resourceName));

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
    const resourceName = 'fixture-path';

    const exist = pfs.test(path.join(tmpDir, resourceName), {
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
