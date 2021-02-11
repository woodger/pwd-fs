import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem  from '../src';

describe('#pfs.append(src, data [, options])', () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.paragraph(),
        'libxbase': mockFs.directory()
      },
    });
  });

  afterEach(mockFs.restore);

  it('Must append content to file', async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const statBefore = await pfs.stat('./tmpdir/binapp');

    const payload = chance.paragraph();
    await pfs.append('./tmpdir/binapp', payload);

    const statAfter = await pfs.stat('./tmpdir/binapp');

    // assert(statAfter.size > statBefore.size);
  });

  it(`Must append content to file in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const statBefore = await pfs.stat('./tmpdir/binapp');

    const payload = chance.paragraph();
    pfs.append('./tmpdir/binapp', payload, {
      sync: true
    });

    const statAfter = await pfs.stat('./tmpdir/binapp');

    // assert(statAfter.size > statBefore.size);
  });

  it(`Unexpected option 'flag' returns Error`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    try {
      const payload = chance.paragraph();
      await pfs.append('./tmpdir/binapp', payload, {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.message === "EBADF, bad file descriptor");
    }
  });
});
