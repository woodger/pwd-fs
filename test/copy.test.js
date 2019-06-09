const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.copy(src, dir [, options])`, () => {
  const pfs = new PoweredFileSystem();

  before(() => {
    mockFs({
      dir: mockFs.directory({
        items: {
          dir: mockFs.directory(),
          'file.txt': ''
        }
      }),
      dev: mockFs.directory({
        items: {
          'mock.txt': mockFs.file({
            mode: 0004
          }),
          'file.txt': ''
        }
      })
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Copying a directory with a file`, async () => {
    await pfs.copy('./dir', './dev');

    const dstat = await pfs.stat('./dev/dir');
    const fstat = await pfs.stat('./dev/dir/file.txt');

    assert(dstat.bitmask === 0o777);
    assert(fstat.bitmask === 0o666);
  });

  it(`Search permission is denied on a component of the path prefix`, async () => {
    try {
      await pfs.copy('./dev', './dir');
    }
    catch (err) {
      assert(err.message.indexOf('EACCES, permission denied') > -1);
    }
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.copy('./non-existent.txt', '.');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`An attempt to copy to an existing resource should return an Error`, async () => {
    try {
      await pfs.copy('./dir', '.');
    }
    catch (err) {
      assert(err.message.indexOf('EEXIST, file already exists') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.copy('./dir/file.txt', '.', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `umask` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.copy('./dir/file.txt', '.', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#copy()'. Expected Boolean");
    }
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async () => {
    try {
      await pfs.copy('./dir/file.txt', '.', {
        umask: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'umask' in order '#copy()'. Expected Number");
    }
  });
});
