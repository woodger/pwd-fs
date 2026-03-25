import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { expect } from 'expect';
import { Iframe, fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('remove(src [, options])', () => {
  const chance = new Chance();
  
  beforeEach(() => {
    const cwd = process.cwd();
    
    const frame: Iframe = {
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      },
      './tmpdir/digest/': { type: 'directory' },
      './tmpdir/flexapp': {
        type: 'symlink',
        target: `${cwd}/tmpdir/tings.txt`
      },
      './tmpdir/digest-link': {
        type: 'symlink',
        target: `${cwd}/tmpdir/digest`
      }
    };
    
    const counter = chance.natural({ max: 7 });
    
    for (let i = 0; i < counter; i++) {
      frame[`./tmpdir/${i}`] = { type: 'directory' };
    }
    
    fmock(frame);
  });
  
  afterEach(() => {
    restore('./tmpdir');
  });
  
  
  it('Positive: Removal a directory with a file', async () => {
    await pfs.remove('./tmpdir');
    const exist = fs.existsSync(`./tmpdir`);
    
    assert(exist === false);
  });
  
  
  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();
    
    await expect(async () => {
      await pfs.remove(`./${guid}`);
    })
    .rejects
    .toThrow();
  }); 
  
  
  it('[sync] Positive: Removal a directory with a file', () => {
    pfs.remove('./tmpdir', {
      sync: true
    });

    const exist = fs.existsSync(`./tmpdir`);
    
    assert(exist === false);
  });
  
  
  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.remove(`./tmpdir/${guid}`, {
        sync: true
      });
    });
  });


  it('[sync] Positive: Removing a symlink to a directory should remove only the link', () => {
    pfs.remove('./tmpdir/digest-link', {
      sync: true
    });

    assert(fs.existsSync('./tmpdir/digest-link') === false);
    assert(fs.existsSync('./tmpdir/digest'));
  });
});
