const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.copy(src, dir[, options])`, function() {
  const pfs = new FileSystem();

  before(function() {
    mock({
      dir: mock.directory({
        items: {
          dir: mock.directory(),
          'file.txt': ''
        }
      }),
      dev: mock.directory({
        items: {
          'mock.txt': mock.file({
            mode: 0004
          }),
          'file.txt': ''
        }
      })
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Copying a directory with a file`, async function() {
    await pfs.copy('./dir', './dev');

    let dstat = await pfs.stat('./dev/dir');
    let fstat = await pfs.stat('./dev/dir/file.txt');

    assert(dstat.bitmask === 0o777);
    assert(fstat.bitmask === 0o666);
  });

  it(`Search permission is denied on a component of the path prefix`, function(done) {
    pfs.copy('./dev', './dir').catch(() => {
      done();
    });
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.copy('./non-existent.txt', '.').catch(() => {
      done();
    });
  });

  it(`An attempt to copy to an existing resource should return an Error`, function(done) {
    pfs.copy('./dir', '.').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.copy('./dir/file.txt', '.', null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.copy('./dir/file.txt', '.', {
        resolve: null
      });
    });
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async function() {
    assert.throws(() => {
      pfs.copy('./dir/file.txt', '.', {
        umask: null
      });
    });
  });
});
