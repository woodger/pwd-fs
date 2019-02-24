const assert = require('assert');
const mockFs = require('mock-fs');
const FileSystem = require('..');

describe(`pfs.stat(src [, options])`, () => {
  const pfs = new FileSystem();

  before(() => {
    mockFs({
      dir: mockFs.directory({
        items: {
          symlink: mockFs.symlink({
            path: 'file.txt'
          }),
          'file.txt': 'some text ...'
        }
      }),
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Provides information about a is file`, async () => {
    const stat = await pfs.stat('./dir/file.txt');

    assert(stat.isFile() === true);
    assert(stat.size === 13);
  });

  it(`Provides information about the symlink`, async () => {
    const stat = await pfs.stat('./dir/symlink');
    const isSymbolicLink = stat.isSymbolicLink();

    assert(isSymbolicLink === true);
  });

  it(`Provides file bitmask information`, async () => {
    const stat = await pfs.stat('./dir/file.txt');
    assert(stat.bitmask === 0o666);
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.stat('./non-existent.txt');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.stat('./dir/file.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.stat('./dir/file.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#stat()'. Expected Boolean");
    }
  });
});
