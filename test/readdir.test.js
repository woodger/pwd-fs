const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.readdir(src[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': ''
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Read directory`, async function() {
    let list = await pfs.readdir('./dir');

    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0], 'file.txt');
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.readdir('./dir', null);
    });
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.readdir('./non-existent').catch(() => {
      done();
    });
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.readdir('./dir', {
        encoding: null
      });
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.readdir('./dir', {
        resolve: null
      });
    });
  });
});
