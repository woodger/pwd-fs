const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.chmod(src, mode [, options])`, () => {
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

  it(`Changes directory and file permissions`, async () => {
    await pfs.chmod('./dir', 0o744);
    const stat = await pfs.stat('./dir/file.txt');

    assert(stat.bitmask === 0o744);
  });

  it(`Search permission is denied on a component of the path prefix`, async () => {
    try {
      await pfs.chmod('./dev', 0, 0);
    }
    catch (err) {
      assert(err.message.indexOf('EACCES, permission denied') > -1);
    }
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.chmod('./non-existent.txt', 0o744);
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.chmod('./dir/file.txt', 0o744, null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.chmod('./dir/file.txt', 0o744, {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#chmod()'. Expected Boolean");
    }
  });
});
