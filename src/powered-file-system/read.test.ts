import assert from 'node:assert';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers text and binary reads together with failure cases.
 */
describe('read', () => {
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
  
  it('reads file content as a string by default', async () => {
    const content = await pfs.read(path.join(tmpDir, 'tings.txt'));

    assert.strictEqual(content, tingsContent);
  });

  it('reads file content as a buffer when encoding is null', async () => {
    const buffer = await pfs.read(path.join(tmpDir, 'tings.txt'), {
      encoding: null
    });

    assert(buffer instanceof Buffer);
    assert.strictEqual(buffer.toString('utf8'), tingsContent);
  });

  it('rejects when resource is not a file', async () => {
    await assert.rejects(async () => {
      await pfs.read(tmpDir);
    });
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.read(path.join(tmpDir, resourceName));
    });
  });

  it('reads file content as a string by default with sync option', () => {
    const content = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert.strictEqual(content, tingsContent);
  });

  it('reads file content as a buffer when encoding is null with sync option', () => {
    const buf = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      encoding: null
    });

    assert(buf instanceof Buffer);
    assert.strictEqual(buf.toString('utf8'), tingsContent);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.read(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });
});
