import assert from 'node:assert';
import fs from 'node:fs';
import Chance  from 'chance';
import { expect } from 'expect';
import { fmock, restore } from './__fmock';
import { pfs } from '../src';

describe('chown(src, [, options])', () => {
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
  
  
  it('Positive: Changes the permissions of a file', async () => {
    const { uid, gid } = fs.statSync('./tmpdir/tings.txt');
    await pfs.chown('./tmpdir/tings.txt', { uid, gid });

    assert(uid && gid);
  });
  
  
  it('Positive: Changes the permissions of a directory', async () => {
    const { uid, gid } = fs.statSync('./tmpdir/digest');
    await pfs.chown('./tmpdir/digest', { uid, gid });

    assert(uid && gid);
  });
  
  
  it('Negative: To a non-existent resource to return an Error', async () => {
    const guid = chance.guid();
    const { uid, gid } = fs.statSync('./tmpdir/tings.txt');
    
    await expect(async () => {
      await pfs.chown(`./tmpdir/${guid}`, { uid, gid });
    })
    .rejects
    .toThrow();
  });
  
  
  it('[sync] Positive: Changes the permissions of a file', () => {
    const { uid, gid } = fs.statSync('./tmpdir/tings.txt');

    pfs.chown('./tmpdir/tings.txt', {
      sync: true,
      uid,
      gid
    });

    assert(uid && gid);
  });
  
  
  it('[sync] Positive: Changes the permissions of a directory', () => {
    const { uid, gid } = fs.statSync('./tmpdir/digest');

    pfs.chown('./tmpdir/digest', {
      sync: true,
      uid,
      gid
    });

    assert(uid && gid);
  });
  
  
  it('[sync] Negative: To a non-existent resource to return an Error', () => {
    const guid = chance.guid();
    const { uid, gid } = fs.statSync('./tmpdir/tings.txt');
    
    assert.throws(() => {
      pfs.chown(`./tmpdir/${guid}`, {
        sync: true,
        uid,
        gid
      });
    });
  });
});
