import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { Iframe, createTmpDir, fmock, restore } from '../test-utils';

/**
 * Covers recursive removal, including the symlink edge case.
 */
describe('remove(src [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';
  
  beforeEach(() => {
    tmpDir = createTmpDir();
    
    const frame: Iframe = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' },
      [path.join(tmpDir, 'flexapp')]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      },
      [path.join(tmpDir, 'digest-link')]: {
        type: 'symlink',
        target: path.join(tmpDir, 'digest')
      }
    };

    const counter = chance.natural({ max: 7 });
    
    for (let i = 0; i < counter; i++) {
      frame[path.join(tmpDir, String(i))] = { type: 'directory' };
    }

    fmock(frame);
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Removal a directory with a file', async () => {
    await pfs.remove(tmpDir);
    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('Negative: Throw if not exists resource', async () => {
    const guid = chance.guid();

    await assert.rejects(async () => {
      await pfs.remove(path.join(tmpDir, guid));
    });
  }); 

  it('[sync] Positive: Removal a directory with a file', () => {
    pfs.remove(tmpDir, {
      sync: true
    });

    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('[sync] Negative: Throw if not exists resource', () => {
    const guid = chance.guid();

    assert.throws(() => {
      pfs.remove(path.join(tmpDir, guid), {
        sync: true
      });
    });
  });

  it('[sync] Positive: Removing a symlink to a directory should remove only the link', () => {
    pfs.remove(path.join(tmpDir, 'digest-link'), {
      sync: true
    });

    assert(fs.existsSync(path.join(tmpDir, 'digest-link')) === false);
    assert(fs.existsSync(path.join(tmpDir, 'digest')));
  });
});
