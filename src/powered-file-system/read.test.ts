import assert from 'node:assert';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

/**
 * Covers text and binary reads together with failure cases.
 */
describe('read(src [, options])', () => {
  const chance = new Chance();
  let tingsContent = '';
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    tingsContent = chance.paragraph();
    
    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: tingsContent
      }
    });
  });

  afterEach(() => {
    restore(tmpDir);
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
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.read(path.join(tmpDir, guid));
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
    const guid = chance.guid();

    assert.throws(() => {
      pfs.read(path.join(tmpDir, guid), {
        sync: true
      });
    });
  });
});
