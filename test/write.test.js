const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.write(src, data[, options])`, () => {
  const pfs = new PoweredFileSystem();
  const data = 'some text ...';

  before(() => {
    mockFs({
      dir: mockFs.directory({})
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Write data to a file`, async () => {
    await pfs.write('./dir/file.txt', data);
    const stat = await pfs.stat('./dir/file.txt');

    assert(stat.size === 13);
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.write('./dir/file.txt', data, null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `encoding` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async () => {
    try {
      await pfs.write('./dir/file.txt', data, {
        umask: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'umask' in order '#write()'. Expected Number");
    }
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.write('./dir/file.txt', data, {
        encoding: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'encoding' in order '#write()'. Expected String");
    }
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.write('./dir/file.txt', data, {
        flag: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'flag' in order '#write()'. Expected String");
    }
  });

  it(`Unexpected option 'flag' returns Error`, async () => {
    try {
      await pfs.write('./dir/flagr.txt', data, {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.message.indexOf('ENOENT, no such file or directory') > -1);
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.write('./dir/file.txt', data, {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#write()'. Expected Boolean");
    }
  });
});
