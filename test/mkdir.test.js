const os = require('os');
const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.mkdir(src[, options])`, function() {
  const pfs = new FileSystem();
  const tmpdir = os.tmpdir();

  before(function() {
    mock({
      'dir/file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Create directories in the working directory`, async function() {
    await pfs.mkdir('./dir/041ab08b/test');
    let exists = await pfs.test('./dir/041ab08b/test');

    assert(exists);
  });

  it(`Should work fine with the existing directory`, async function() {
    await pfs.mkdir('./dir/041ab08b');
  });

  /*
  it(`Creating more than 1000 directories`, async function() {
    let dir = './dir';

    for (let i = 0; i < 1001; i++) {
      dir += `/${i}`;
    }

    await pfs.mkdir(dir);
    let exists = await pfs.test(dir);

    assert(exists);
  });
  */

  it(`Create directories in the tmp directory`, async function() {
    await pfs.mkdir(`${tmpdir}/041ab08b`);
    let list = await pfs.readdir(tmpdir);

    assert(list.includes('041ab08b'));
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.mkdir('./dir', null);
    });
  });

  it(`Trying to create a directory in the file will return an Error`, function(done) {
    pfs.mkdir('./dir/file.txt/non-existent').catch(() => {
      done();
    });
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async function() {
    assert.throws(() => {
      pfs.mkdir('./dir', {
        umask: null
      });
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.mkdir('./dir', {
        resolve: null
      });
    });
  });
});
