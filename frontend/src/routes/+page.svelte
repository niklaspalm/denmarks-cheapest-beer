<script lang="ts">
	import CategoryPicker from '#lib/components/CategoryPicker.svelte';
	import DrinkRow from '#lib/components/DrinkRow.svelte';
	import FeaturedDrink from '#lib/components/FeaturedDrink.svelte';
	import StoreFilter from '#lib/components/StoreFilter.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';

	let { data } = $props();

	const featured = $derived(data.drinks[0]);
	const rest = $derived(data.drinks.slice(1));
	const categoryName = $derived(data.category.label.toLowerCase());
</script>

<svelte:head>
	<title>Bedste tilbud på {categoryName} · Literavisen</title>
	<meta
		name="description"
		content="Literavisen samler ugens tilbudsaviser og viser ugens bedste tilbud på {categoryName}, sorteret efter literpris."
	/>
</svelte:head>

<header class="sticky top-0 z-10 border-b border-line bg-page/85 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-2xl items-center gap-2.5 px-4">
		<a href="/" class="flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none">
			<svg viewBox="0 0 37 28" class="h-4 w-auto rounded-[2px]" aria-hidden="true">
				<rect width="37" height="28" fill="var(--color-dannebrog-600)" />
				<path d="M12 0h4v28h-4zM0 12h37v4H0z" fill="#fff" />
			</svg>
			<span class="font-semibold tracking-tight">Literavisen</span>
		</a>
		<div class="ml-auto -mr-2"><ThemeToggle /></div>
	</div>
	<div class="mx-auto max-w-2xl">
		<CategoryPicker categories={data.categories} active={data.category.id} selectedStores={data.selectedStores} />
	</div>
</header>

<main class="mx-auto max-w-2xl px-4 pt-[clamp(1.25rem,6vw,2rem)] pb-16">
	<h1 class="text-[clamp(1.5rem,6.5vw,2rem)] leading-tight font-semibold tracking-tight">
		Bedste tilbud på {categoryName}
	</h1>
	<!-- Meta text and store filter share one row at every width; the text shrinks and wraps before the pill does. -->
	<div class="mt-2 flex items-center justify-between gap-3">
		<p class="min-w-0 text-[clamp(0.6875rem,3.3vw,0.875rem)] text-pretty text-ink-muted">
			<span class="tabular-nums">{data.drinks.length}</span> tilbud denne uge · sorteret efter literpris
		</p>
		<div class="max-w-[55%] shrink-0">
			<StoreFilter
				category={data.category.id}
				stores={data.stores}
				selected={data.selectedStores}
				resultCount={data.drinks.length}
			/>
		</div>
	</div>

	{#if featured}
		<section class="mt-6">
			<FeaturedDrink drink={featured} />
		</section>

		{#if rest.length > 0}
			<section class="mt-10">
				<h2 class="text-sm font-medium text-ink-muted">Flere tilbud</h2>
				<ol class="mt-2 divide-y divide-line">
					{#each rest as drink, index (drink.id)}
						<li><DrinkRow {drink} rank={index + 2} /></li>
					{/each}
				</ol>
			</section>
		{/if}
	{:else}
		<p class="mt-8 rounded-3xl border border-dashed border-line p-10 text-center text-ink-muted">
			Ingen tilbud på {categoryName} lige nu.
		</p>
	{/if}

	<footer class="mt-16 text-center text-xs text-ink-muted">
		Data fra eTilbudsavis · opdateres hver halve time. Tjek altid butikkens egen avis.
	</footer>
</main>
