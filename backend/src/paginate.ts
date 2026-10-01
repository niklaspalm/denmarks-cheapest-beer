import { ok, type Result } from './result.ts';

/**
 * Requests pages at increasing offsets until one comes back empty or short.
 * `maxPages` guards against an upstream that never stops returning data.
 */
export const fetchAllPages = async <T, E>(
  loadPage: (offset: number) => Promise<Result<T[], E>>,
  pageSize: number,
  maxPages = 20,
): Promise<Result<T[], E>> => {
  const items: T[] = [];

  for (let page = 0; page < maxPages; page++) {
    const result = await loadPage(page * pageSize);
    if (!result.ok) return result;

    items.push(...result.value);
    if (result.value.length < pageSize) break;
  }

  return ok(items);
};
