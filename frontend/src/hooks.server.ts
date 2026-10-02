import type { Handle } from '@sveltejs/kit/hooks';
import { parseTheme, THEME_COOKIE } from '#lib/theme.ts';

/** Renders the pinned theme into <html> on the server, so the page never flashes the wrong theme. */
export const handle: Handle = ({ event, resolve }) => {
	const theme = parseTheme(event.cookies.get(THEME_COOKIE));

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%app.theme%', theme ? `data-theme="${theme}"` : '')
	});
};
