const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe(`pfs.append(src, data [, options])`, () => {
  const pfs = new PoweredFileSystem();
  const content = 'more text ...';

  before(() => {
    mockFs({
      'file.txt': 'some text ...'
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Write file`, async () => {
    await pfs.append('./file.txt', content);
    const stat = await pfs.stat('./file.txt');

    assert(stat.size === 26);
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.append('./file.txt', content, null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `encoding` of 'undefined' or 'null'.");
    }
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async () => {
    try {
      await pfs.append('./file.txt', content, {
        umask: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'umask' in order '#append()'. Expected Number");
    }
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.append('./file.txt', content, {
        encoding: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'encoding' in order '#append()'. Expected String");
    }
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async () => {
    try {
      await pfs.append('./file.txt', content, {
        flag: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'flag' in order '#append()'. Expected String");
    }
  });

  it(`Unexpected option 'flag' returns Error`, async () => {
    try {
      await pfs.append('./file.txt', content, {
        flag: 'r'
      });
    }
    catch (err) {
      assert(err.message === "EBADF, bad file descriptor");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.append('./file.txt', content, {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#append()'. Expected Boolean");
    }
  });
});
