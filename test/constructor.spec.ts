import assert from 'assert';
import PoweredFileSystem from '../src';

describe('#constructor: new PoweredFileSystem(path)', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src') === PoweredFileSystem);
  });

  it('Positive: An empty path must match the context of the cwd', () => {
    const { pwd } = new PoweredFileSystem();
    assert(pwd === process.cwd());
  });

  it('Positive: Absolute path must match the context of the pwd', () => {
    const { pwd } = new PoweredFileSystem(__dirname);
    assert(pwd === __dirname);
  });
});
