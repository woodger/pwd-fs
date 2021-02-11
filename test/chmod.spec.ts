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

  it('Changes directory and file permissions', async () => {
    const pfs = new PoweredFileSystem();

    await pfs.chmod('./tmpdir', 0o744);
    const stat = await pfs.stat('./tmpdir/binapp');

    // assert(stat.bitmask === 0o744);
    // ???

    assert(stat);
  });

  it(`Changes directory and file permissions in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();

    pfs.chmod('./tmpdir', 0o744, {
      sync: true
    });

    const stat = await pfs.stat('./tmpdir/binapp');

    pfs.stat('./tmpdir/binapp', {
      sync: true
    });

    // assert(stat.bitmask === 0o744);
    // ???

    assert(stat);
  });

  it('Search permission is denied on a component of the path prefix', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.chmod('./tmpdir', 0);
    }
    catch (err) {
      assert(err.message.includes('EACCES, permission denied') > -1);
    }
  });

  it('To a non-existent resource to return an Error', async () => {
    const pfs = new PoweredFileSystem();

    try {
      await pfs.chmod('./non-existent-source', 0o744);
    }
    catch (err) {
      const index = err.message.indexOf('ENOENT, no such file or directory');

      assert(index > -1);
    }
  });
});
