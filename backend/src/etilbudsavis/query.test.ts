import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BUSINESS_IDS, createOffersQuery, encodeOffersRequest } from './query.ts';

const decode = (payload: string): unknown => JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));

test('encodes the query as base64 JSON of ["offers", query], keeping non-ASCII search terms intact', () => {
  const query = createOffersQuery('rødvin');
  const [payload] = encodeOffersRequest(query).data;

  assert.deepEqual(decode(payload), ['offers', query]);
});

test('queries every configured store', () => {
  assert.deepEqual(createOffersQuery('øl').businessIds, Object.values(BUSINESS_IDS));
  assert.equal(Object.keys(BUSINESS_IDS).length, 11);
});

test('matches the payload format eTilbudsavis\' own site sends', () => {
  // Captured from etilbudsavis.dk before more stores were added; only the business ids differ now.
  const captured =
    'WyJvZmZlcnMiLHsiYnVzaW5lc3NJZHMiOlsiMTFkZUMiLCIyNjdlMW0iLCI3MWM5MCIsImJkZjVBIiwiODhkZEUiLCI5M2YxMyIsIjliYTUxIiwiN1J3cHc1Il0sImhpZGVVcGNvbWluZyI6ZmFsc2UsInBhZ2luYXRpb24iOnsibGltaXQiOjEwMCwib2Zmc2V0IjowfSwic2VhcmNoVGVybSI6IsO4bCIsInNvcnQiOlsidW5pdF9wcmljZV9hc2MiXSwic291cmNlcyI6WyJwdWJsaWNhdGlvbiJdfV0=';
  const businessIds = ['11deC', '267e1m', '71c90', 'bdf5A', '88ddE', '93f13', '9ba51', '7Rwpw5'];

  assert.deepEqual(encodeOffersRequest({ ...createOffersQuery('øl'), businessIds }).data, [captured]);
});
