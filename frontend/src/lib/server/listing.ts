import { error } from '@sveltejs/kit';
import { availableCategories, DEFAULT_CATEGORY, findCategory, getCheapestDrinks, type Drink } from 'backend';

export interface Store {
	id: string;
	name: string;
	logo: string | null;
	offerCount: number;
	cheapest: { name: string; pricePerLiter: number };
}

export interface CategoryOption {
	id: string;
	label: string;
}

export interface Listing {
	category: CategoryOption;
	categories: CategoryOption[];
	drinks: Drink[];
	/** Stores with offers in this category, ordered by their cheapest drink, cheapest first. */
	stores: Store[];
	selectedStores: string[];
}

/** `drinks` arrive sorted by price per liter, so the first drink seen per store is its cheapest. */
const summarizeStores = (drinks: readonly Drink[]): Store[] => {
	const stores = new Map<string, Store>();

	for (const drink of drinks) {
		const existing = stores.get(drink.store.id);
		if (existing) {
			existing.offerCount++;
			continue;
		}
		stores.set(drink.store.id, {
			...drink.store,
			offerCount: 1,
			cheapest: { name: drink.name, pricePerLiter: drink.pricePerLiter }
		});
	}

	return [...stores.values()];
};

/**
 * Shared by the page load and `/api/drinks`, so both filter identically.
 * Reads `?category=` (unknown or out-of-season values fall back to beer) and repeated `?store=` params.
 */
export const loadListing = async (url: URL): Promise<Listing> => {
	const category = findCategory(url.searchParams.get('category')) ?? findCategory(DEFAULT_CATEGORY);
	if (!category) error(500, 'Ukendt kategori');

	const result = await getCheapestDrinks(category.id);
	if (!result.ok) {
		console.error('Upstream fetch failed', category.id, result.error);
		error(502, 'Kunne ikke hente tilbud fra eTilbudsavis');
	}

	const stores = summarizeStores(result.value);
	// Store ids carry over between categories; ones without offers in this category are dropped.
	const requested = new Set(url.searchParams.getAll('store'));
	const selectedStores = stores.filter((store) => requested.has(store.id)).map((store) => store.id);

	return {
		category: { id: category.id, label: category.label },
		categories: availableCategories().map(({ id, label }) => ({ id, label })),
		drinks:
			selectedStores.length > 0 ? result.value.filter((drink) => selectedStores.includes(drink.store.id)) : result.value,
		stores,
		selectedStores
	};
};
