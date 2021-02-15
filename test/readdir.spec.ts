import assert from 'assert';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('readdir(src[, options])', () => {
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

  it('Positive: Must return a directory listing', async () => {
    const pfs = new PoweredFileSystem();

    const listOfFiles = await pfs.readdir('./tmpdir');

    assert.deepStrictEqual(listOfFiles, [
      'binapp',
      'libxbase'
    ]);
  });

  it('Positive: Must return a directory listing, when path is absolute', async () => {
    const pfs = new PoweredFileSystem();

    const cwd = process.cwd();

    const listOfFiles = await pfs.readdir(`${cwd}${sep}tmpdir`, {
      resolve: false
    });

    assert.deepStrictEqual(listOfFiles, [
      'binapp',
      'libxbase'
    ]);
  });

  it('Negative: Throw if resource is not directory', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.readdir(`./tmpdir/binapp`);
    }
    catch (err) {
      assert(err.errno === -20);
    }
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.readdir(`./${base}`);
    }
    catch (err) {
      assert(err.errno === -2);
    }
  });

  describe('sync mode', () => {
    it('Positive: Must return a directory listing', async () => {
      const pfs = new PoweredFileSystem();

      const listOfFiles = pfs.readdir('./tmpdir', {
        sync: true
      });

      assert.deepStrictEqual(listOfFiles, [
        'binapp',
        'libxbase'
      ]);
    });

    it('Positive: Must return a directory listing, when path is absolute', async () => {
      const pfs = new PoweredFileSystem();

      const cwd = process.cwd();

      const listOfFiles = pfs.readdir(`${cwd}${sep}tmpdir`, {
        sync: true,
        resolve: false
      });

      assert.deepStrictEqual(listOfFiles, [
        'binapp',
        'libxbase'
      ]);
    });

    it('Negative: Throw if resource is not directory', async () => {
      const pfs = new PoweredFileSystem();

      try {
        pfs.readdir(`./tmpdir/binapp`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -20);
      }
    });

    it(`Negative: Throw if not exists resource`, async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      try {
        pfs.readdir(`./${base}`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -2);
      }
    });
  });
});
