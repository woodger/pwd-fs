const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.test(src[, options])`, () => {
  const pfs = new PoweredFileSystem();

  before(() => {
    mockFs({
      'dir/file.txt': ''
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Present working directory exists`, async () => {
    const exists = await pfs.test('.');
    assert(exists === true);
  });

  it(`Directory exists`, async () =>  {
    const exists = await pfs.test('./dir');
    assert(exists === true);
  });

  it(`Whether the file exists on the relative path`, async () => {
    const exists = await pfs.test('./dir/file.txt');
    assert(exists === true);
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.test('./dir/file.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `flag` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.test('./dir/file.txt', {
        flag: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'flag' in order '#test()'. Expected String");
    }
  });

  it(`An unknown flag should throw an exception`, async () => {
    try {
      await pfs.test('./dir/file.txt', {
        flag: 'u'
      });
    }
    catch (err) {
      assert(err.message === "Unknown file test flag: u");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.test('./dir/file.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#test()'. Expected Boolean");
    }
  });

  it(`A non-existent file must return false`, async () => {
    const exists = await pfs.test('./non-existent-file.txt');
    assert(exists === false);
  });
});
