const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.test(src[, options])`, function() {
  let pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': ''
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Present working directory exists`, async function() {
    let exists = await pfs.test('.');
    assert(exists);
  });

  it(`Directory exists`, async function() {
    let exists = await pfs.test('./dir');
    assert(exists);
  });

  it(`Whether the file exists on the relative path`, async function() {
    let exists = await pfs.test('./dir/file.txt');
    assert(exists);
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.test('./dir/file.txt', null);
    });
  });

  it(`Option 'flag' must be a 'string' type, else throw`, function() {
    assert.throws(() => {
      pfs.test('./dir/file.txt', {
        flag: null
      });
    });
  });

  it(`An unknown flag should throw an exception`, function() {
    assert.throws(() => {
      pfs.test('./dir/file.txt', {
        flag: 'u'
      });
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.test('./dir/file.txt', {
        resolve: null
      });
    });
  });

  it(`A non-existent file must return false`, async function() {
    let exists = await pfs.test('./non-existent-file.txt');
    assert(exists === false);
  });
});
