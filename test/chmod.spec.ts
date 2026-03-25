import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { expect } from 'expect';
import { fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('chmod(src, mode [, options])', () => {
  const chance = new Chance();

  beforeEach(() => {
    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      }
    });
  });
  
  afterEach(() => {
    restore('./tmpdir');
  });


  it('Positive: Changes directory and file permissions', async () => {
    await pfs.chmod('./tmpdir', 0o444);

    const writable = pfs.test('./tmpdir/tings.txt', {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });


  it('Negative: Throw if not exists resource', async () => {
    await expect(async () => {
      await pfs.chmod('./non-existent-source', 0o744);
    })
    .rejects
    .toThrow();
  });
  
  
  it(`[sync] Positive: Changes permissions of directory`, () => {
    pfs.chmod('./tmpdir', 0o444, {
      sync: true
    });

    const writable = pfs.test('./tmpdir/tings.txt', {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });


  it(`[sync] Positive: Changes file permissions`, () => {
    pfs.chmod('./tmpdir/tings.txt', 0o444, {
      sync: true
    });

    const writable = pfs.test('./tmpdir/tings.txt', {
      sync: true,
      flag: 'w'
    });

    assert(writable === false);
  });
  
  
  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.chmod(`./${guid}`, 0o744, {
        sync: true
      });
    });
  });
});
