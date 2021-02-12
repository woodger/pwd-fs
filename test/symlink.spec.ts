import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe(`stat(src [, options])`, () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.paragraph(),
        'libxbase': mockFs.directory()
      }
    });
  });

  afterEach(mockFs.restore);

  it('Positive: Must be created a symbolic link', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.symlink('./tmpdir/binapp', './flexapp');

    const stats = await pfs.stat('./flexapp');
    assert(stats.isSymbolicLink());
  });

  it(`Positive: Must be created a symbolic link in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.symlink('./tmpdir/binapp', './flexapp', {
      sync: true
    });

    const stats = await pfs.stat('./flexapp');
    assert(stats.isSymbolicLink());
  });

  it('Positive: Must be created a symbolic link for directory', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.symlink(`./tmpdir/libxbase`, './flexapp');

    const stats = await pfs.stat('./flexapp');
    assert(stats.isSymbolicLink());
  });

  it(`Positive: Must be created a symbolic link for directory in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.symlink(`./tmpdir/libxbase`, './flexapp', {
      sync: true
    });

    const stats = await pfs.stat('./flexapp');
    assert(stats.isSymbolicLink());
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.symlink(`./${base}`, './linkapp');
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
      pfs.symlink(`./${base}`, './linkapp', {
        sync: true
      });
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });
});
