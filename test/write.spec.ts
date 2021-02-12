import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('write(src, data [, options])', () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.paragraph(),
        'libxbase': mockFs.directory()
      },
    });
  });

  afterEach(mockFs.restore);

  it('Positive: Must write content to file', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();
    const exists = await pfs.test(`./tmpdir/${base}`);

    assert(exists === false);

    const payload = chance.paragraph();

    await pfs.write(`./tmpdir/${base}`, payload);
    const stats = await pfs.stat(`./tmpdir/${base}`);

    assert(stats.size > 0);
  });

  it(`Positive: Must rewrite content if file already exists`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const payload = chance.paragraph();

    await pfs.write('./tmpdir/binapp', payload);
    const stats = await pfs.stat(`./tmpdir/binapp`);

    assert(stats.size > 0);
  });

  it(`Positive: Must write content to file in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();
    const exists = await pfs.test(`./tmpdir/${base}`);

    assert(exists === false);

    const payload = chance.paragraph();

    pfs.write(`./tmpdir/${base}`, payload, {
      sync: true
    });

    const stats = await pfs.stat(`./tmpdir/${base}`);

    assert(stats.size > 0);
  });

  it(`Negative: Throw if resource is directory`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    try {
      const payload = chance.paragraph();

      await pfs.write('./tmpdir/libxbase', payload);
    }
    catch (err) {
      assert(err.errno === -21);
    }
  });

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    try {
      const payload = chance.paragraph();

      await pfs.write('./tmpdir/binapp', payload, {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.errno === -9);
    }
  });
});
