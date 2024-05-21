import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { fmock, restore } from './__fmock';
import PoweredFileSystem from '../src';

describe('test(src[, options])', () => {
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
  

  it(`Positive: Should return 'true' for current working directory`, async () => {
    const exist = await pfs.test('.');
    
    assert(exist);
  });
  
  
  it(`Positive: For existing file should return 'true'`, async () => {
    const exist = await pfs.test('./tmpdir/tings.txt');
    
    assert(exist);
  });
  
  
  it(`Positive: For existing directory should return 'true'`, async () =>  {
    const exist = await pfs.test('./tmpdir/digest');
    
    assert(exist);
  });
  
  
  it(`Positive: A non-existent file must return 'false'`, async () => {
    const guid = chance.guid();
    const exist = await pfs.test(`./tmpdir/${guid}`);

    assert(exist === false);
  });
  
  
  it(`Positive: For existing file should return 'true'`, () =>  {
    const exist = pfs.test('./tmpdir/tings.txt', {
      sync: true
    });

    assert(exist);
  });
  
  
  it(`[sync] Positive: For existing directory should return 'true'`, () =>  {
    const exist = pfs.test('./tmpdir/digest', {
      sync: true
    });

    assert(exist);
  });

  
  it(`[sync] Positive: A non-existent file must return 'false'`, () => {
    const guid = chance.guid();
    
    const exist = pfs.test(`./tmpdir/${guid}`, {
      sync: true
    });

    assert(exist === false);
  });
});
