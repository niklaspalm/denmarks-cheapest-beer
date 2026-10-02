import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseOffers } from './client.ts';

const business = {
  publicId: '11deC',
  name: 'REMA 1000',
  slugs: ['REMA-1000'],
  countryCode: 'DK',
  positiveLogoImage: null,
  negativeLogoImage: null,
  positiveLogoMark: null,
  negativeLogoMark: null,
  isStatic: false,
  isEnabled: true,
  primaryCategoryId: 'groceries',
  primaryColor: '#014693',
  website: null,
  isWebstore: false,
};

// Shape of a real offer from the API, trimmed to the fields the schema knows.
const rawOffer = (overrides: Record<string, unknown> = {}) => ({
  publicId: 'abc',
  name: 'Harboe øl',
  description: '33 cl. Ex. pant',
  currencyCode: 'DKK',
  price: 3,
  unitPrice: 9.09,
  baseUnit: 'liter',
  unitSymbol: 'cl',
  unitSizeFrom: 33,
  unitSizeTo: 33,
  pieceCountFrom: 1,
  pieceCountTo: 1,
  pieceCountMin: null,
  pieceCountMax: 72,
  pieceCountGet: null,
  pieceCountGetFor: null,
  savings: null,
  relativeSavings: null,
  fromPrice: null,
  membershipPrice: null,
  membershipRelativeSavings: null,
  appPrice: null,
  webshopLink: null,
  image: null,
  imageLarge: null,
  validFrom: '2026-10-03T22:00:00+0000',
  validUntil: '2026-10-10T21:59:59+0000',
  visibleFrom: '2026-09-30T10:00:00+0000',
  displayValidUntil: true,
  business,
  businessPublicId: '11deC',
  publicationPublicId: null,
  publicationCoverImage: null,
  departmentSlug: 'beverages',
  ...overrides,
});

test('accepts offers with no total price (multi-buy wine deals)', () => {
  const [offer] = parseOffers([rawOffer({ price: null })]);
  assert.equal(offer?.price, null);
});

test('skips malformed offers instead of rejecting the whole page', (t) => {
  const warn = t.mock.method(console, 'warn', () => {});

  const offers = parseOffers([rawOffer({ publicId: 'good' }), rawOffer({ publicId: 'bad', unitPrice: 'cheap' })]);

  assert.deepEqual(
    offers.map((offer) => offer.publicId),
    ['good'],
  );
  assert.equal(warn.mock.callCount(), 1);
});
