const assert = require('assert');
const mockFs = require('mock-fs');
const FileSystem = require('..');

describe(`pfs.chown(src, uid, gid [, options])`, () => {
  const pfs = new FileSystem();

  before(() => {
    mockFs({
      dir: mockFs.directory({
        items: {
          dir: mockFs.directory(),
          'file.txt': ''
        }
      }),
      dev: mockFs.directory({
        mode: 0400,
        items: {
          'file.txt': ''
        }
      })
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Changes the permissions of a file`, async () => {
    await pfs.chown('./dir/file.txt', 0, 0);
    const stat = await pfs.stat('./dir/file.txt');

    assert(stat.uid === 0);
    assert(stat.gid === 0);
  });

  it(`Changes the permissions of a directory`, async () => {
    await pfs.chown('./dir', 0, 0);
    const stat = await pfs.stat('./dir');

    assert(stat.uid === 0);
    assert(stat.gid === 0);
  });

  it(`Search permission is denied on a component of the path prefix`, async () => {
    try {
      await pfs.chown('./dev', 0, 0);
    }
    catch (err) {
      assert(err.message.indexOf('EACCES, permission denied') > -1);
    }
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.chown('./non-existent.txt', 0, 0);
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.chown('./dir/file.txt', 0, 0, null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.chown('./dir/file.txt', 0, 0, {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#chown()'. Expected Boolean");
    }
  });
});
