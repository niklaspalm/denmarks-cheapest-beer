import { cacheResult } from './cache.ts';
import { availableCategories, CATEGORIES, DEFAULT_CATEGORY, findCategory, type CategoryId } from './categories.ts';
import { cheapestPerLiter, toDrink, type Drink } from './drinks.ts';
import { fetchAllOffers, type FetchOffersError } from './etilbudsavis/client.ts';
import { createOffersQuery } from './etilbudsavis/query.ts';
import { buildListing, type Listing } from './listing.ts';
import { err, ok, type Result } from './result.ts';

export { availableCategories, CATEGORIES, DEFAULT_CATEGORY, findCategory, type Category, type CategoryId } from './categories.ts';
export type { Drink, PantStatus } from './drinks.ts';
export type { FetchOffersError } from './etilbudsavis/client.ts';
export type { CategoryCount, Listing, StoreSummary } from './listing.ts';
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

/**
 * Everything the page needs for one category: its offers in the selected stores, plus a count for every
 * category so empty ones can be disabled. Unknown or out-of-season categories fall back to beer.
 * Only a failure in the requested category is an error; other categories just get no count.
 */
export const getListing = async (
  categoryId: string | null,
  requestedStores: readonly string[],
  now: Date = new Date(),
): Promise<Result<Listing, FetchOffersError>> => {
  const categories = availableCategories(now);
  const active = findCategory(categoryId, now) ?? findCategory(DEFAULT_CATEGORY, now) ?? CATEGORIES[0];

  // All categories in parallel; each is cached, so this is only slow right after a cache expires.
  const results = await Promise.all(categories.map((category) => getCheapestDrinks(category.id)));
  const all = categories.map((category, index) => {
    const result = results[index];
    return { category, drinks: result?.ok ? result.value : null };
  });

  const activeResult = results[categories.indexOf(active)] ?? (await getCheapestDrinks(active.id));
  if (!activeResult.ok) return err(activeResult.error);

  return ok(buildListing({ active: { category: active, drinks: activeResult.value }, all, requestedStores }));
};
