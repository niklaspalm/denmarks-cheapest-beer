import { error } from '@sveltejs/kit';
import { getCheapestBeers, type Beer } from 'backend';

export interface Store {
	id: string;
	name: string;
	logo: string | null;
	offerCount: number;
	cheapest: { name: string; pricePerLiter: number };
}

export interface BeerListing {
	beers: Beer[];
	/** Ordered by each store's cheapest beer, cheapest first. */
	stores: Store[];
	selectedStores: string[];
}

/** `beers` arrive sorted by price per liter, so the first beer seen per store is its cheapest. */
const summarizeStores = (beers: readonly Beer[]): Store[] => {
	const stores = new Map<string, Store>();

	for (const beer of beers) {
		const existing = stores.get(beer.store.id);
		if (existing) {
			existing.offerCount++;
			continue;
		}
		stores.set(beer.store.id, {
			...beer.store,
			offerCount: 1,
			cheapest: { name: beer.name, pricePerLiter: beer.pricePerLiter }
		});
	}

	return [...stores.values()];
};

/** Shared by the page load and `/api/beers`, so both filter identically. Accepts repeated `?store=` params. */
export const loadBeerListing = async (url: URL): Promise<BeerListing> => {
	const result = await getCheapestBeers();
	if (!result.ok) {
		console.error('Upstream fetch failed', result.error);
		error(502, 'Kunne ikke hente tilbud fra eTilbudsavis');
	}

	const stores = summarizeStores(result.value);
	const requested = new Set(url.searchParams.getAll('store'));
	const selectedStores = stores.filter((store) => requested.has(store.id)).map((store) => store.id);

	return {
		beers:
			selectedStores.length > 0
				? result.value.filter((beer) => selectedStores.includes(beer.store.id))
				: result.value,
		stores,
		selectedStores
	};
};
