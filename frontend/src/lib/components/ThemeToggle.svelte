<script lang="ts">
	import { parseTheme, THEME_COOKIE, THEME_COOKIE_MAX_AGE } from '#lib/theme.ts';

	// With JS: switch instantly and remember it in the cookie the server reads. Without JS the form posts to /theme.
	const switchTheme = (event: SubmitEvent) => {
		const theme = parseTheme(event.submitter?.getAttribute('value'));
		if (!theme) return;

		event.preventDefault();
		document.documentElement.dataset.theme = theme;
		document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
	};

	const button =
		'size-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-subtle hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none';
</script>

<!-- Both buttons render; CSS shows the one matching the effective theme, which the server can't know when it follows the system. -->
<form method="POST" action="/theme" onsubmit={switchTheme}>
	<button name="theme" value="light" aria-label="Skift til lyst tema" title="Lyst tema" class="hidden dark:grid {button}">
		<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</svg>
	</button>
	<button name="theme" value="dark" aria-label="Skift til mørkt tema" title="Mørkt tema" class="grid dark:hidden {button}">
		<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
		</svg>
	</button>
</form>
