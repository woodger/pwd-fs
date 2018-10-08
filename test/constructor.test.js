const assert = require('assert');
const FileSystem = require('..');



const cwd = process.cwd();

describe(`constructor: new FileSystem(path)`, function() {
  it('An empty path must match the context of the cwd', function() {
    let pfs = new FileSystem();
    assert.strictEqual(pfs.pwd, cwd);
  });

  it('Absolute path must match the context of the pwd', function() {
    let pfs = new FileSystem(__dirname);
    assert.strictEqual(pfs.pwd, __dirname);
  });

  it('The relative path must correspond to the context cwd plus path', function() {
    let pfs = new FileSystem('./test');
    assert.strictEqual(pfs.pwd, __dirname);
  });
});
