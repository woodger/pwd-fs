import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('stat(src [, options])', () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.string(),
        'libxbase': mockFs.directory()
      },
      'flexapp': mockFs.symlink({
        path: 'tmpdir/binapp'
      })
    });
  });

  afterEach(mockFs.restore);

  it('Positive: Must return information a file', async () => {
    const pfs = new PoweredFileSystem();

    const stats = await pfs.stat('./tmpdir/binapp');
    assert(stats.isFile());
  });

  it('Positive: Must return information a directory', async () => {
    const pfs = new PoweredFileSystem();

    const stats = await pfs.stat('./tmpdir/libxbase');
    assert(stats.isDirectory());
  });

  it(`Positive: Must return information a symlink`, async () => {
    const pfs = new PoweredFileSystem();

    const stats = await pfs.stat('./flexapp');
    assert(stats.isSymbolicLink());
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.stat(`./${base}`);
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  describe('sync mode', () => {
    it('Positive: Must return information a file', async () => {
      const pfs = new PoweredFileSystem();

      const stats = pfs.stat('./tmpdir/binapp', {
        sync: true
      });

      assert(stats.isFile());
    });

    it('Positive: Must return information a directory in ', async () => {
      const pfs = new PoweredFileSystem();

      const stats = pfs.stat('./tmpdir/libxbase', {
        sync: true
      });

      assert(stats.isDirectory());
    });

    it('Positive: Must return information a symlink', async () => {
      const pfs = new PoweredFileSystem();

      const stats = pfs.stat('./flexapp', {
        sync: true
      });

      assert(stats.isSymbolicLink());
    });

    it('Negative: Throw if not exists resource', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      try {
        pfs.stat(`./${base}`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });
  });
});
