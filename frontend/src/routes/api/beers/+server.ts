import { json } from '@sveltejs/kit';
import { loadBeerListing } from '#lib/server/beers.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => json(await loadBeerListing(url));
