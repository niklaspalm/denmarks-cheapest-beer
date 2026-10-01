import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cheapestPerLiter, detectPant } from './beers.ts';
import type { Offer } from './etilbudsavis/schema.ts';

const offer = (name: string, baseUnit: string | null, unitPrice: number | null): Offer =>
  ({ name, baseUnit, unitPrice }) as Offer;

test('keeps only per-liter offers, sorted by unitPrice ascending', () => {
  const result = cheapestPerLiter([
    offer('Tuborg', 'liter', 12.5),
    offer('Oktoberfestbier', 'piece', 189),
    offer('Harboe', 'liter', 9.09),
    offer('Kalvekæber', 'kilogram', 250),
    offer('Unknown', 'liter', null),
  ]);

  assert.deepEqual(
    result.map((o) => o.name),
    ['Harboe', 'Tuborg'],
  );
});

test('detects pant from the phrasings stores actually use', () => {
  const cases: [string | null, ReturnType<typeof detectPant>][] = [
    ['33 cl. Ex. pant Kasse med 24 stk.', 'excluded'],
    ['5 % alc. Ekskl. pant. 50 cl.', 'excluded'],
    ['30x33 cl. fl. Ekskl. embl. Pr. liter 10,61', 'excluded'],
    ['Afhentningspris 30 X 33 CL + PANT', 'excluded'],
    ['18 x 33 cl. +pant.', 'excluded'],
    ['24 x 33 cl. Inkl. pant', 'included'],
    ['Literpris 11,24. Sælges kun i hele rammer.', 'unknown'],
    [null, 'unknown'],
  ];

  for (const [description, expected] of cases) {
    assert.equal(detectPant(description), expected, String(description));
  }
});
