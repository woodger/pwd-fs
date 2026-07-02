import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies existence and access checks exposed by `test()`.
 */
describe('test', () => {
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

  it(`returns true for the current working directory`, async () => {
    const exist = await pfs.test('.');

    assert(exist);
  });

  it(`returns true for an existing file`, async () => {
    const exist = await pfs.test(path.join(tmpDir, 'tings.txt'));

    assert(exist);
  });

  it(`returns true for an existing directory`, async () => {
    const exist = await pfs.test(path.join(tmpDir, 'digest'));

    assert(exist);
  });

  it(`returns false for a missing file`, async () => {
    const resourceName = 'fixture-path';
    const exist = await pfs.test(path.join(tmpDir, resourceName));

    assert(exist === false);
  });

  it('returns true for an existing file with sync option', () => {
    const exist = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert(exist);
  });

  it('returns true for an existing directory with sync option', () => {
    const exist = pfs.test(path.join(tmpDir, 'digest'), {
      sync: true
    });

    assert(exist);
  });

  it('returns false for a missing file with sync option', () => {
    const resourceName = 'fixture-path';

    const exist = pfs.test(path.join(tmpDir, resourceName), {
      sync: true
    });

    assert(exist === false);
  });

  it('uses the requested access flag with sync option', () => {
    const readable = pfs.test(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      flag: 'r'
    });

    assert(readable);
  });
});
