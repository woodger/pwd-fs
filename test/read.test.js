const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.read(src[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Read file`, async function() {
    let content = await pfs.read('./dir/file.txt');
    assert.strictEqual(content, 'some text ...');
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.read('./non-existent.txt').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.read('./dir/file.txt', null);
    });
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.read('./dir/file.txt', {
        encoding: null
      });
    });
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.read('./dir/file.txt', {
        flag: null
      });
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.read('./dir/file.txt', {
        resolve: null
      });
    });
  });
});
