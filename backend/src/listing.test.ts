import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CATEGORIES, type Category } from './categories.ts';
import type { Drink } from './drinks.ts';
import { buildListing } from './listing.ts';

const category = (id: string): Category => {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`unknown category ${id}`);
  return found;
};

const drink = (id: string, storeId: string, pricePerLiter: number): Drink => ({
  id,
  name: id,
  store: { id: storeId, name: storeId.toUpperCase(), logo: null },
  image: null,
  price: pricePerLiter,
  pricePerLiter,
  pack: null,
  pant: 'unknown',
  maxQuantity: null,
  validFrom: '2026-10-01T00:00:00Z',
  validUntil: '2026-10-08T00:00:00Z',
  webshopLink: null,
});

// Netto has beer only; Lidl has beer and red wine; gin failed to load.
const ol = [drink('harboe', 'netto', 9), drink('tuborg', 'lidl', 12), drink('royal', 'netto', 13)];
const rodvin = [drink('tempranillo', 'lidl', 30)];
const all = [
  { category: category('ol'), drinks: ol },
  { category: category('rodvin'), drinks: rodvin },
  { category: category('gin'), drinks: null },
];

test('counts every category across all stores when none are selected', () => {
  const listing = buildListing({ active: { category: category('ol'), drinks: ol }, all, requestedStores: [] });

  assert.deepEqual(
    listing.categories.map((c) => [c.id, c.count]),
    [['ol', 3], ['rodvin', 1], ['gin', null]],
  );
  assert.equal(listing.drinks.length, 3);
});

test('counts only the selected stores, so empty categories can be disabled', () => {
  const listing = buildListing({ active: { category: category('ol'), drinks: ol }, all, requestedStores: ['netto'] });

  assert.deepEqual(
    listing.categories.map((c) => [c.id, c.count]),
    [['ol', 2], ['rodvin', 0], ['gin', null]],
  );
  assert.deepEqual(listing.drinks.map((d) => d.id), ['harboe', 'royal']);
});

test('keeps a selected store in a category where it has no offers, and lists it for unselecting', () => {
  const listing = buildListing({ active: { category: category('rodvin'), drinks: rodvin }, all, requestedStores: ['netto', 'lidl'] });

  assert.deepEqual(listing.selectedStores, ['netto', 'lidl']);
  assert.deepEqual(listing.drinks.map((d) => d.id), ['tempranillo']);
  assert.deepEqual(
    listing.stores.map((s) => [s.id, s.offerCount, s.cheapest?.pricePerLiter ?? null]),
    [['lidl', 1, 30], ['netto', 0, null]],
  );
});

test('drops unknown and duplicate store ids', () => {
  const listing = buildListing({ active: { category: category('ol'), drinks: ol }, all, requestedStores: ['lidl', 'nope', 'lidl'] });

  assert.deepEqual(listing.selectedStores, ['lidl']);
});

test('summarizes stores by their cheapest offer, cheapest store first', () => {
  const listing = buildListing({ active: { category: category('ol'), drinks: ol }, all, requestedStores: [] });

  assert.deepEqual(
    listing.stores.map((s) => [s.id, s.offerCount, s.cheapest?.name]),
    [['netto', 2, 'harboe'], ['lidl', 1, 'tuborg']],
  );
});
