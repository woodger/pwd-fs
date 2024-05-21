import assert from 'node:assert';
import { sep } from 'node:path';
import fs from 'node:fs';
import Chance  from 'chance';
import { fmock, restore } from './__fmock';
import PoweredFileSystem, { bitmask } from '../src';

describe('copy(src, dir [, options])', () => {
  const pfs = new PoweredFileSystem();
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

  it('Positive: Copying a item file', async () => {
    await pfs.copy('./tmpdir/tings.txt', './tmpdir/digest');
    const exist = fs.existsSync(`./tmpdir/digest/tings.txt`);
    
    assert(exist);
  });
  

  it('Positive: Recursive copying a directory', async () => {
    await pfs.copy('./src', './tmpdir');
    const exist = fs.existsSync(`./tmpdir/src`);
    
    assert(exist);
  });

  
  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();
    
    await expect(async () => {
      await pfs.copy(`./${guid}`, '.');
    })
    .rejects
    .toThrow();
  });
  
  
  it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
    await expect(async () => {
      await pfs.copy('./tmpdir', '.');
    })
    .rejects
    .toThrow();
  });
  
  
  it('[sync] Positive: Copying a file', () => {
    pfs.copy('./tmpdir/tings.txt', './tmpdir/digest', {
      sync: true
    });

    const exist = fs.existsSync(`./tmpdir/digest/tings.txt`);
    
    assert(exist);
  });
  
  
  it('[sync] Positive: Recursive copying a directory', () => {
    pfs.copy('./src', './tmpdir', {
      sync: true
    });

    const exist = fs.existsSync(`./tmpdir/src`);
    
    assert(exist);
  });
  
  
  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.copy(`./${guid}`, '.', {
        sync: true
      });
    });
  });
  
  
  it('[sync] Negative: An attempt to copy to an existing resource should return an Error', () => {
    assert.throws(() => {
      pfs.copy('./tmpdir', '.', {
        sync: true
      });
    });
  });
});