import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { FixtureTree, createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies directory listing behavior and invalid-target failures.
 */
describe('readdir(src[, options])', () => {
  let counter = 0;
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    const frame: FixtureTree = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    };

    counter = 3;
    
    for (let i = 0; i < counter; i++) {
      frame[path.join(tmpDir, String(i))] = { type: 'directory' };
    }

    createFixtureTree(frame);
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
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
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.readdir(path.join(tmpDir, resourceName));
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
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.readdir(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
