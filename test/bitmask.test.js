const assert = require('assert');
const FileSystem = require('..');



describe(`FileSystem.bitmask(mode)`, function() {
  const bitmask = (a) => {
    return FileSystem.bitmask(a);
  };

  it(`Throw an exception if the argument is not a 'number' type`, function() {
    assert.throws(() => {
      bitmask(null);
    });
  });

  it(`Calculate mask from mode`, async function() {
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
