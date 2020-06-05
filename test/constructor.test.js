const assert = require('assert');
const PoweredFileSystem = require('..');

describe(`constructor: new PoweredFileSystem(path)`, () => {
  const cwd = process.cwd();

  it(`Throw an exception if first argument is not a string type`, () => {
    try {
      const pfs = new PoweredFileSystem(null);
    }
    catch (err) {
      assert(err instanceof TypeError);
    }
  });

  it('An empty path must match the context of the cwd', () => {
    const pfs = new PoweredFileSystem();
    assert(pfs.pwd === cwd);
  });

  it('Absolute path must match the context of the pwd', () => {
    const pfs = new PoweredFileSystem(__dirname);
    assert(pfs.pwd === __dirname);
  });

  it('The relative path must correspond to the context cwd plus path', () => {
    const pfs = new PoweredFileSystem('./test');
    assert(pfs.pwd === __dirname);
  });
});
