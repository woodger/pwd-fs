const assert = require('assert');
const {describe, it} = require('mocha');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.write(src, data[, options])`, function() {
  const pfs = new FileSystem();
  const data = 'some text ...';

  before(function() {
    mock({
      dir: mock.directory({})
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Write data to a file`, async function() {
    await pfs.write('./dir/file.txt', data);
    let stat = await pfs.stat('./dir/file.txt');

    assert.strictEqual(stat.size, 13);
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.write('./dir/file.txt', data, null);
    });
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async function() {
    assert.throws(() => {
      pfs.write('./dir/file.txt', data, {
        umask: null
      });
    });
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.write('./dir/file.txt', data, {
        encoding: null
      });
    });
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.write('./dir/file.txt', data, {
        flag: null
      });
    });
  });

  it(`Unexpected option 'flag' returns Error`, function(done) {
    pfs.write('./dir/flagr.txt', data, {
      flag: 'r'
    }).catch(() => {
      done();
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.write('./dir/file.txt', data, {
        resolve: null
      });
    });
  });
});
