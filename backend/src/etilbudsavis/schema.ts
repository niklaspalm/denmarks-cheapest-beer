import { z } from 'zod';

/** Shapes observed from `POST https://etilbudsavis.dk/` with an `offers` query. Unknown keys are stripped. */

export const BusinessSchema = z.object({
  publicId: z.string(),
  name: z.string(),
  slugs: z.array(z.string()),
  countryCode: z.string(),
  positiveLogoImage: z.string().nullable(),
  negativeLogoImage: z.string().nullable(),
  positiveLogoMark: z.string().nullable(),
  negativeLogoMark: z.string().nullable(),
  isStatic: z.boolean(),
  isEnabled: z.boolean(),
  primaryCategoryId: z.string().nullable(),
  primaryColor: z.string().nullable(),
  website: z.string().nullable(),
  isWebstore: z.boolean(),
});

export const OfferSchema = z.object({
  publicId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  currencyCode: z.string(),
  /** Null on some multi-buy wine offers that only state a price per liter. */
  price: z.number().nullable(),
  /** Price per `baseUnit`, e.g. DKK per liter. */
  unitPrice: z.number().nullable(),
  /** Observed: 'liter' | 'piece' | 'kilogram'. Left open so a new unit upstream doesn't fail the whole response. */
  baseUnit: z.string().nullable(),
  unitSymbol: z.string().nullable(),
  unitSizeFrom: z.number().nullable(),
  unitSizeTo: z.number().nullable(),
  pieceCountFrom: z.number().nullable(),
  pieceCountTo: z.number().nullable(),
  pieceCountMin: z.number().nullable(),
  pieceCountMax: z.number().nullable(),
  pieceCountGet: z.number().nullable(),
  pieceCountGetFor: z.number().nullable(),
  savings: z.number().nullable(),
  relativeSavings: z.number().nullable(),
  fromPrice: z.number().nullable(),
  membershipPrice: z.number().nullable(),
  membershipRelativeSavings: z.number().nullable(),
  appPrice: z.number().nullable(),
  webshopLink: z.string().nullable(),
  image: z.string().nullable(),
  imageLarge: z.string().nullable(),
  validFrom: z.string(),
  validUntil: z.string(),
  visibleFrom: z.string(),
  displayValidUntil: z.boolean(),
  business: BusinessSchema,
  businessPublicId: z.string(),
  publicationPublicId: z.string().nullable(),
  publicationCoverImage: z.string().nullable(),
  departmentSlug: z.string().nullable(),
});

export const OffersResponseSchema = z.object({
  key: z.string(),
  status: z.literal('success'),
  value: z.object({
    // Validated one by one in the client, so a single odd offer can't fail a whole category.
    data: z.array(z.unknown()),
    metadata: z.object({
      pagination: z.object({ limit: z.number(), offset: z.number() }),
    }),
  }),
});

export type Business = z.infer<typeof BusinessSchema>;
export type Offer = z.infer<typeof OfferSchema>;
export type OffersResponse = z.infer<typeof OffersResponseSchema>;
