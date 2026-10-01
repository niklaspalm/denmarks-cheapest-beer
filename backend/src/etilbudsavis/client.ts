import { fetchAllPages } from '../paginate.ts';
import { err, ok, type Result } from '../result.ts';
import { encodeOffersRequest, type OffersQuery } from './query.ts';
import { OffersResponseSchema, type Offer } from './schema.ts';

const ENDPOINT = 'https://etilbudsavis.dk/';
const TIMEOUT_MS = 10_000;

export type FetchOffersError =
  | { kind: 'network'; message: string }
  | { kind: 'http'; status: number }
  | { kind: 'invalid_response'; message: string };

export const fetchOffers = async (query: OffersQuery): Promise<Result<Offer[], FetchOffersError>> => {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(encodeOffersRequest(query)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    return err({ kind: 'network', message: cause instanceof Error ? cause.message : String(cause) });
  }

  if (!response.ok) return err({ kind: 'http', status: response.status });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return err({ kind: 'invalid_response', message: 'Body is not valid JSON' });
  }

  const parsed = OffersResponseSchema.safeParse(body);
  if (!parsed.success) return err({ kind: 'invalid_response', message: parsed.error.message });

  return ok(parsed.data.value.data);
};

/** Pages through every result for `query`, using its `pagination.limit` as the page size. */
export const fetchAllOffers = async (query: OffersQuery): Promise<Result<Offer[], FetchOffersError>> => {
  const { limit } = query.pagination;
  const result = await fetchAllPages(
    (offset) => fetchOffers({ ...query, pagination: { limit, offset } }),
    limit,
  );
  if (!result.ok) return result;

  // An offer can shift between pages if the catalogue changes mid-crawl; keep the first copy.
  return ok([...new Map(result.value.map((offer) => [offer.publicId, offer])).values()]);
};
