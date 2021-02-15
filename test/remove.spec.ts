import assert from 'assert';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('remove(src [, options])', () => {
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

  it('Positive: Removal a directory with a file', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.remove('./tmpdir');

    const exist = await pfs.test('./tmpdir');
    assert(exist === false);
  });

  it('Positive: Removal a directory with a file, when path is absolute', async () => {
    const pfs = new PoweredFileSystem();

    const cwd = process.cwd();

    await pfs.remove(`${cwd}${sep}tmpdir`, {
      resolve: false
    });

    const exist = await pfs.test('./tmpdir');
    assert(exist === false);
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.remove(`./${base}`);
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  describe('sync mode', () => {
    it('Positive: Removal a directory with a file', async () => {
      const pfs = new PoweredFileSystem();

      pfs.remove('./tmpdir', {
        sync: true
      });

      const exist = await pfs.test('./tmpdir');
      assert(exist === false);
    });

    it('Positive: Removal a directory with a file, when path is absolute', async () => {
      const pfs = new PoweredFileSystem();

      const cwd = process.cwd();

      pfs.remove(`${cwd}${sep}tmpdir`, {
        sync: true,
        resolve: false
      });

      const exist = await pfs.test('./tmpdir');
      assert(exist === false);
    });

    it('Negative: Throw if not exists resource', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      try {
        pfs.remove(`./${base}`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });
  });
});
