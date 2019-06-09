const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.readdir(src[, options])`, () => {
  const pfs = new PoweredFileSystem();

  before(() => {
    mockFs({
      'dir/file.txt': ''
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Read directory`, async () => {
    const [first] = await pfs.readdir('./dir');
    assert(first === 'file.txt');
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.readdir('./dir', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `encoding` of 'undefined' or 'null'.");
    }
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.readdir('./non-existent');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.readdir('./dir', {
        encoding: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'encoding' in order '#readdir()'. Expected String");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.readdir('./dir', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#readdir()'. Expected Boolean");
    }
  });
});
