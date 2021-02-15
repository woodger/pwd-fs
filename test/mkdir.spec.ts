import assert from 'assert';
import os from 'os';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('mkdir(src [, options])', () => {
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

  it('Positive: Create directories in the working directory', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();
    await pfs.mkdir(`./tmpdir/${base}`);

    const exist = await pfs.test(`./tmpdir/${base}`);
    assert(exist);
  });

  it(`Positive: Make current directory`, async () => {
    const pfs = new PoweredFileSystem('./tmpdir');

    await pfs.mkdir('.');

    const exist = await pfs.test('.');
    assert(exist);
  });

  it(`Positive: Make current directory, when current directory is absolute path`, async () => {
    const pfs = new PoweredFileSystem('./tmpdir');

    await pfs.mkdir(process.cwd());

    const exist = await pfs.test('.');
    assert(exist);
  });

  it('Positive: Should work fine with the existing directory', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    for (const item of [base, base]) {
      await pfs.mkdir(`./tmpdir/${item}`);

      const exist = await pfs.test(`./tmpdir/${item}`);
      assert(exist);
    }
  });

  it('Positive: Create directories when path is absolute', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const tmpdir = os.tmpdir();
    const base = chance.guid();

    await pfs.mkdir(`${tmpdir}${sep}${base}`, {
      resolve: false
    });

    const exist = await pfs.test(`${tmpdir}${sep}${base}`);
    assert(exist);
  });

  it('Negative: Throw an exception if trying to create a directory in file', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.mkdir(`./tmpdir/binapp/${base}`);
    }
    catch (err) {
      assert(err.errno === -20);
    }
  });

  describe('sync mode', () => {
    it('Positive: Create directories in the working directory', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      pfs.mkdir(`./tmpdir/${base}`, {
        sync: true
      });

      const exist = await pfs.test(`./tmpdir/${base}`);
      assert(exist);
    });

    it('Positive: Make current directory', async () => {
      const pfs = new PoweredFileSystem('./tmpdir');

      pfs.mkdir('.', {
        sync: true
      });

      const exist = await pfs.test('.');
      assert(exist);
    });

    it('Positive: Should work fine with the existing directory', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      for (const item of [base, base]) {
        pfs.mkdir(`./tmpdir/${item}`, {
          sync: true
        });

        const exist = await pfs.test(`./tmpdir/${item}`);
        assert(exist);
      }
    });

    it('Positive: Create directories when path is absolute', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const tmpdir = os.tmpdir();
      const base = chance.guid();

      pfs.mkdir(`${tmpdir}${sep}${base}`, {
        sync: true,
        resolve: false
      });

      const exist = await pfs.test(`${tmpdir}${sep}${base}`);
      assert(exist);
    });

    it('Positive: Create in current directories when path is absolute', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const cwd = process.cwd();
      const base = chance.guid();

      pfs.mkdir(`${cwd}${sep}${base}`, {
        sync: true,
        resolve: false
      });

      const exist = await pfs.test(base);
      assert(exist);
    });

    it('Negative: Throw an exception if trying to create a directory in file', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const base = chance.guid();

      try {
        pfs.mkdir(`./tmpdir/binapp/${base}`, {
          sync: true
        });
      }
      catch (err) {
        assert(err.errno === -20);
      }
    });
  });
});
