import assert from 'node:assert';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { fmock, restore } from '../test-utils';

describe('read(src [, options])', { concurrency: false }, () => {
  const chance = new Chance();
  let sentences = 0;

  beforeEach(() => {
    const tingsContent = chance.paragraph();
    sentences = tingsContent.length;

    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: tingsContent
      }
    });
  });

  afterEach(() => {
    restore('./tmpdir');
  });

  it('Positive: Must read content of file; String type by default', async () => {
    const { length } = await pfs.read('./tmpdir/tings.txt');

    assert(length === sentences);
  });

  it('Positive: Must read Buffer content of file when encoding is null', async () => {
    const buffer = await pfs.read('./tmpdir/tings.txt', {
      encoding: null
    });

    assert(buffer instanceof Buffer);
  });

  it('Negative: Throw if resource is not file', async () => {
    await assert.rejects(async () => {
      await pfs.read('./tmpdir');
    });
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.read(`./tmpdir/${guid}`);
    });
  });

  it('[sync] Positive: Must read content of file; String type by default', () => {
    const { length } = pfs.read('./tmpdir/tings.txt', {
      sync: true
    });

    assert(length === sentences);
  });

  it('[sync] Positive: Must read Buffer content of file when encoding is null', () => {
    const buf = pfs.read('./tmpdir/tings.txt', {
      sync: true,
      encoding: null
    });

    assert(buf instanceof Buffer);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.read(`./tmpdir/${guid}`, {
        sync: true
      });
    });
  });
});
