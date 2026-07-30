import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Verifies move semantics for both files and directories.
 */
describe('rename', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      },
      [path.join(tmpDir, 'digest')]: { type: 'directory' }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('renames a file', async () => {
    const sourcePath = path.join(tmpDir, 'tings.txt');
    const destinationPath = path.join(tmpDir, 'newapp.txt');

    await pfs.rename(sourcePath, destinationPath);

    assert.strictEqual(fs.readFileSync(destinationPath, 'utf8'), 'fixture content');
    assert.strictEqual(fs.existsSync(sourcePath), false);
  });

  it('renames a directory', async () => {
    const sourcePath = path.join(tmpDir, 'digest');
    const destinationPath = path.join(tmpDir, 'newxbase');

    await pfs.rename(sourcePath, destinationPath);

    assert(fs.statSync(destinationPath).isDirectory());
    assert.strictEqual(fs.existsSync(sourcePath), false);
  });

  it('rejects for a missing resource', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'));
    });
  });

  it('renames a file with sync option', () => {
    const sourcePath = path.join(tmpDir, 'tings.txt');
    const destinationPath = path.join(tmpDir, 'newapp.txt');

    pfs.rename(sourcePath, destinationPath, {
      sync: true
    });

    assert.strictEqual(fs.readFileSync(destinationPath, 'utf8'), 'fixture content');
    assert.strictEqual(fs.existsSync(sourcePath), false);
  });

  it('renames a directory with sync option', () => {
    const sourcePath = path.join(tmpDir, 'digest');
    const destinationPath = path.join(tmpDir, 'newxbase');

    pfs.rename(sourcePath, destinationPath, {
      sync: true
    });

    assert(fs.statSync(destinationPath).isDirectory());
    assert.strictEqual(fs.existsSync(sourcePath), false);
  });

  it('throws for a missing resource with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.rename(path.join(tmpDir, resourceName), path.join(tmpDir, 'newxbase'), {
        sync: true
      });
    });
  });
});
