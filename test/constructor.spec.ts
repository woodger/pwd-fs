import assert from 'node:assert';
import { PoweredFileSystem } from '../src';

describe('#constructor: new PoweredFileSystem(pwd?)', () => {
  it('Positive: An empty path must match the context of the cwd', () => {
    const { pwd } = new PoweredFileSystem();
    assert(pwd === process.cwd());
  });


  it('Positive: Absolute path must match the context of the pwd', () => {
    const { pwd } = new PoweredFileSystem(__dirname);
    assert(pwd === __dirname);
  });
});
