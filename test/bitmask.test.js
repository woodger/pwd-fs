const assert = require('assert');
const PoweredFileSystem = require('..');

describe('PoweredFileSystem.bitmask(mode)', () => {
  const bitmask = (value) => {
    return PoweredFileSystem.bitmask(value);
  };

  it(`Throw an exception if the argument is not a 'number' type`, () => {
    try {
      bitmask(null);
    }
    catch (err) {
      assert(err instanceof TypeError);
    }
  });

  it('Calculate mask from mode', () => {
    assert(bitmask(33024) === 0o400); // (r--------)
    assert(bitmask(33152) === 0o600); // (rw-------)
    assert(bitmask(33216) === 0o700); // (rwx------)

    assert(bitmask(32800) === 0o040); // (---r-----)
    assert(bitmask(32816) === 0o060); // (---rw----)
    assert(bitmask(32824) === 0o070); // (---rwx---)

    assert(bitmask(32772) === 0o004); // (------r--)
    assert(bitmask(32774) === 0o006); // (------rw-)
    assert(bitmask(32775) === 0o007); // (------rwx)
  });
});
