const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.symlink(src, use [, options])`, () => {
  const pfs = new PoweredFileSystem();

  before(() => {
    mockFs({
      'dir/file.txt': 'some text ...'
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Create symlink`, async () => {
    await pfs.symlink('./dir/file.txt', './dir/link.txt');
    const info = await pfs.stat('./dir/link.txt');
    const isSymbolicLink = info.isSymbolicLink();

    assert(isSymbolicLink === true);
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.symlink('./non-existent.txt', './dir/link.txt');
    }
    catch (err) {
      assert(err.message.indexOf('EEXIST, file already exists') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.symlink('./dir/file.txt', './dir/link.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `resolve` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.symlink('./dir/file.txt', './dir/link.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#symlink()'. Expected Boolean");
    }
  });
});
