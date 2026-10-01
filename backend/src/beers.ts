import type { Offer } from './etilbudsavis/schema.ts';

export type LiterOffer = Offer & { baseUnit: 'liter'; unitPrice: number };

const isPricedPerLiter = (offer: Offer): offer is LiterOffer =>
  offer.baseUnit === 'liter' && offer.unitPrice !== null;

/** Keeps only offers priced per liter, cheapest first. */
export const cheapestPerLiter = (offers: readonly Offer[]): LiterOffer[] =>
  offers.filter(isPricedPerLiter).sort((a, b) => a.unitPrice - b.unitPrice);

export type PantStatus = 'included' | 'excluded' | 'unknown';

/** UI-facing shape: only what an offer card needs, so the client payload stays small. */
export interface Beer {
  id: string;
  name: string;
  store: { id: string; name: string; logo: string | null };
  image: string | null;
  price: number;
  pricePerLiter: number;
  pack: string | null;
  pant: PantStatus;
  maxQuantity: number | null;
  validFrom: string;
  validUntil: string;
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

export const toBeer = (offer: LiterOffer): Beer => ({
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
});
