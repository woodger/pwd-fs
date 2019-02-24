const assert = require('assert');
const FileSystem = require('..');

const cwd = process.cwd();

describe(`constructor: new FileSystem(path)`, () => {
  it('An empty path must match the context of the cwd', () => {
    const pfs = new FileSystem();
    assert(pfs.pwd === cwd);
  });

  it('Absolute path must match the context of the pwd', () => {
    const pfs = new FileSystem(__dirname);
    assert(pfs.pwd === __dirname);
  });

  it('The relative path must correspond to the context cwd plus path', () => {
    const pfs = new FileSystem('./test');
    assert(pfs.pwd === __dirname);
  });
});
