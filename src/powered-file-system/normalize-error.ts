export function normalizeError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}
