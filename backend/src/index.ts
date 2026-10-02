import { cacheResult } from './cache.ts';
import { CATEGORIES, type CategoryId } from './categories.ts';
import { cheapestPerLiter, toDrink, type Drink } from './drinks.ts';
import { fetchAllOffers, type FetchOffersError } from './etilbudsavis/client.ts';
import { createOffersQuery } from './etilbudsavis/query.ts';
import type { Result } from './result.ts';

export { availableCategories, CATEGORIES, DEFAULT_CATEGORY, findCategory, type Category, type CategoryId } from './categories.ts';
export type { Drink, PantStatus } from './drinks.ts';
export type { FetchOffersError } from './etilbudsavis/client.ts';
export type { Result } from './result.ts';

const CACHE_TTL_MS = 30 * 60 * 1000;

type DrinksResult = Result<Drink[], FetchOffersError>;

const loadCheapestDrinks = async (searchTerm: string): Promise<DrinksResult> => {
  const result = await fetchAllOffers(createOffersQuery(searchTerm));
  if (!result.ok) return result;

  return { ok: true, value: cheapestPerLiter(result.value).map(toDrink) };
};

// One cache per category, so switching category doesn't evict the others.
const cachedByCategory = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, cacheResult(() => loadCheapestDrinks(category.searchTerm), CACHE_TTL_MS)]),
) as Record<CategoryId, () => Promise<DrinksResult>>;

/** Current offers in `category` priced per liter, cheapest first. Cached in memory for 30 minutes per category. */
export const getCheapestDrinks = (category: CategoryId): Promise<DrinksResult> => cachedByCategory[category]();
