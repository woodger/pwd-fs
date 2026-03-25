import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

/**
 * Covers file writes, overwrite behavior, and explicit mode handling.
 */
const itUnix = process.platform === 'win32' ? it.skip : it;

describe('write(src, data[, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: chance.string()
      }
    });
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Must write content to file', async () => {
    const payload = chance.paragraph();
    const guid = chance.guid();
    const filePath = path.join(tmpDir, `${guid}.txt`);

    await pfs.write(filePath, payload);
    const { size } = fs.lstatSync(filePath);

    assert(payload.length === size);
  });

  it('Positive: Must rewrite content if file already exists', async () => {
    const payload = chance.paragraph();

    await pfs.write(path.join(tmpDir, 'tings.txt'), payload);
    const { size } = fs.lstatSync(path.join(tmpDir, 'tings.txt'));

    assert(payload.length === size);
  });

  it('Negative: Throw if resource is directory', async () => {
    const payload = chance.paragraph();

    await assert.rejects(async () => {
      await pfs.write(tmpDir, payload);
    });
  });

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const payload = chance.paragraph();

    await assert.rejects(async () => {
      await pfs.write(path.join(tmpDir, 'tings.txt'), payload, {
        flag: 'r'
      });
    });
  });

  it('[sync] Positive: Write contents even to a non-existent file', () => {
    const payload = chance.paragraph();
    const guid = chance.guid();
    const filePath = path.join(tmpDir, `${guid}.txt`);

    pfs.write(filePath, payload, {
      sync: true
    });
    
    const content = fs.readFileSync(filePath, 'utf8');

    assert(payload === content);
  });

  it('[sync] Negative: Throw if resource is directory', () => {
    const payload = chance.paragraph();

    assert.throws(() => {
      pfs.write(tmpDir, payload, {
        sync: true
      });
    });
  });

  it(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
    const payload = chance.paragraph();

    assert.throws(() => {
      pfs.write(path.join(tmpDir, 'tings.txt'), payload, {
        sync: true,
        flag: 'r'
      });
    });
  });

  itUnix('[sync] Positive: Umask should be applied with bit masking', () => {
    const guid = chance.guid();
    const filePath = path.join(tmpDir, `${guid}.txt`);

    pfs.write(filePath, 'x', {
      sync: true,
      umask: 0o111
    });

    const mode = fs.statSync(filePath).mode & 0o777;

    assert(mode === 0o666);
  });
});
