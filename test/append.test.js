const assert = require('assert');
const mock = require('mock-fs');
const FileSystem = require('..');



describe(`pfs.append(src, data[, options])`, function() {
  const pfs = new FileSystem();
  const data = 'more text ...';

  before(function() {
    mock({
      'file.txt': 'some text ...'
    });
  });

  after(function() {
    mock.restore();
  });

  it(`Write file`, async function() {
    await pfs.append('./file.txt', data);
    let stat = await pfs.stat('./file.txt');

    assert.strictEqual(stat.size, 26);
  });

  it(`Throw an exception if the option argument is not a object`, function() {
    assert.throws(() => {
      pfs.append('./file.txt', data, null);
    });
  });

  it(`Option 'umask' must be a 'number' type, else throw`, async function() {
    assert.throws(() => {
      pfs.append('./file.txt', data, {
        umask: null
      });
    });
  });

  it(`Option 'encoding' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.append('./file.txt', data, {
        encoding: null
      });
    });
  });

  it(`Option 'flag' must be a 'string' type, else throw`, async function() {
    assert.throws(() => {
      pfs.append('./file.txt', data, {
        flag: null
      });
    });
  });

  it(`Unexpected option 'flag' returns Error`, function(done) {
    pfs.append('./file.txt', data, {
      flag: 'r'
    }).catch(() => {
      done();
    });
  });

  it(`Option 'resolve' must be a 'boolean' type, else throw`, async function() {
    assert.throws(() => {
      pfs.append('./file.txt', data, {
        resolve: null
      });
    });
  });
});
