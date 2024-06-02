import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { expect } from 'expect';
import { fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('append(src, data [, options])', () => {
  const chance = new Chance();

  beforeEach(() => {
    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: 'hoodie'
      }
    });
  });
  
  afterEach(() => {
    restore('./tmpdir');
  });


  it('Positive: Must append content to file', async () => {
    const payload = chance.paragraph();

    await pfs.append('./tmpdir/tings.txt', payload);
    const { size } = fs.statSync('./tmpdir/tings.txt');

    assert(payload.length + 6 === size);
  });


  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const payload = chance.paragraph();
    
    await expect(async () => {
      await pfs.append('./tmpdir/tings.txt', payload, {
        flag: 'r'
      });
    })
    .rejects
    .toThrow();
  });
  
  
  it(`[sync] Positive: Must append content to file`, () => {
    const payload = chance.paragraph();

    pfs.append('./tmpdir/tings.txt', payload, {
      sync: true
    });

    const { size } = fs.statSync('./tmpdir/tings.txt');

    assert(payload.length + 6 === size);
  });
  
  
  it(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
    const payload = chance.paragraph();
    
    assert.throws(() => {
      pfs.append('./tmpdir/tings.txt', payload, {
        sync: true,
        flag: 'r'
      });
    });
  });
});
