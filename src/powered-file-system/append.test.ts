import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { createTmpDir, fmock, restore } from '../test-utils';

describe('append(src, data [, options])', () => {
  const chance = new Chance();
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = createTmpDir();

    fmock({
      [path.join(tmpDir, 'tings.txt')]: {
        type: 'file',
        data: 'hoodie'
      }
    });
  });

  afterEach(() => {
    restore(tmpDir);
  });

  it('Positive: Must append content to file', async () => {
    const payload = chance.paragraph();

    const filePath = path.join(tmpDir, 'tings.txt');
    await pfs.append(filePath, payload);
    const { size } = fs.statSync(filePath);

    assert(payload.length + 6 === size);
  });

  it('[sync] Positive: Must append content to file', () => {
    const payload = chance.paragraph();

    const filePath = path.join(tmpDir, 'tings.txt');
    pfs.append(filePath, payload, {
      sync: true
    });

    const { size } = fs.statSync(filePath);

    assert(payload.length + 6 === size);
  });
});
