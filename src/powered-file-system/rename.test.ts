import assert from 'node:assert';
import fs from 'node:fs';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { fmock, restore } from '../test-utils';

describe('rename(src, use [, options])', () => {
  const chance = new Chance();

  beforeEach(() => {
    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      },
      './tmpdir/digest/': { type: 'directory' }
    });
  });

  afterEach(() => {
    restore('./tmpdir');
  });

  it('Positive: Must be recursive rename file', async () => {
    await pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt');
    const exist = fs.existsSync('./tmpdir/newapp.txt');

    assert(exist);
  });

  it('Positive: Must be recursive rename directory', async () => {
    await pfs.rename('./tmpdir/digest', './tmpdir/newxbase');
    const exist = fs.existsSync('./tmpdir/newxbase');

    assert(exist);
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase');
    });
  });

  it('[sync] Positive: Must be recursive rename file', () => {
    pfs.rename('./tmpdir/tings.txt', './tmpdir/newapp.txt', {
      sync: true
    });

    const exist = fs.existsSync('./tmpdir/newapp.txt');

    assert(exist);
  });

  it('[sync] Positive: Must be recursive rename directory', () => {
    pfs.rename('./tmpdir/digest', './tmpdir/newxbase', {
      sync: true
    });

    const exist = fs.existsSync('./tmpdir/newxbase');

    assert(exist);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.rename(`./tmpdir/${guid}`, './tmpdir/newxbase', {
        sync: true
      });
    });
  });
});
