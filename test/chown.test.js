const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.chown(src, uid, gid[, options])`, function() {
  const pfs = new FileSystem();
  const uid = process.getuid();
  const gid = process.getgid();

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

  it(`Changes the permissions of a file`, async function() {
    await pfs.chown('./dir/file.txt', uid + 1, gid + 1);
    let stat = await pfs.stat('./dir/file.txt');

    assert(stat.uid === uid + 1);
    assert(stat.gid === gid + 1);
  });

  it(`Changes the permissions of a directory`, async function() {
    await pfs.chown('./dir', uid + 1, gid + 1);
    let stat = await pfs.stat('./dir');

    assert(stat.uid === uid + 1);
    assert(stat.gid === gid + 1);
  });

  it(`Search permission is denied on a component of the path prefix`, function(done) {
    pfs.chown('./dev', 0, 0).catch(() => {
      done();
    });
  });

  it(`To a non-existent resource to return an Error`, function(done) {
    pfs.chown('./non-existent.txt', uid, gid).catch(() => {
      done();
    });
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.chown('./dir/file.txt', uid, gid, null);
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.chown('./dir/file.txt', uid, gid, {
        resolve: null
      });
    });
  });
});
