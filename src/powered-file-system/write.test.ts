import assert from 'node:assert';
import fs from 'node:fs';
import Chance from 'chance';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { pfs } from '../index';
import { fmock, restore } from '../test-utils';

const itUnix = process.platform === 'win32' ? it.skip : it;

describe('write(src, data[, options])', () => {
  const chance = new Chance();

  beforeEach(() => {
    fmock({
      './tmpdir/tings.txt': {
        type: 'file',
        data: chance.string()
      }
    });
  });

  afterEach(() => {
    restore('./tmpdir');
  });

  it('Positive: Must write content to file', async () => {
    const payload = chance.paragraph();
    const guid = chance.guid();

    await pfs.write(`./tmpdir/${guid}.txt`, payload);
    const { size } = fs.lstatSync(`./tmpdir/${guid}.txt`);

    assert(payload.length === size);
  });

  it('Positive: Must rewrite content if file already exists', async () => {
    const payload = chance.paragraph();

    await pfs.write('./tmpdir/tings.txt', payload);
    const { size } = fs.lstatSync('./tmpdir/tings.txt');

    assert(payload.length === size);
  });

  it('Negative: Throw if resource is directory', async () => {
    const payload = chance.paragraph();

    await assert.rejects(async () => {
      await pfs.write('./tmpdir', payload);
    });
  });

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const payload = chance.paragraph();

    await assert.rejects(async () => {
      await pfs.write('./tmpdir/tings.txt', payload, {
        flag: 'r'
      });
    });
  });

  it('[sync] Positive: Write contents even to a non-existent file', () => {
    const payload = chance.paragraph();
    const guid = chance.guid();

    pfs.write(`./tmpdir/${guid}.txt`, payload, {
      sync: true
    });

    const content = fs.readFileSync(`./tmpdir/${guid}.txt`, 'utf8');

    assert(payload === content);
  });

  it('[sync] Negative: Throw if resource is directory', () => {
    const payload = chance.paragraph();

    assert.throws(() => {
      pfs.write('./tmpdir', payload, {
        sync: true
      });
    });
  });

  it(`[sync] Negative: Unexpected option 'flag' returns Error`, () => {
    const payload = chance.paragraph();

    assert.throws(() => {
      pfs.write('./tmpdir/tings.txt', payload, {
        sync: true,
        flag: 'r'
      });
    });
  });

  itUnix('[sync] Positive: Umask should be applied with bit masking', () => {
    const guid = chance.guid();

    pfs.write(`./tmpdir/${guid}.txt`, 'x', {
      sync: true,
      umask: 0o111
    });

    const mode = fs.statSync(`./tmpdir/${guid}.txt`).mode & 0o777;

    assert(mode === 0o666);
  });
});
