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
  let sentences = 0;
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();
    const tingsContent = chance.paragraph();
    sentences = tingsContent.length;
    
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
    const { length } = await pfs.read(path.join(tmpDir, 'tings.txt'));

    assert(length === sentences);
  });

  it('Positive: Must read Buffer content of file when encoding is null', async () => {
    const buffer = await pfs.read(path.join(tmpDir, 'tings.txt'), {
      encoding: null
    });

    assert(buffer instanceof Buffer);
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
    const { length } = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true
    });

    assert(length === sentences);
  });

  it('[sync] Positive: Must read Buffer content of file when encoding is null', () => {
    const buf = pfs.read(path.join(tmpDir, 'tings.txt'), {
      sync: true,
      encoding: null
    });

    assert(buf instanceof Buffer);
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
