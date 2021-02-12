import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('rename(src, use [, options])', () => {
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

  it('Positive: Must be recursive rename file', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.rename('./tmpdir/binapp', './tmpdir/newapp');
    const exist = await pfs.test('./tmpdir/newapp');

    assert(exist === true);
  });

  it(`Positive: Must be recursive rename file in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.rename('./tmpdir/binapp', './tmpdir/newapp', {
      sync: true
    });

    const exist = await pfs.test('./tmpdir/newapp');
    assert(exist === true);
  });

  it('Positive: Must be recursive rename directory', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase');
    const exist = await pfs.test('./tmpdir/newxbase');

    assert(exist === true);
  });

  it(`Positive: Must be recursive rename directory in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase', {
      sync: true
    });

    const exist = await pfs.test('./tmpdir/newxbase');
    assert(exist === true);
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.rename(`./${base}`, './tmpdir/newapp');
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  it(`Negative: Throw if not exists resource in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      pfs.rename(`./${base}`, './tmpdir/newapp', {
        sync: true
      });
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });
});
