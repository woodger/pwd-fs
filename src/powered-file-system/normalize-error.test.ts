import assert from 'node:assert';
import { describe, it } from 'node:test';
import { normalizeError } from './normalize-error';

describe('normalizeError', () => {
  it('preserves Error instances', () => {
    const reason = new TypeError('fixture failure');

    assert.strictEqual(normalizeError(reason), reason);
  });

  it('converts a non-Error reason to Error', () => {
    const error = normalizeError('fixture failure');

    assert.ok(error instanceof Error);
    assert.strictEqual(error.message, 'fixture failure');
  });
});
