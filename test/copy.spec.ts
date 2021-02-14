import assert from 'assert';
import os from 'os';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('copy(src, dir [, options])', () => {
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

  it('Positive: Copying a item file', async () => {
    const pfs = new PoweredFileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir/binapp', dist);

    const { mode } = await pfs.stat(`${dist}/binapp`);
    const umask = PoweredFileSystem.bitmask(mode);

    assert(umask === 0o666);
  });

  it('Positive: Recursive copying a directory', async () => {
    const pfs = new PoweredFileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir', dist);

    const { mode } = await pfs.stat(`${dist}/tmpdir/libxbase`);
    const umask = PoweredFileSystem.bitmask(mode);

    assert(umask === 0o777);
  });

  it('Positive: Recursive copying a directory. Permission check of file', async () => {
    const pfs = new PoweredFileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir', dist);

    const { mode } = await pfs.stat(`${dist}/tmpdir/binapp`);
    const umask = PoweredFileSystem.bitmask(mode);

    assert(umask === 0o666);
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.copy('./non-existent', '.');
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.copy('./tmpdir', '.');
    }
    catch (err) {
      assert(err.errno === -17);
    }
  });

  describe('sync mode', () => {
    it('Positive: Copying a file', async () => {
      const pfs = new PoweredFileSystem();
      const dist = os.tmpdir();

      pfs.copy('./tmpdir/binapp', dist, {
        sync: true
      });

      const { mode } = await pfs.stat(`${dist}/binapp`);
      const umask = PoweredFileSystem.bitmask(mode);

      assert(umask === 0o666);
    });

    it('Positive: Recursive copying a directory', async () => {
      const pfs = new PoweredFileSystem();
      const dist = os.tmpdir();

      pfs.copy('./tmpdir', dist, {
        sync: true
      });

      const { mode } = await pfs.stat(`${dist}/tmpdir/libxbase`);
      const umask = PoweredFileSystem.bitmask(mode);

      assert(umask === 0o777);
    });

    it('Negative: Throw if not exists resource', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.copy('./non-existent', '.', {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });

    it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.copy('./tmpdir', '.', {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -17);
      }
    });
  });
});
