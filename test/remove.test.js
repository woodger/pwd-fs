const assert = require('assert');
const mockFs = require('mock-fs');
const FileSystem = require('..');

describe(`pfs.remove(src [, options])`, () => {
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
        mode: 0004,
        items: {
          'mock.txt': '',
          'file.txt': ''
        }
      }),
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Removal a directory with a file`, async () => {
    await pfs.remove('./dir');
    const exist = await pfs.test('./dir');

    assert(exist === false);
  });

  it(`Search permission is denied on a component of the path prefix`, async () => {
    try {
      await pfs.remove('./dev');
    }
    catch (err) {
      assert(err.message.indexOf('EACCES, permission denied') > -1);
    }
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.remove('./non-existent.txt');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.remove('./dir/file.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.remove('./dir/file.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#remove()'. Expected Boolean");
    }
  });
});
