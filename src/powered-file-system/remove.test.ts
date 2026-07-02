import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { FixtureTree, createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers recursive removal, including the symlink edge case.
 */
describe('remove', () => {
  let tmpDir = '';
  
  beforeEach(() => {
    tmpDir = createTmpDir();
    
    const frame: FixtureTree = {
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
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

    const counter = 3;
    
    for (let i = 0; i < counter; i++) {
      frame[path.join(tmpDir, String(i))] = { type: 'directory' };
    }

    createFixtureTree(frame);
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('removes a directory with its contents', async () => {
    await pfs.remove(tmpDir);
    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.remove(path.join(tmpDir, resourceName));
    });
  }); 

  it('removes a directory with its contents with sync option', () => {
    pfs.remove(tmpDir, {
      sync: true
    });

    const exist = fs.existsSync(tmpDir);

    assert(exist === false);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.remove(path.join(tmpDir, resourceName), {
        sync: true
      });
    });
  });

  it('removes only the link for a symlink to a directory with sync option', () => {
    pfs.remove(path.join(tmpDir, 'digest-link'), {
      sync: true
    });

    assert(fs.existsSync(path.join(tmpDir, 'digest-link')) === false);
    assert(fs.existsSync(path.join(tmpDir, 'digest')));
  });
});
