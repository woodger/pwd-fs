import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { type Iframe, fmock, restore } from './__fmock';
import PoweredFileSystem from '../src';

describe('symlink(src, use [, options])', () => {
  const pfs = new PoweredFileSystem();
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
  
  
  it('Positive: Must be created a symbolic link', async () => {
    await pfs.symlink('./tmpdir/tings.txt', './tmpdir/linkapp');
    
    const stat = fs.lstatSync('./tmpdir/linkapp');
    
    assert(stat.isSymbolicLink());
  });
  
  
  it('Positive: Must be created a symbolic link for directory', async () => {
    await pfs.symlink('./tmpdir/digest', './tmpdir/linkapp');
    
    const stat = fs.lstatSync('./tmpdir/linkapp');
    
    assert(stat.isSymbolicLink());
  });
  
  
  it('Negative: Throw if destination already exists', async () => {
    await expect(async () => {
      await pfs.symlink('./tmpdir/tings.txt', './tmpdir/flexapp');
    })
    .rejects
    .toThrow();
  });
  
  
  it('[sync] Positive: Must be created a symbolic link', () => {
    pfs.symlink('./tmpdir/tings.txt', './tmpdir/linkapp', {
      sync: true
    });

    const stat = fs.lstatSync('./tmpdir/linkapp');
    
    assert(stat.isSymbolicLink());
  });
  
  
  it('[sync] Positive: Must be created a symbolic link for directory', () => {
    pfs.symlink('./tmpdir/digest', './tmpdir/linkapp', {
      sync: true
    });

    const stat = fs.lstatSync('./tmpdir/linkapp');
    
    assert(stat.isSymbolicLink());
  });
  
  it('[sync] Negative: Throw if destination already exists', () => {
    assert.throws(() => {
      pfs.symlink('./tmpdir/tings.txt', './tmpdir/flexapp', {
        sync: true
      });
    });
  });
});
