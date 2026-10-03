import type { Offer } from './etilbudsavis/schema.ts';

export type LiterOffer = Offer & { baseUnit: 'liter'; unitPrice: number };

// Free-text search also matches food ("rom" → rum truffles, "whisky" → whisky-glazed pork), so require the drinks department.
const isDrinkPricedPerLiter = (offer: Offer): offer is LiterOffer =>
  offer.departmentSlug === 'beverages' && offer.baseUnit === 'liter' && offer.unitPrice !== null;

/** Keeps only drinks priced per liter, cheapest first. */
export const cheapestPerLiter = (offers: readonly Offer[]): LiterOffer[] =>
  offers.filter(isDrinkPricedPerLiter).sort((a, b) => a.unitPrice - b.unitPrice);

export type PantStatus = 'included' | 'excluded' | 'unknown';

/** UI-facing shape: only what an offer card needs, so the client payload stays small. */
export interface Drink {
  id: string;
  name: string;
  store: { id: string; name: string; logo: string | null };
  image: string | null;
  /** Null when the store only advertises a price per liter. */
  price: number | null;
  pricePerLiter: number;
  pack: string | null;
  pant: PantStatus;
  maxQuantity: number | null;
  validFrom: string;
  validUntil: string;
  /** Where to buy it online (only some webshops, e.g. Wolt Market and nemlig.com). */
  webshopLink: string | null;
}

// "Ex. pant", "Ekskl. pant", "Ekskl. embl." (emballage) and "+ pant" all mean the deposit is added on top.
const PANT_EXCLUDED = /\b(?:ex|ekskl)\.?\s*(?:pant|embl)|\+\s*pant/i;
const PANT_INCLUDED = /\binkl\.?\s*(?:pant|embl)/i;

export const detectPant = (description: string | null): PantStatus => {
  if (!description) return 'unknown';
  if (PANT_INCLUDED.test(description)) return 'included';
  if (PANT_EXCLUDED.test(description)) return 'excluded';
  return 'unknown';
};

const formatPack = (offer: Offer): string | null => {
  if (offer.unitSizeFrom === null || offer.unitSymbol === null) return null;

  const size = `${offer.unitSizeFrom.toLocaleString('da-DK')} ${offer.unitSymbol}`;
  const { pieceCountFrom: from, pieceCountTo: to } = offer;
  if (from === null || to === null || to <= 1) return size;

  return `${from === to ? from : `${from}–${to}`} × ${size}`;
};

/** Third-party URLs end up in an href, so only plain http(s) links get through (no javascript:, data: etc.). */
export const toExternalUrl = (value: string | null): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

export const toDrink = (offer: LiterOffer): Drink => ({
  id: offer.publicId,
  name: offer.name,
  store: {
    id: offer.business.publicId,
    name: offer.business.name,
    logo: offer.business.positiveLogoMark,
  },
  image: offer.image,
  price: offer.price,
  pricePerLiter: offer.unitPrice,
  pack: formatPack(offer),
  pant: detectPant(offer.description),
  maxQuantity: offer.pieceCountMax,
  validFrom: offer.validFrom,
  validUntil: offer.validUntil,
  webshopLink: toExternalUrl(offer.webshopLink),
});
