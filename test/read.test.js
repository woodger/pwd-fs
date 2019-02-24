const assert = require('assert');
const mockFs = require('mock-fs');
const FileSystem = require('..');

describe(`pfs.read(src [, options])`, () => {
  const pfs = new FileSystem();

  before(() => {
    mockFs({
      'dir/file.txt': 'some text ...'
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Read file`, async () => {
    const content = await pfs.read('./dir/file.txt');
    assert(content === 'some text ...');
  });

  it(`To a non-existent resource to return an Error`, async () => {
    try {
      await pfs.read('./non-existent.txt');
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.read('./dir/file.txt', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `encoding` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.read('./dir/file.txt', {
        encoding: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'encoding' in order '#read()'. Expected String");
    }
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.read('./dir/file.txt', {
        flag: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'flag' in order '#read()'. Expected String");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.read('./dir/file.txt', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#read()'. Expected Boolean");
    }
  });
});
