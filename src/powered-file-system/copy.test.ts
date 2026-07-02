import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers file and directory copy behavior, including collision handling.
 */
describe('copy', () => {
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

  it('copies a file into the target directory', async () => {
    await pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'));
    const exist = fs.existsSync(path.join(tmpDir, 'digest', 'tings.txt'));

    assert(exist);
  });

  it('copies a directory recursively', async () => {
    const sourceDir = path.join(tmpDir, 'source-tree');
    const targetDir = path.join(tmpDir, 'target');

    createFixtureTree({
      [path.join(sourceDir, 'nested', 'entry.txt')]: {
        type: 'file',
        data: 'nested content'
      },
      [targetDir]: { type: 'directory' }
    });

    await pfs.copy(sourceDir, targetDir);
    const content = fs.readFileSync(path.join(targetDir, 'source-tree', 'nested', 'entry.txt'), 'utf8');

    assert.strictEqual(content, 'nested content');
  });

  it('rejects for a missing source', async () => {
    const resourceName = 'fixture-path';

    await assert.rejects(async () => {
      await pfs.copy(path.join(tmpDir, resourceName), tmpDir);
    });
  });

  it('rejects when the target already exists', async () => {
    await assert.rejects(async () => {
      await pfs.copy(tmpDir, path.dirname(tmpDir));
    });
  });

  it('replaces an existing target file when overwrite is enabled', async () => {
    fs.writeFileSync(path.join(tmpDir, 'digest', 'tings.txt'), 'old');

    await pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'), {
      overwrite: true
    });

    const content = fs.readFileSync(path.join(tmpDir, 'digest', 'tings.txt'), 'utf8');

    assert.strictEqual(content, 'fixture content');
  });

  it('skips matching entries when filter returns false', async () => {
    const destRoot = createTmpDir();

    try {
      await pfs.copy(tmpDir, destRoot, {
        overwrite: true,
        filter: (src) => path.basename(src) !== 'tings.txt'
      });

      assert(fs.existsSync(path.join(destRoot, path.basename(tmpDir), 'digest')));
      assert(fs.existsSync(path.join(destRoot, path.basename(tmpDir), 'tings.txt')) === false);
    }
    finally {
      removeFixtureTree(destRoot);
    }
  });

  it('copies target contents for a symbolic link to a file', async () => {
    const linkPath = path.join(tmpDir, 'tings-link');
    createFixtureTree({
      [linkPath]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      }
    });

    await pfs.copy(linkPath, path.join(tmpDir, 'digest'));

    const copiedPath = path.join(tmpDir, 'digest', 'tings-link');

    assert(fs.lstatSync(copiedPath).isFile());
    assert.strictEqual(
      fs.readFileSync(copiedPath, 'utf8'),
      fs.readFileSync(path.join(tmpDir, 'tings.txt'), 'utf8')
    );
  });

  it('copies a file into the target directory with sync option', () => {
    pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'), {
      sync: true
    });

    const exist = fs.existsSync(path.join(tmpDir, 'digest', 'tings.txt'));

    assert(exist);
  });

  it('copies a directory recursively with sync option', () => {
    const sourceDir = path.join(tmpDir, 'source-tree');
    const targetDir = path.join(tmpDir, 'target');

    createFixtureTree({
      [path.join(sourceDir, 'nested', 'entry.txt')]: {
        type: 'file',
        data: 'nested content'
      },
      [targetDir]: { type: 'directory' }
    });

    pfs.copy(sourceDir, targetDir, {
      sync: true
    });

    const content = fs.readFileSync(path.join(targetDir, 'source-tree', 'nested', 'entry.txt'), 'utf8');

    assert.strictEqual(content, 'nested content');
  });

  it('throws for a missing source with sync option', () => {
    const resourceName = 'fixture-path';

    assert.throws(() => {
      pfs.copy(path.join(tmpDir, resourceName), tmpDir, {
        sync: true
      });
    });
  });

  it('throws when the target already exists with sync option', () => {
    assert.throws(() => {
      pfs.copy(tmpDir, path.dirname(tmpDir), {
        sync: true
      });
    });
  });

  it('replaces an existing target file when overwrite is enabled with sync option', () => {
    fs.writeFileSync(path.join(tmpDir, 'digest', 'tings.txt'), 'old');

    pfs.copy(path.join(tmpDir, 'tings.txt'), path.join(tmpDir, 'digest'), {
      sync: true,
      overwrite: true
    });

    const content = fs.readFileSync(path.join(tmpDir, 'digest', 'tings.txt'), 'utf8');

    assert.strictEqual(content, 'fixture content');
  });

  it('skips matching entries when filter returns false with sync option', () => {
    const destRoot = createTmpDir();

    try {
      pfs.copy(tmpDir, destRoot, {
        sync: true,
        overwrite: true,
        filter: (src) => path.basename(src) !== 'tings.txt'
      });

      assert(fs.existsSync(path.join(destRoot, path.basename(tmpDir), 'digest')));
      assert(fs.existsSync(path.join(destRoot, path.basename(tmpDir), 'tings.txt')) === false);
    }
    finally {
      removeFixtureTree(destRoot);
    }
  });

  it('copies target contents for a symbolic link to a file with sync option', () => {
    const linkPath = path.join(tmpDir, 'tings-link');
    createFixtureTree({
      [linkPath]: {
        type: 'symlink',
        target: path.join(tmpDir, 'tings.txt')
      }
    });

    pfs.copy(linkPath, path.join(tmpDir, 'digest'), {
      sync: true
    });

    const copiedPath = path.join(tmpDir, 'digest', 'tings-link');

    assert(fs.lstatSync(copiedPath).isFile());
    assert.strictEqual(
      fs.readFileSync(copiedPath, 'utf8'),
      fs.readFileSync(path.join(tmpDir, 'tings.txt'), 'utf8')
    );
  });
});
