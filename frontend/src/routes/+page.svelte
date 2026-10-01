<script lang="ts">
	import BeerRow from '#lib/components/BeerRow.svelte';
	import FeaturedBeer from '#lib/components/FeaturedBeer.svelte';
	import StoreFilter from '#lib/components/StoreFilter.svelte';

	let { data } = $props();

	const featured = $derived(data.beers[0]);
	const rest = $derived(data.beers.slice(1));
</script>

<svelte:head>
	<title>Danmarks billigste øl</title>
	<meta name="description" content="Ugens billigste øl i danske supermarkeder, sorteret efter literpris." />
</svelte:head>

<header class="sticky top-0 z-10 border-b border-line bg-page/80 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-2xl items-center gap-2.5 px-4">
		<svg viewBox="0 0 37 28" class="h-4 w-auto rounded-[2px]" aria-hidden="true">
			<rect width="37" height="28" fill="var(--color-dannebrog-600)" />
			<path d="M12 0h4v28h-4zM0 12h37v4H0z" fill="#fff" />
		</svg>
		<span class="font-semibold tracking-tight">Billigste øl</span>
		<span class="ml-auto text-sm text-ink-muted tabular-nums">{data.beers.length} tilbud</span>
	</div>
</header>

<main class="mx-auto max-w-2xl px-4 pt-[clamp(1.5rem,7vw,2.5rem)] pb-16">
	<h1 class="text-[clamp(1.625rem,7.5vw,2.25rem)] leading-tight font-semibold tracking-tight text-balance">Ugens billigste øl i Danmark</h1>
	<p class="mt-2 text-[clamp(0.875rem,4vw,1rem)] text-pretty text-ink-muted">Alle supermarkedstilbud, sorteret efter literpris.</p>

	<div class="mt-[clamp(1.25rem,6vw,2rem)]">
		<StoreFilter stores={data.stores} selected={data.selectedStores} resultCount={data.beers.length} />
	</div>

	{#if featured}
		<section class="mt-6">
			<FeaturedBeer beer={featured} />
		</section>

		{#if rest.length > 0}
			<section class="mt-10">
				<h2 class="text-sm font-medium text-ink-muted">Flere tilbud</h2>
				<ol class="mt-2 divide-y divide-line">
					{#each rest as beer, index (beer.id)}
						<li><BeerRow {beer} rank={index + 2} /></li>
					{/each}
				</ol>
			</section>
		{/if}
	{:else}
		<p class="mt-8 rounded-3xl border border-dashed border-line p-10 text-center text-ink-muted">
			Ingen øltilbud lige nu.
		</p>
	{/if}

	<footer class="mt-16 text-center text-xs text-ink-muted">
		Data fra eTilbudsavis · opdateres hver halve time. Tjek altid butikkens egen avis.
	</footer>
</main>
