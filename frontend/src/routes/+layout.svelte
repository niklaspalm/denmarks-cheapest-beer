<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
	import flagFontUrl from 'country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url';

	let { children } = $props();

	// Offer names contain flag emoji (e.g. 🇩🇪). Windows has no flag glyphs and shows the letters "DE" instead.
	// This loads a flags-only font, self-hosted by Vite, but only in browsers that can't draw flags themselves.
	$effect(() => {
		polyfillCountryFlagEmojis('Twemoji Country Flags', flagFontUrl);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
