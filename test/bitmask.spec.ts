import assert from 'assert';
import FileSystem from '../src';

describe('static bitmask(mode: number)', () => {
  it('Positive: Calculate bitmask', () => {
    assert(FileSystem.bitmask(33024) === 0o400); // (r--------)
    assert(FileSystem.bitmask(33152) === 0o600); // (rw-------)
    assert(FileSystem.bitmask(33216) === 0o700); // (rwx------)
    assert(FileSystem.bitmask(32800) === 0o040); // (---r-----)
    assert(FileSystem.bitmask(32816) === 0o060); // (---rw----)
    assert(FileSystem.bitmask(32824) === 0o070); // (---rwx---)
    assert(FileSystem.bitmask(32772) === 0o004); // (------r--)
    assert(FileSystem.bitmask(32774) === 0o006); // (------rw-)
    assert(FileSystem.bitmask(32775) === 0o007); // (------rwx)
  });

  it(`Negative: Throw an exception if the argument is 'null' type`, () => {
    try {
      // @ts-ignore
      FileSystem.bitmask(null);
    }
    catch (err) {
      assert(err);
    }
  });
});
