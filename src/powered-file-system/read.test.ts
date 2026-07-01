import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers text and binary reads together with failure cases.
 */
describe('read(src [, options])', () => {
  let tingsContent = '';
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    tingsContent = 'fixture payload';
    
    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: tingsContent
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });
  
  it('Positive: Must read content of file; String type by default', async () => {
    const content = await pfs.read(path.join(tmpDir, 'tings.txt'));

    assert.strictEqual(content, tingsContent);
  });

  it('Positive: Must read Buffer content of file when encoding is null', async () => {
    const buffer = await pfs.read(path.join(tmpDir, 'tings.txt'), {
      encoding: null
    });

    assert(buffer instanceof Buffer);
    assert.strictEqual(buffer.toString('utf8'), tingsContent);
  });

  it('Negative: Throw if resource is not file', async () => {
    await assert.rejects(async () => {
      await pfs.read(tmpDir);
    });
  });

  it('Negative: Throw if not exists resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.read(path.join(tmpDir, resourceName));
    });
  });

  it('[sync] Positive: Must read content of file; String type by default', () => {
    const content = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert.strictEqual(content, tingsContent);
  });

  it('[sync] Positive: Must read Buffer content of file when encoding is null', () => {
    const buf = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      encoding: null
    });

    assert(buf instanceof Buffer);
    assert.strictEqual(buf.toString('utf8'), tingsContent);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.read(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
