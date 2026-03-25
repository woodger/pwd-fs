import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { Iframe, createTmpDir, fmock, restore } from '../test-utils';

/**
 * Verifies directory cleanup while preserving the directory itself.
 */
describe('emptyDir(src [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    const frame: Iframe = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' },
      [path.join(tmpDir, 'digest', 'nested.txt')]: {
        type: 'file',
        data: chance.string()
      }
    };

    fmock(frame);
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Removes all directory contents but preserves the directory', async () => {
    await pfs.emptyDir(tmpDir);

    assert(fs.existsSync(tmpDir));
    assert.deepStrictEqual(fs.readdirSync(tmpDir), []);
  });

  it('Negative: Throw if resource is not directory', async () => {
    await assert.rejects(async () => {
      await pfs.emptyDir(path.join(tmpDir, 'tings.txt'));
    });
  });

  it('[sync] Positive: Removes all directory contents but preserves the directory', () => {
    pfs.emptyDir(tmpDir, {
      sync: true
    });

    assert(fs.existsSync(tmpDir));
    assert.deepStrictEqual(fs.readdirSync(tmpDir), []);
  });

  it('[sync] Negative: Throw if resource is not directory', () => {
    assert.throws(() => {
      pfs.emptyDir(path.join(tmpDir, 'tings.txt'), {
        sync: true
      });
    });
  });
});
