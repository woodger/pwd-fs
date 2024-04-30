import assert from 'assert';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('rename(src, use [, options])', () => {
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

  it('Positive: Must be recursive rename file', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.rename('./tmpdir/binapp', './tmpdir/newapp');
    const exist = await pfs.test('./tmpdir/newapp');

    assert(exist);
  });

  it('Positive: Must be recursive rename directory', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase');
    const exist = await pfs.test('./tmpdir/newxbase');

    assert(exist);
  });

  it('Positive: Must be recursive rename directory, when path is absolute', async () => {
    const pfs = new PoweredFileSystem();

    const cwd = process.cwd();

    await pfs.rename(`${cwd}${sep}tmpdir`, `${cwd}${sep}newxbase`, {
      resolve: false
    });

    const exist = await pfs.test('./newxbase');
    assert(exist);
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

  describe('sync mode', () => {
    it('Positive: Must be recursive rename file', async () => {
      const pfs = new PoweredFileSystem();

      pfs.rename('./tmpdir/binapp', './tmpdir/newapp', {
        sync: true
      });

      const exist = await pfs.test('./tmpdir/newapp');
      assert(exist);
    });

    it('Positive: Must be recursive rename directory', async () => {
      const pfs = new PoweredFileSystem();

      pfs.rename('./tmpdir/libxbase', './tmpdir/newxbase', {
        sync: true
      });

      const exist = await pfs.test('./tmpdir/newxbase');
      assert(exist);
    });

    it('Positive: Must be recursive rename directory, when path is absolute', async () => {
      const pfs = new PoweredFileSystem();

      const cwd = process.cwd();

      pfs.rename(`${cwd}${sep}tmpdir`, `${cwd}${sep}newxbase`, {
        sync: true,
        resolve: false
      });

      const exist = await pfs.test('./newxbase');
      assert(exist);
    });

    it('Negative: Throw if not exists resource', async () => {
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
});
