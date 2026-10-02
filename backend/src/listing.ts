import type { Category, CategoryId } from './categories.ts';
import type { Drink } from './drinks.ts';

export interface StoreSummary {
  id: string;
  name: string;
  logo: string | null;
  offerCount: number;
  /** Null for a selected store that has no offers in the active category. */
  cheapest: { name: string; pricePerLiter: number } | null;
}

export interface CategoryCount {
  id: CategoryId;
  label: string;
  /** Offers in the selected stores (or all stores); null when that category couldn't be loaded. */
  count: number | null;
}

export interface Listing {
  category: { id: CategoryId; label: string };
  categories: CategoryCount[];
  drinks: Drink[];
  /** Stores with offers in the active category, cheapest first, then selected stores without any. */
  stores: StoreSummary[];
  /** Kept across categories, even where a store has no offers. */
  selectedStores: string[];
}

export interface CategoryDrinks {
  category: Category;
  /** Null when this category's offers couldn't be fetched. */
  drinks: readonly Drink[] | null;
}

/** `drinks` arrive sorted by price per liter, so the first drink seen per store is its cheapest. */
const summarizeStores = (drinks: readonly Drink[]): StoreSummary[] => {
  const stores = new Map<string, StoreSummary>();

  for (const drink of drinks) {
    const existing = stores.get(drink.store.id);
    if (existing) {
      existing.offerCount++;
      continue;
    }
    stores.set(drink.store.id, {
      ...drink.store,
      offerCount: 1,
      cheapest: { name: drink.name, pricePerLiter: drink.pricePerLiter },
    });
  }

  return [...stores.values()];
};

/**
 * Combines every category's offers into what the page shows for `active`.
 * Store ids are validated against stores seen in any category, so unknown ids are dropped but a store
 * stays selected in categories where it has nothing on offer.
 */
export const buildListing = ({
  active,
  all,
  requestedStores,
}: {
  active: { category: Category; drinks: readonly Drink[] };
  all: readonly CategoryDrinks[];
  requestedStores: readonly string[];
}): Listing => {
  const knownStores = new Map<string, Drink['store']>();
  for (const { drinks } of all) for (const drink of drinks ?? []) knownStores.set(drink.store.id, drink.store);

  const selectedStores = [...new Set(requestedStores)].filter((id) => knownStores.has(id));
  const selected = new Set(selectedStores);
  const inSelection = (drink: Drink) => selected.size === 0 || selected.has(drink.store.id);

  const stores = summarizeStores(active.drinks);
  for (const id of selectedStores) {
    const store = knownStores.get(id);
    if (store && !stores.some((summary) => summary.id === id)) stores.push({ ...store, offerCount: 0, cheapest: null });
  }

  return {
    category: { id: active.category.id, label: active.category.label },
    categories: all.map(({ category, drinks }) => ({
      id: category.id,
      label: category.label,
      count: drinks ? drinks.filter(inSelection).length : null,
    })),
    drinks: active.drinks.filter(inSelection),
    stores,
    selectedStores,
  };
};
