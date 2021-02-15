import assert from 'assert';
import { sep } from 'path';
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

  it('Positive: Must read content of file; String type by default', async () => {
    const pfs = new PoweredFileSystem();

    const raw = await pfs.read('./tmpdir/binapp');

    assert(raw.length > 0);
  });

  it('Positive: Must read Buffer content of file when encoding is null', async () => {
    const pfs = new PoweredFileSystem();

    const raw = await pfs.read('./tmpdir/binapp', {
      encoding: null
    });

    assert(raw instanceof Buffer);
  });

  it('Positive: Must read content of file, when path is absolute', async () => {
    const pfs = new PoweredFileSystem();

    const cwd = process.cwd();

    const raw = await pfs.read(`${cwd}${sep}tmpdir${sep}binapp`, {
      resolve: false
    });

    assert(raw.length > 0);
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
    it('Positive: Must read content of file; String type by default', async () => {
      const pfs = new PoweredFileSystem();

      const { length } = pfs.read('./tmpdir/binapp', {
        sync: true
      });

      assert(length > 0);
    });

    it('Positive: Must read Buffer content of file when encoding is null', async () => {
      const pfs = new PoweredFileSystem();

      const raw = pfs.read('./tmpdir/binapp', {
        encoding: null,
        sync: true
      });

      assert(raw instanceof Buffer);
    });

    it('Positive: Must read content of file, when path is absolute', async () => {
      const pfs = new PoweredFileSystem();

      const cwd = process.cwd();

      const { length } = pfs.read(`${cwd}${sep}tmpdir${sep}binapp`, {
        sync: true,
        resolve: false
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
