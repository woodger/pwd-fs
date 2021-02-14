import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('read(src [, options])', () => {
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

  it('Positive: Must read content of file', async () => {
    const pfs = new PoweredFileSystem();

    const { length } = await pfs.read('./tmpdir/binapp');

    assert(length > 0);
  });

  it('Negative: Throw if resource is not file', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.read(`./tmpdir/libxbase`);
    }
    catch (err) {
      assert(err.errno === -21);
    }
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.read(`./${base}`);
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  describe('sync mode', () => {
    it('Positive: Must read content of file', async () => {
      const pfs = new PoweredFileSystem();

      const { length } = pfs.read('./tmpdir/binapp', {
        sync: true
      });

      assert(length > 0);
    });

    it('Positive: Must read string type of file by default', async () => {
      const pfs = new PoweredFileSystem();

      const { length } = pfs.read('./tmpdir/binapp', {
        sync: true
      });

      assert(length > 0);
    });

    it(`Negative: Throw if not exists resource`, async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      try {
        pfs.read(`./${base}`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });
  });
});
