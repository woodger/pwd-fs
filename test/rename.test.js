const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.rename(src, use[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Rename file`, async function() {
    await pfs.rename('./dir/file.txt', './dir/newname.txt');
    let exist = await pfs.test('./dir/newname.txt');

    assert(exist);
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.rename('./non-existent.txt', './newname.txt').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.rename('./dir/file.txt', './dir/newname.txt', null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.rename('./dir/file.txt', './dir/newname.txt', {
        resolve: null
      });
    });
  });
});
