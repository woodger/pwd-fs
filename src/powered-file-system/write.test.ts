import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers file writes, overwrite behavior, and explicit mode handling.
 */
const itUnix = process.platform === 'win32' ? it.skip : it;

describe('write', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'fixture content'
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('writes content to a new file', async () => {
    const payload = 'fixture payload';
    const resourceName = 'fixture-path';
    const filePath = path.join(tmpDir, `${resourceName}.txt`);

    await pfs.write(filePath, payload);
    const content = fs.readFileSync(filePath, 'utf8');

    assert.strictEqual(content, payload);
  });

  it('replaces content when the file already exists', async () => {
    const payload = 'fixture payload';

    await pfs.write(path.join(tmpDir, 'tings.txt'), payload);
    const content = fs.readFileSync(path.join(tmpDir, 'tings.txt'), 'utf8');

    assert.strictEqual(content, payload);
  });

  it('rejects when the target is a directory', async () => {
    const payload = 'fixture payload';

    await assert.rejects(async () => {
      await pfs.write(tmpDir, payload);
    });
  });

  it(`rejects an unsupported 'flag' option`, async () => {
    const payload = 'fixture payload';

    await assert.rejects(async () => {
      await pfs.write(path.join(tmpDir, 'tings.txt'), payload, {
        flag: 'r'
      });
    });
  });

  it('writes content to a new file with sync option', () => {
    const payload = 'fixture payload';
    const resourceName = 'fixture-path';
    const filePath = path.join(tmpDir, `${resourceName}.txt`);

    pfs.write(filePath, payload, {
      sync: true
    });
    
    const content = fs.readFileSync(filePath, 'utf8');

    assert.strictEqual(content, payload);
  });

  it('throws when the target is a directory with sync option', () => {
    const payload = 'fixture payload';

    assert.throws(() => {
      pfs.write(tmpDir, payload, {
        sync: true
      });
    });
  });

  it(`throws for an unsupported 'flag' option with sync option`, () => {
    const payload = 'fixture payload';

    assert.throws(() => {
      pfs.write(path.join(tmpDir, 'tings.txt'), payload, {
        sync: true,
        flag: 'r'
      });
    });
  });

  itUnix('applies umask to the created file mode with sync option', () => {
    const resourceName = 'fixture-path';
    const filePath = path.join(tmpDir, `${resourceName}.txt`);

    pfs.write(filePath, 'x', {
      sync: true,
      umask: 0o022
    });

    const mode = fs.statSync(filePath).mode & 0o777;

    assert.strictEqual(mode, 0o644);
  });
});
