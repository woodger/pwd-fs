import assert from 'node:assert';
import Chance  from 'chance';
import { expect } from 'expect';
import { Iframe, fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('readdir(src[, options])', () => {
  const chance = new Chance();
  let counter = 0;

  beforeEach(() => {
    const frame: Iframe = {
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      }
    };
    
    counter = chance.natural({ max: 7 });
    
    for (let i = 0; i < counter; i++) {
      frame[`./tmpdir/${i}`] = { type: 'directory' };
    }
    
    fmock(frame);
  });
  
  afterEach(() => {
    restore('./tmpdir');
  });

  it('Positive: Must return a directory listing', async () => {
    const { length } = await pfs.readdir('./tmpdir');

    assert(counter + 1 === length);
  });
  
  
  it('Negative: Throw if resource is not directory', async () => {
    await expect(async () => {
      await pfs.readdir(`./tmpdir/tings.txt`);
    })
    .rejects
    .toThrow();
  });
  
  
  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();
    
    await expect(async () => {
      await pfs.readdir(`./tmpdir/${guid}`);
    })
    .rejects
    .toThrow();
  });
  
  
  it('[sync] Positive: Must return a directory listing', () => {
    const { length } = pfs.readdir('./tmpdir', {
      sync: true
    });

    assert(counter + 1 === length);
  });
  
  
  it('Negative: Throw if resource is not directory', () => {
    assert.throws(() => {
      pfs.readdir(`./tmpdir/tings.txt`, {
        sync: true
      });
    });
  });
  
  
  it(`Negative: Throw if not exists resource`, () => {
    const guid = chance.guid();
    
    assert.throws(() => {
      pfs.readdir(`./tmpdir/${guid}`, {
        sync: true
      });
    });
  });
});
