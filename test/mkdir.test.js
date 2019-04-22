const os = require('os');
const assert = require('assert');
const mockFs = require('mock-fs');
const FileSystem = require('..');

describe(`pfs.mkdir(src [, options])`, () => {
  const pfs = new FileSystem();
  const tmpdir = os.tmpdir();

  before(() => {
    mockFs({
      'dir/file.txt': 'some text ...'
    });
  });

  after(() => {
    mockFs.restore();
  });

  it(`Create directories in the working directory`, async () => {
    await pfs.mkdir('./dir/041ab08b/test');
    const exists = await pfs.test('./dir/041ab08b/test');

    assert(exists);
  });

  it(`Should work fine with the existing directory`, async () => {
    await pfs.mkdir('./dir/041ab08b');
  });

  it(`Create directories in the tmp directory`, async () => {
    const src = `${tmpdir}/041ab08b`;

    await pfs.mkdir(src);
    const exists = await pfs.test(src);

    assert(exists === true);
  });

  it(`Throw an exception if the option argument is not a object`, async () => {
    try {
      await pfs.mkdir('./dir', null);
    }
    catch (err) {
      assert(err.message === "Cannot destructure property `umask` of 'undefined' or 'null'.");
    }
  });

  it(`Trying to create a directory in the file will return an Error`, async () => {
    try {
      await pfs.mkdir('./dir/file.txt/non-existent');
    }
    catch (err) {
      assert(err.message === 'item.getItem is not a function');
    }
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async () => {
    try {
      await pfs.mkdir('./dir', {
        umask: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'umask' in order '#mkdir()'. Expected Number");
    }
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async () => {
    try {
      await pfs.mkdir('./dir', {
        resolve: null
      });
    }
    catch (err) {
      assert(err.message === "Invalid value 'resolve' in order '#mkdir()'. Expected Boolean");
    }
  });

  it(`Test optimization of the current working directory`, async () => {
    await pfs.mkdir('.');
  });
});
