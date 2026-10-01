import { loadBeerListing } from '#lib/server/beers.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => loadBeerListing(url);
