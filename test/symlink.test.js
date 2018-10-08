const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.symlink(src, use[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      'dir/file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Create symlink`, async function() {
    await pfs.symlink('./dir/file.txt', './dir/link.txt');
    let info = await pfs.stat('./dir/link.txt');

    assert(info.isSymbolicLink());
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.symlink('./non-existent.txt', './dir/link.txt').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.symlink('./dir/file.txt', './dir/link.txt', null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.symlink('./dir/file.txt', './dir/link.txt', {
        resolve: null
      });
    });
  });
});
