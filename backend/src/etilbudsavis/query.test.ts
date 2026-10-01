import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultBeerQuery, encodeOffersRequest } from './query.ts';

test('default beer query encodes to the known-good payload', () => {
  assert.deepEqual(encodeOffersRequest(defaultBeerQuery), {
    data: [
      'WyJvZmZlcnMiLHsiYnVzaW5lc3NJZHMiOlsiMTFkZUMiLCIyNjdlMW0iLCI3MWM5MCIsImJkZjVBIiwiODhkZEUiLCI5M2YxMyIsIjliYTUxIiwiN1J3cHc1Il0sImhpZGVVcGNvbWluZyI6ZmFsc2UsInBhZ2luYXRpb24iOnsibGltaXQiOjEwMCwib2Zmc2V0IjowfSwic2VhcmNoVGVybSI6IsO4bCIsInNvcnQiOlsidW5pdF9wcmljZV9hc2MiXSwic291cmNlcyI6WyJwdWJsaWNhdGlvbiJdfV0=',
    ],
  });
});
