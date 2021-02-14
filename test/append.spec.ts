import assert from 'assert';
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

  /*
  it(`Positive: Must append content to file when path is absolute`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const cwd = os.tmpdir();
    const [ payload1, payload2 ] = chance.n(chance.email, 1);

    await pfs.write(`${tmpdir}/midtat`, payload1);
    const before = await pfs.stat(`${tmpdir}/midtat`);

    await pfs.append(`${tmpdir}/midtat`, payload2, {
      resolve: false
    });

    const after = await pfs.stat(`${tmpdir}/midtat`);

    assert(after.size > before.size);
  });
  */

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    try {
      const payload = chance.paragraph();

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
      const payload = chance.paragraph();

      pfs.append('./tmpdir/binapp', payload, {
        sync: true
      });

      const after = await pfs.stat('./tmpdir/binapp');

      assert(after.size > before.size);
    });
  });
});
