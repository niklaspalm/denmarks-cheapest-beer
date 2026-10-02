import { json } from '@sveltejs/kit';
import { loadListing } from '#lib/server/listing.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => json(await loadListing(url));
