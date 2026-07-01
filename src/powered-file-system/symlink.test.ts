import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { FixtureTree, createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers symlink creation for file and directory targets.
 */
describe('symlink(src, use [, options])', () => {
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

  it('Positive: Must be created a symbolic link', async () => {
    await pfs.symlink(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'linkapp'));
    
    const stat = fs.lstatSync(path.join(tmpDir, 'linkapp'));

    assert(stat.isSymbolicLink());
  });

  it('Positive: Must be created a symbolic link for directory', async () => {
    await pfs.symlink(path.join(tmpDir, 'digest'), path.join(tmpDir, 'linkapp'));
    
    const stat = fs.lstatSync(path.join(tmpDir, 'linkapp'));

    assert(stat.isSymbolicLink());
  });

  it('Negative: Throw if destination already exists', async () => {
    await assert.rejects(async () => {
      await pfs.symlink(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'flexapp'));
    });
  });

  it('[sync] Positive: Must be created a symbolic link', () => {
    pfs.symlink(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'linkapp'), {
      sync: true
    });

    const stat = fs.lstatSync(path.join(tmpDir, 'linkapp'));

    assert(stat.isSymbolicLink());
  });

  it('[sync] Positive: Must be created a symbolic link for directory', () => {
    pfs.symlink(path.join(tmpDir, 'digest'), path.join(tmpDir, 'linkapp'), {
      sync: true
    });

    const stat = fs.lstatSync(path.join(tmpDir, 'linkapp'));

    assert(stat.isSymbolicLink());
  });

  it('[sync] Negative: Throw if destination already exists', () => {
    assert.throws(() => {
      pfs.symlink(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'flexapp'), {
        sync: true
      });
    });
  });
});
