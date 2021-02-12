import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import FileSystem from '../src';

describe('chown(src, uid, gid [, options])', () => {
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

  it('Positive: Changes the permissions of a file', async () => {
    const pfs = new FileSystem();

    await pfs.chown('./tmpdir/binapp', 0, 0);
    const { uid, gid } = await pfs.stat('./tmpdir/binapp');

    assert(uid === 0 && gid === 0);
  });

  it('Positive: Changes the permissions of a directory', async () => {
    const pfs = new FileSystem();

    await pfs.chown('./tmpdir/libxbase', 0, 0);
    const { uid, gid } = await pfs.stat('./tmpdir/libxbase');

    assert(uid === 0 && gid === 0);
  });

  it(`Positive: Changes the permissions of a file in 'sync' mode`, async () => {
    const pfs = new FileSystem();

    pfs.chown('./tmpdir/binapp', 1, 1, {
      sync: true
    });

    const { uid, gid } = await pfs.stat('./tmpdir/binapp');

    assert(uid === 1 && gid === 1);
  });

  it('Positive: Changes the permissions of a directory in sync mode', async () => {
    const pfs = new FileSystem();

    pfs.chown('./tmpdir/libxbase', 1, 1, {
      sync: true
    });

    const { uid, gid } = await pfs.stat('./tmpdir/libxbase');

    assert(uid === 1 && gid === 1);
  });

  it('Negative: To a non-existent resource to return an Error', async () => {
    const pfs = new FileSystem();

    try {
      await pfs.chown('./non-existent-source', 1, 1);
    }
    catch ({ errno }) {
      assert(errno === -2);
    }
  });

  it(`Negative: To a non-existent resource to return an Error in 'sync' mode`, async () => {
    const pfs = new FileSystem();

    try {
      pfs.chown('./non-existent-source', 1, 1, {
        sync: true
      });
    }
    catch ({ errno }) {
      assert(errno === -2);
    }
  });
});
