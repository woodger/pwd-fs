import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, createFixtureTree, removeFixtureTree } from '../test-utils';

/**
 * Covers the deprecated append helper in both async and sync modes.
 */
describe('append(src, data [, options])', () => {
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    createFixtureTree({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'hoodie'
      }
    });
  });

  afterEach(() => {
    removeFixtureTree(tmpDir);
  });

  it('Positive: Must append content to file', async () => {
    const payload = 'fixture payload';

    const filePath = path.join(tmpDir, 'tings.txt');
    await pfs.append(filePath, payload);
    const content = fs.readFileSync(filePath, 'utf8');

    assert.strictEqual(content, `hoodie${payload}`);
  });

  it('[sync] Positive: Must append content to file', () => {
    const payload = 'fixture payload';

    const filePath = path.join(tmpDir, 'tings.txt');
    pfs.append(filePath, payload, {
      sync: true
    });

    const content = fs.readFileSync(filePath, 'utf8');

    assert.strictEqual(content, `hoodie${payload}`);
  });
});
