import assert from 'node:assert';
import { describe, it } from 'node:test';
import { bitmask } from './index';

describe('static bitmask(mode: number)', { concurrency: false }, () => {
  it('Positive: Calculate bitmask', () => {
    assert(bitmask(33024) === 0o400);
    assert(bitmask(33152) === 0o600);
    assert(bitmask(33216) === 0o700);
    assert(bitmask(32800) === 0o040);
    assert(bitmask(32816) === 0o060);
    assert(bitmask(32824) === 0o070);
    assert(bitmask(32772) === 0o004);
    assert(bitmask(32774) === 0o006);
    assert(bitmask(32775) === 0o007);
  });

  it(`Negative: Throw an exception if the argument is 'null' type`, () => {
    assert.throws(() => {
      bitmask(null as unknown as number);
    });
  });
});
