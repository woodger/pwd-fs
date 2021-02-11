import assert from 'assert';
import PoweredFileSystem  from '../src';

describe('#constructor: new PoweredFileSystem(path)', () => {
  it('Must be backwards compatible with #require', () => {
    assert(require('../src') === PoweredFileSystem);
  });

  it('Throw an exception if first argument is not a string type', () => {
    try {
      // @ts-ignore
      new PoweredFileSystem(null);
    }
    catch (err) {
      assert(err);
    }
  });

  it('An empty path must match the context of the cwd', () => {
    const {pwd} = new PoweredFileSystem();
    assert(pwd === process.cwd());
  });

  it('Absolute path must match the context of the pwd', () => {
    const {pwd} = new PoweredFileSystem(__dirname);
    assert(pwd === __dirname);
  });
});
