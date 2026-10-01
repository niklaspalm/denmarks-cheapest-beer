import { cheapestPerLiter, toBeer, type Beer } from './beers.ts';
import { cacheResult } from './cache.ts';
import { fetchAllOffers, type FetchOffersError } from './etilbudsavis/client.ts';
import { defaultBeerQuery } from './etilbudsavis/query.ts';
import type { Result } from './result.ts';

export type { Beer, PantStatus } from './beers.ts';
export type { FetchOffersError } from './etilbudsavis/client.ts';
export type { Result } from './result.ts';

const CACHE_TTL_MS = 30 * 60 * 1000;

const loadCheapestBeers = async (): Promise<Result<Beer[], FetchOffersError>> => {
  const result = await fetchAllOffers(defaultBeerQuery);
  if (!result.ok) return result;

  return { ok: true, value: cheapestPerLiter(result.value).map(toBeer) };
};

/** Current beer offers priced per liter, cheapest first. Cached in memory for 30 minutes. */
export const getCheapestBeers = cacheResult(loadCheapestBeers, CACHE_TTL_MS);
