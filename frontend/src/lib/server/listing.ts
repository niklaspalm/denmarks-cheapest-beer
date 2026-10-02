import { error } from '@sveltejs/kit';
import { getListing, type Listing } from 'backend';

/**
 * Shared by the page load and `/api/drinks`, so both filter identically.
 * Reads `?category=` (unknown or out-of-season values fall back to beer) and repeated `?store=` params.
 */
export const loadListing = async (url: URL): Promise<Listing> => {
	const result = await getListing(url.searchParams.get('category'), url.searchParams.getAll('store'));
	if (!result.ok) {
		console.error('Upstream fetch failed', result.error);
		error(502, 'Kunne ikke hente tilbud fra eTilbudsavis');
	}

	return result.value;
};
