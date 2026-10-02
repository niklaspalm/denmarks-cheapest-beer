/** A theme the user pinned with the toggle. No cookie means "follow the system". */
export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const parseTheme = (value: unknown): Theme | null => (value === 'light' || value === 'dark' ? value : null);
