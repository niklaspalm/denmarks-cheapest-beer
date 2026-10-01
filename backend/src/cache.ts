import type { Result } from './result.ts';

interface Entry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Caches successful results for `ttlMs`. Failures are never cached, so the next call retries.
 * Concurrent calls share one in-flight request instead of stampeding the upstream.
 */
export const cacheResult = <T, E>(
  load: () => Promise<Result<T, E>>,
  ttlMs: number,
  now: () => number = Date.now,
): (() => Promise<Result<T, E>>) => {
  let entry: Entry<T> | null = null;
  let inFlight: Promise<Result<T, E>> | null = null;

  return () => {
    if (entry && entry.expiresAt > now()) return Promise.resolve({ ok: true, value: entry.value });
    if (inFlight) return inFlight;

    inFlight = load()
      .then((result) => {
        if (result.ok) entry = { value: result.value, expiresAt: now() + ttlMs };
        return result;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  };
};
