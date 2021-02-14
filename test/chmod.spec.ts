import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('chmod(src, mode [, options])', () => {
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

  it('Positive: Changes directory and file permissions', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.chmod('./tmpdir', 0o744);

    const { mode } = await pfs.stat('./tmpdir/binapp');
    const umask = PoweredFileSystem.bitmask(mode);

    assert(umask === 0o744);
  });

  it('Negative: Search permission is denied on a component of the path prefix', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.chmod('./tmpdir', 0);
    }
    catch (err) {
      assert(err.errno === -9);
    }
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.chmod('./non-existent-source', 0o744);
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  describe('sync mode', () => {
    it(`Positive: Changes directory and file permissions`, async () => {
      const pfs = new PoweredFileSystem();

      pfs.chmod('./tmpdir', 0o744, {
        sync: true
      });

      const { mode } = await pfs.stat('./tmpdir/binapp');
      const umask = PoweredFileSystem.bitmask(mode);

      assert(umask === 0o744);
    });

    it('Negative: Search permission is denied on a component of the path prefix', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.chmod('./tmpdir', 0, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -9);
      }
    });

    it('Negative: Throw if not exists resource', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.chmod('./non-existent-source', 0o744, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });
  });
});
