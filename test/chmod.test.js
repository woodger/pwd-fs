const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.chmod(src, mode[, options])`, function() {
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
        mode: 0400,
        items: {
          'file.txt': ''
        }
      })
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Changes directory and file permissions`, async function() {
    await pfs.chmod('./dir', 0o744);
    let stat = await pfs.stat('./dir/file.txt');

    assert(stat.bitmask === 0o744);
  });

  it(`Search permission is denied on a component of the path prefix`, function(done) {
    pfs.chmod('./dev', 0, 0).catch(() => {
      done();
    });
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.chmod('./non-existent.txt', 0o744).catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.chmod('./dir/file.txt', 0o744, null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.chmod('./dir/file.txt', 0o744, {
        resolve: null
      });
    });
  });
});
