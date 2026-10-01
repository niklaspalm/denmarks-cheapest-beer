import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cacheResult } from './cache.ts';
import { err, ok, type Result } from './result.ts';

const setup = (responses: Result<string, string>[]) => {
  let time = 0;
  let calls = 0;
  const cached = cacheResult(
    async () => responses[calls++] ?? ok('fallback'),
    1_000,
    () => time,
  );
  return { cached, advance: (ms: number) => (time += ms), calls: () => calls };
};

test('serves cached value until the TTL expires', async () => {
  const { cached, advance, calls } = setup([ok('first'), ok('second')]);

  assert.deepEqual(await cached(), ok('first'));
  advance(999);
  assert.deepEqual(await cached(), ok('first'));
  assert.equal(calls(), 1);

  advance(1);
  assert.deepEqual(await cached(), ok('second'));
  assert.equal(calls(), 2);
});

test('does not cache failures', async () => {
  const { cached, calls } = setup([err('boom'), ok('recovered')]);

  assert.deepEqual(await cached(), err('boom'));
  assert.deepEqual(await cached(), ok('recovered'));
  assert.equal(calls(), 2);
});

test('concurrent callers share one upstream request', async () => {
  const { cached, calls } = setup([ok('only')]);

  const results = await Promise.all([cached(), cached(), cached()]);
  assert.deepEqual(results, [ok('only'), ok('only'), ok('only')]);
  assert.equal(calls(), 1);
});
