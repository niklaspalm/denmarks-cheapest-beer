import assert from 'node:assert/strict';
import { test } from 'node:test';
import { availableCategories, findCategory, isInSeason } from './categories.ts';

const glogg = { id: 'glogg', label: 'Gløgg', searchTerm: 'gløgg', season: { from: { month: 11, day: 17 }, until: { month: 12, day: 30 } } };

test('gløgg season runs Nov 17 through Dec 30, in Danish time', () => {
  // Copenhagen is UTC+1 in winter, so local midnight is 23:00 UTC the day before.
  assert.equal(isInSeason(glogg, new Date('2026-11-16T22:59:59Z')), false, 'Nov 16, 23:59 in Copenhagen');
  assert.equal(isInSeason(glogg, new Date('2026-11-16T23:00:00Z')), true, 'Nov 17, 00:00 in Copenhagen');
  assert.equal(isInSeason(glogg, new Date('2026-12-30T22:59:59Z')), true, 'Dec 30, 23:59 in Copenhagen');
  assert.equal(isInSeason(glogg, new Date('2026-12-30T23:00:00Z')), false, 'Dec 31, 00:00 in Copenhagen');
});

test('seasons can wrap over New Year', () => {
  const wraps = { ...glogg, season: { from: { month: 12, day: 1 }, until: { month: 1, day: 6 } } };

  assert.equal(isInSeason(wraps, new Date('2026-12-15T12:00:00Z')), true);
  assert.equal(isInSeason(wraps, new Date('2027-01-03T12:00:00Z')), true);
  assert.equal(isInSeason(wraps, new Date('2027-02-01T12:00:00Z')), false);
});

test('hides gløgg outside its season and offers it inside', () => {
  const october = new Date('2026-10-02T12:00:00Z');
  const december = new Date('2026-12-10T12:00:00Z');

  assert.equal(availableCategories(october).some((category) => category.id === 'glogg'), false);
  assert.equal(findCategory('glogg', october), undefined);

  assert.equal(availableCategories(december).some((category) => category.id === 'glogg'), true);
  assert.equal(findCategory('glogg', december)?.searchTerm, 'gløgg');
});

test('categories without a season are always available', () => {
  assert.equal(findCategory('ol', new Date('2026-07-01T12:00:00Z'))?.label, 'Øl');
});
