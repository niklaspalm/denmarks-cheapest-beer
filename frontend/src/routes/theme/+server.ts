import { error, redirect } from '@sveltejs/kit';
import { parseTheme, THEME_COOKIE, THEME_COOKIE_MAX_AGE } from '#lib/theme.ts';
import type { RequestHandler } from './$types';

/** No-JS fallback for the theme toggle; with JS the toggle sets the cookie itself and never posts here. */
export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const theme = parseTheme((await request.formData()).get('theme'));
	if (!theme) error(400, 'Ugyldigt tema');

	cookies.set(THEME_COOKIE, theme, { path: '/', maxAge: THEME_COOKIE_MAX_AGE, httpOnly: false, sameSite: 'lax' });

	// Send the user back to the page they toggled on, but only within this site.
	const referer = request.headers.get('referer');
	const back = referer && new URL(referer).origin === url.origin ? new URL(referer) : null;
	redirect(303, back ? `${back.pathname}${back.search}` : '/');
};
