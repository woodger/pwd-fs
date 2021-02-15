import assert from 'assert';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('symlink(src, use [, options])', () => {
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

  it('Positive: Must be created a symbolic link', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.symlink('./tmpdir/binapp', './linkapp');

    const stats = await pfs.stat('./linkapp');
    assert(stats.isSymbolicLink());
  });

  it('Positive: Must be created a symbolic link for directory', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.symlink(`./tmpdir/libxbase`, './linkapp');

    const stats = await pfs.stat('./linkapp');
    assert(stats.isSymbolicLink());
  });

  it('Positive: Must be created a symbolic, when path is absolute', async () => {
    const pfs = new PoweredFileSystem();

    const cwd = process.cwd();

    await pfs.symlink(`${cwd}${sep}tmpdir${sep}libxbase`, `${cwd}${sep}linkapp`, {
      resolve: false
    });

    const stats = await pfs.stat('./linkapp');
    assert(stats.isSymbolicLink());
  });

  it('Negative: Throw if destination already exists', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.symlink(`./flexapp`, './tmpdir/binapp');
    }
    catch (err) {
      assert(err.errno === -17);
    }
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

  describe('sync mode', () => {
    it('Positive: Must be created a symbolic link', async () => {
      const pfs = new PoweredFileSystem();

      pfs.symlink('./tmpdir/binapp', './linkapp', {
        sync: true
      });

      const stats = await pfs.stat('./linkapp');
      assert(stats.isSymbolicLink());
    });

    it('Positive: Must be created a symbolic link for directory', async () => {
      const pfs = new PoweredFileSystem();

      pfs.symlink(`./tmpdir/libxbase`, './linkapp', {
        sync: true
      });

      const stats = await pfs.stat('./linkapp');
      assert(stats.isSymbolicLink());
    });

    it('Positive: Must be created a symbolic, when path is absolute', async () => {
      const pfs = new PoweredFileSystem();

      const cwd = process.cwd();

      pfs.symlink(`${cwd}${sep}tmpdir${sep}libxbase`, `${cwd}${sep}linkapp`, {
        sync: true,
        resolve: false
      });

      const stats = await pfs.stat('./linkapp');
      assert(stats.isSymbolicLink());
    });

    it('Negative: Throw if destination already exists', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.symlink(`./flexapp`, './tmpdir/binapp', {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -17);
      }
    });

    it('Negative: Throw if not exists resource', async () => {
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
});
