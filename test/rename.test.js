const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.rename(src, use [, options])`, () => {
  const pfs = new PoweredFileSystem();

  before(() => {
    mockFs({
      'dir/file.txt': 'some text ...'
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Rename file`, async () => {
    await pfs.rename('./dir/file.txt', './dir/newname.txt');
    const exist = await pfs.test('./dir/newname.txt');

    assert(exist === true);
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.rename('./non-existent.txt', './newname.txt');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.rename('./dir/file.txt', './dir/newname.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.rename('./dir/file.txt', './dir/newname.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#rename()'. Expected Boolean");
    }
  });
});
