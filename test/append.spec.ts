import assert from 'assert';
import { sep } from 'path';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('append(src, data [, options])', () => {
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

  it('Positive: Must append content to file', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const before = await pfs.stat('./tmpdir/binapp');

    const payload = chance.string();
    await pfs.append('./tmpdir/binapp', payload);

    const after = await pfs.stat('./tmpdir/binapp');

    assert(after.size > before.size);
  });

  it('Positive: Must append content to file when path is absolute', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const before = await pfs.stat('./tmpdir/binapp');

    const cwd = process.cwd();
    const payload = chance.string();

    await pfs.append(`${cwd}${sep}tmpdir${sep}binapp`, payload, {
      resolve: false
    });

    const after = await pfs.stat('./tmpdir/binapp');

    assert(after.size > before.size);
  });

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    try {
      const payload = chance.string();

      await pfs.append('./tmpdir/binapp', payload, {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.errno === -9);
    }
  });

  describe('sync mode', () => {
    it(`Positive: Must append content to file`, async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const before = await pfs.stat('./tmpdir/binapp');
      const payload = chance.string();

      pfs.append('./tmpdir/binapp', payload, {
        sync: true
      });

      const after = await pfs.stat('./tmpdir/binapp');

      assert(after.size > before.size);
    });

    it('Positive: Must append content to file when path is absolute', async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      const before = await pfs.stat('./tmpdir/binapp');

      const cwd = process.cwd();
      const payload = chance.string();

      pfs.append(`${cwd}${sep}tmpdir${sep}binapp`, payload, {
        sync: true,
        resolve: false
      });

      const after = await pfs.stat('./tmpdir/binapp');

      assert(after.size > before.size);
    });

    it(`Negative: Unexpected option 'flag' returns Error`, async () => {
      const pfs = new PoweredFileSystem();
      const chance = new Chance();

      try {
        const payload = chance.string();

        pfs.append('./tmpdir/binapp', payload, {
          sync: true,
          flag: 'r'
        });
      }
      catch (err) {
        assert(err.errno === -9);
      }
    });
  });
});
