/**
 * eTilbudsavis' RPC endpoint expects `{ data: [base64(JSON.stringify([method, params]))] }`.
 * We keep the params as a typed object and only encode at the edge.
 */

export const BUSINESS_IDS = {
  letKoeb: 'f6f54',
  rema1000: '11deC',
  meny: '267e1m',
  minKoebmand: '603dfL',
  spar: '88ddE',
  lidl: '71c90',
  foetex: 'bdf5A',
  bilka: '93f13',
  netto: '9ba51',
  woltMarket: 'i7NdvM',
  nemlig: '7Rwpw5',
} as const;

export interface OffersQuery {
  businessIds: readonly string[];
  hideUpcoming: boolean;
  pagination: { limit: number; offset: number };
  searchTerm: string;
  sort: readonly ('unit_price_asc' | 'price_asc')[];
  sources: readonly 'publication'[];
}

export const createOffersQuery = (searchTerm: string): OffersQuery => ({
  businessIds: Object.values(BUSINESS_IDS),
  hideUpcoming: false,
  // Also the page size when paging through all results.
  pagination: { limit: 100, offset: 0 },
  searchTerm,
  sort: ['unit_price_asc'],
  sources: ['publication'],
});

export const encodeOffersRequest = (query: OffersQuery): { data: [string] } => ({
  data: [Buffer.from(JSON.stringify(['offers', query]), 'utf8').toString('base64')],
});
