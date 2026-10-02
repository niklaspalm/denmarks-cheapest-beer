/** A recurring yearly window, inclusive on both days, in Danish local time. */
export interface Season {
  from: { month: number; day: number };
  until: { month: number; day: number };
}

interface CategoryDefinition {
  id: string;
  label: string;
  /** What we send to eTilbudsavis' free-text search. */
  searchTerm: string;
  /** Only offered during this window; always offered when absent. */
  season?: Season;
}

export const CATEGORIES = [
  { id: 'ol', label: 'Øl', searchTerm: 'øl' },
  { id: 'glogg', label: 'Gløgg', searchTerm: 'gløgg', season: { from: { month: 11, day: 17 }, until: { month: 12, day: 30 } } },
  { id: 'rodvin', label: 'Rødvin', searchTerm: 'rødvin' },
  { id: 'hvidvin', label: 'Hvidvin', searchTerm: 'hvidvin' },
  { id: 'champagne', label: 'Champagne', searchTerm: 'champagne' },
  { id: 'mousserende', label: 'Mousserende', searchTerm: 'mousserende' },
  { id: 'vodka', label: 'Vodka', searchTerm: 'vodka' },
  { id: 'rom', label: 'Rom', searchTerm: 'rom' },
  { id: 'gin', label: 'Gin', searchTerm: 'gin' },
  // eTilbudsavis returns identical results for "whisky" and "whiskey"; Danish shops use "whisky".
  { id: 'whisky', label: 'Whisky', searchTerm: 'whisky' },
] as const satisfies readonly CategoryDefinition[];

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category['id'];

export const DEFAULT_CATEGORY: CategoryId = 'ol';

const danishDate = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Copenhagen', month: 'numeric', day: 'numeric' });

/** Month and day as a sortable number (Nov 17 → 1117), in Danish local time. */
const danishMonthDay = (date: Date): number => {
  const parts = danishDate.formatToParts(date);
  const part = (type: 'month' | 'day') => Number(parts.find((p) => p.type === type)?.value);
  return part('month') * 100 + part('day');
};

export const isInSeason = (category: CategoryDefinition, now: Date): boolean => {
  if (!category.season) return true;

  const today = danishMonthDay(now);
  const from = category.season.from.month * 100 + category.season.from.day;
  const until = category.season.until.month * 100 + category.season.until.day;

  // A window like Dec 1 → Jan 6 wraps over New Year.
  return from <= until ? today >= from && today <= until : today >= from || today <= until;
};

/** Categories on offer right now; seasonal ones are hidden outside their window. */
export const availableCategories = (now: Date = new Date()): Category[] =>
  CATEGORIES.filter((category) => isInSeason(category, now));

export const findCategory = (id: string | null, now: Date = new Date()): Category | undefined =>
  availableCategories(now).find((category) => category.id === id);
