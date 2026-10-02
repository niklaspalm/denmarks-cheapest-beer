import { loadListing } from '#lib/server/listing.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => loadListing(url);
