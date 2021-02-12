import assert from 'assert';
import FileSystem from '../src';

describe('#constructor: new FileSystem(path)', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src') === FileSystem);
  });

  it('Positive: An empty path must match the context of the cwd', () => {
    const { pwd } = new FileSystem();
    assert(pwd === process.cwd());
  });

  it('Positive: Absolute path must match the context of the pwd', () => {
    const { pwd } = new FileSystem(__dirname);
    assert(pwd === __dirname);
  });

  it('Negative: Throw an exception if first argument is not a string type', () => {
    try {
      // @ts-ignore
      new FileSystem(null);
    }
    catch (err) {
      assert(err);
    }
  });
});
