import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import FileSystem from '../src';

describe('append(src, data [, options])', () => {
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

  it('Positive: Must append content to file', async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const before = await pfs.stat('./tmpdir/binapp');

    const payload = chance.paragraph();
    await pfs.append('./tmpdir/binapp', payload);

    const after = await pfs.stat('./tmpdir/binapp');

    assert(after.size > before.size);
  });

  it(`Positive: Must append content to file in 'sync' mode`, async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const before = await pfs.stat(
      './tmpdir/binapp'
    );

    const payload = chance.paragraph();

    pfs.append('./tmpdir/binapp', payload, {
      sync: true
    });

    const after = await pfs.stat('./tmpdir/binapp');

    assert(after.size > before.size);
  });

  it(`Negative: Unexpected option 'flag' returns Error`, async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    try {
      const payload = chance.paragraph();

      await pfs.append('./tmpdir/binapp', payload, {
        flag: 'r'
      });
    }
    catch ({ errno }) {
      assert(errno === -9);
    }
  });
});
