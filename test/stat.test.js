const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.stat(src[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Provides information about a is file`, async function() {
    let stat = await pfs.stat('./dir/file.txt');
    assert(stat.isFile());
  });

  it(`Provides information about the owner of the file`, async function() {
    let stat = await pfs.stat('./dir/file.txt');
    assert(stat.uid === process.getuid());
  });

  it(`Provides file bitmask information`, async function() {
    let stat = await pfs.stat('./dir/file.txt');
    assert(stat.bitmask === 0o666);
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.stat('./non-existent.txt').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.stat('./dir/file.txt', null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, function() {
    assert.throws(() => {
      pfs.stat('./dir/file.txt', {
        resolve: null
      });
    });
  });
});
