import assert from 'node:assert';
import Chance  from 'chance';
import { expect } from 'expect';
import { fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('stat(src [, options])', () => {
  const chance = new Chance();

  beforeEach(() => {
    const cwd = process.cwd();
    
    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      },
      './tmpdir/digest/': { type: 'directory' },
      './tmpdir/flexapp': {
        type: 'symlink',
        target: `${cwd}/tmpdir/tings.txt`
      }
    });
  });
  
  afterEach(() => {
    restore('./tmpdir');
  });


  it('Positive: Must return information a file', async () => {
    const stats = await pfs.stat('./tmpdir/tings.txt');
    
    assert(stats.isFile());
  });
  
  
  it('Positive: Must return information a directory', async () => {
    const stats = await pfs.stat('./tmpdir/digest');
    
    assert(stats.isDirectory());
  });
  
  
  it('Positive: Must return information a symlink', async () => {
    const stats = await pfs.stat('./tmpdir/flexapp');
    
    assert(stats.isSymbolicLink());
  });
  
  
  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await expect(async () => {
      await pfs.stat(`./tmpdir/${guid}`);
    })
    .rejects
    .toThrow();
  });
  
  
  it('[sync] Positive: Must return information a file', () => {
    const stats = pfs.stat('./tmpdir/tings.txt', {
      sync: true
    });

    assert(stats.isFile());
  });
  
  
  it('[sync] Positive: Must return information a directory in ', () => {
    const stats = pfs.stat('./tmpdir/digest', {
      sync: true
    });

    assert(stats.isDirectory());
  });
  
  
  it('[sync] Positive: Must return information a symlink', () => {
    const stats = pfs.stat('./tmpdir/flexapp', {
      sync: true
    });

    assert(stats.isSymbolicLink());
  });
  
  
  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();
    
    assert.throws(() => {
      pfs.stat(`./tmpdir/${guid}`, {
        sync: true
      });
    });
  });
});
