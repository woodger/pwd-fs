import assert from 'assert';
import os from 'os';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import FileSystem from '../src';

describe('copy(src, dir [, options])', () => {
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

  it('Positive: Copying a item file', async () => {
    const pfs = new FileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir/binapp', dist);

    const { mode } = await pfs.stat(`${dist}/binapp`);
    const umask = FileSystem.bitmask(mode);

    assert(umask === 0o666);
  });

  it('Positive: Recursive copying a directory', async () => {
    const pfs = new FileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir', dist);

    const { mode } = await pfs.stat(`${dist}/tmpdir/libxbase`);
    const umask = FileSystem.bitmask(mode);

    assert(umask === 0o777);
  });

  it('Positive: Recursive copying a directory. Permission check of file', async () => {
    const pfs = new FileSystem();
    const dist = os.tmpdir();

    await pfs.copy('./tmpdir', dist);

    const { mode } = await pfs.stat(`${dist}/tmpdir/binapp`);
    const umask = FileSystem.bitmask(mode);

    assert(umask === 0o666);
  });

  it(`Positive: Copying a file in 'sync' mode`, async () => {
    const pfs = new FileSystem();
    const dist = os.tmpdir();

    pfs.copy('./tmpdir/binapp', dist, {
      sync: true
    });

    const { mode } = await pfs.stat(`${dist}/binapp`);
    const umask = FileSystem.bitmask(mode);

    assert(umask === 0o666);
  });

  it('Negative: Throw if not exists resource', async () => {
    const pfs = new FileSystem();

    try {
      await pfs.copy('./non-existent', '.');
    }
    catch ({ errno }) {
      assert(errno === -2);
    }
  });

  it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
    const pfs = new FileSystem();

    try {
      await pfs.copy('./tmpdir', '.');
    }
    catch ({ errno }) {
      assert(errno === -17);
    }
  });
});
