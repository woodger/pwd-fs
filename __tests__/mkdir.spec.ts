import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { fmock, restore } from './__fmock';
import PoweredFileSystem from '../src';

describe('mkdir(src [, options])', () => {
  const pfs = new PoweredFileSystem();
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

  it('Positive: Create directories in the working directory', async () => {
    const guid = chance.guid();
    
    await pfs.mkdir(`./tmpdir/${guid}`);
    const exist = fs.existsSync(`./tmpdir/${guid}`);
    
    assert(exist);
  });
  
  
  it(`Positive: Make current directory`, async () => {
    const guid = chance.guid();
    const pfs = new PoweredFileSystem(`./tmpdir/${guid}`);

    await pfs.mkdir('.');
    const exist = fs.existsSync(`./tmpdir/${guid}`);
    
    assert(exist);
  });
  
  
  it('Positive: Should work fine with the existing directory', async () => {
    const guid = chance.guid();

    for (let i = 2; i; i--) {
      await pfs.mkdir(`./tmpdir/${guid}`);
    }
    
    const exist = fs.existsSync(`./tmpdir/${guid}`);
      
    assert(exist);
  });
  
  
  it('Negative: Throw an exception if trying to create a directory in file', async () => {
    const guid = chance.guid();    
    
    await expect(async () => {
      await pfs.mkdir(`./tmpdir/tings.txt/${guid}`);
    })
    .rejects
    .toThrow();
  });
  
  
  it('Positive: Create directories in the working directory', () => {
    const guid = chance.guid();

    pfs.mkdir(`./tmpdir/${guid}`, {
      sync: true
    });

    const exist = fs.existsSync(`./tmpdir/${guid}`);
    
    assert(exist);
  });
  
  
  it('[sync] Positive: Make current directory', () => {
    const guid = chance.guid();
    const pfs = new PoweredFileSystem(`./tmpdir/${guid}`);

    pfs.mkdir('.', {
      sync: true
    });

    const exist = fs.existsSync(`./tmpdir/${guid}`);
    
    assert(exist);
  });
  
  
  it('[sync] Positive: Should work fine with the existing directory', () => {
    const guid = chance.guid();

    for (let i = 2; i; i--) {
      pfs.mkdir(`./tmpdir/${guid}`, {
        sync: true
      });
    }
    
    const exist = fs.existsSync(`./tmpdir/${guid}`);
    
    assert(exist);
  });
  
  
  it('[sync] Negative: Throw an exception if trying to create a directory in file', () => {
    const guid = chance.guid();
    
    assert.throws(() => {
      pfs.mkdir(`./tmpdir/tings.txt/${guid}`, {
        sync: true
      });
    });
  });
});
