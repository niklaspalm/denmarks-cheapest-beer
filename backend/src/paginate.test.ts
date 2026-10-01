import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchAllPages } from './paginate.ts';
import { err, ok } from './result.ts';

const source = Array.from({ length: 25 }, (_, i) => i);

test('collects every page and stops on a short page', async () => {
  const offsets: number[] = [];
  const result = await fetchAllPages(async (offset) => {
    offsets.push(offset);
    return ok(source.slice(offset, offset + 10));
  }, 10);

  assert.deepEqual(result, ok(source));
  assert.deepEqual(offsets, [0, 10, 20]);
});

test('stops on an empty page when the total is an exact multiple', async () => {
  const offsets: number[] = [];
  const result = await fetchAllPages(async (offset) => {
    offsets.push(offset);
    return ok(source.slice(0, 20).slice(offset, offset + 10));
  }, 10);

  assert.equal(result.ok && result.value.length, 20);
  assert.deepEqual(offsets, [0, 10, 20]);
});

test('returns the first error instead of partial data', async () => {
  const result = await fetchAllPages(async (offset) => (offset === 10 ? err('boom') : ok(source.slice(0, 10))), 10);

  assert.deepEqual(result, err('boom'));
});

test('caps the number of pages', async () => {
  let calls = 0;
  await fetchAllPages(async () => {
    calls++;
    return ok(source.slice(0, 10));
  }, 10, 3);

  assert.equal(calls, 3);
});
