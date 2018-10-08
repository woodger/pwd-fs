const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.remove(src[, options])`, function() {
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
        mode: 0004,
        items: {
          'mock.txt': '',
          'file.txt': ''
        }
      }),
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Removal a directory with a file`, async function() {
    await pfs.remove('./dir');
    let exist = await pfs.test('./dir');

    assert.strictEqual(exist, false);
  });

  it(`Search permission is denied on a component of the path prefix`, function(done) {
    pfs.remove('./dev').catch(() => {
      done();
    });
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.remove('./non-existent.txt').catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.remove('./dir/file.txt', null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.remove('./dir/file.txt', {
        resolve: null
      });
    });
  });
});
