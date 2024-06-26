import assert from 'node:assert';
import { bitmask } from '../src';

describe('static bitmask(mode: number)', () => {
  it('Positive: Calculate bitmask', () => {
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

  it(`Negative: Throw an exception if the argument is 'null' type`, () => {
    assert.throws(() => {
      // @ts-ignore
      bitmask(null);
    });
  });
});
