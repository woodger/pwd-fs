const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.stat(src[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      dir: mock.directory({
        items: {
          symlink: mock.symlink({
            path: 'file.txt'
          }),
          'file.txt': 'some text ...'
        }
      }),
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Provides information about a is file`, async function() {
    let stat = await pfs.stat('./dir/file.txt');
    assert(stat.isFile() && stat.size === 13);
  });

  it(`Provides information about the symlink`, async function() {
    let stat = await pfs.stat('./dir/symlink');
    assert(stat.isSymbolicLink());
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
