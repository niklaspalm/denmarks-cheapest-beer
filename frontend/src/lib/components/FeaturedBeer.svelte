<script lang="ts">
	import type { Beer } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import BeerImage from './BeerImage.svelte';
	import BeerMeta from './BeerMeta.svelte';
	import Facts from './Facts.svelte';

	let { beer }: { beer: Beer } = $props();
</script>

<article
	class="flex items-center gap-[clamp(0.875rem,4vw,1.5rem)] rounded-3xl bg-surface p-[clamp(1rem,4.5vw,1.5rem)] ring-1 ring-line"
>
	<BeerImage src={beer.image} alt={beer.name} class="size-[clamp(5rem,26vw,10rem)]" />

	<div class="min-w-0 flex-1 space-y-[clamp(0.5rem,2.5vw,0.75rem)]">
		<p class="text-[clamp(0.625rem,2.8vw,0.75rem)] font-semibold tracking-wider text-brand uppercase">
			Billigst lige nu
		</p>

		<p class="flex flex-wrap items-baseline gap-x-1.5">
			<span class="text-[clamp(1.875rem,10vw,3rem)] leading-none font-semibold tracking-tighter tabular-nums">
				{formatPrice(beer.pricePerLiter)}
			</span>
			<span class="text-[clamp(0.875rem,3.5vw,1.125rem)] whitespace-nowrap text-ink-muted">pr. liter</span>
		</p>

		<div class="space-y-1">
			<h2 class="text-[clamp(1rem,4.5vw,1.125rem)] leading-snug font-medium">{beer.name}</h2>
			<Facts class="text-sm text-ink-muted" items={[beer.store.name, beer.pack, formatPrice(beer.price)]} />
		</div>

		<BeerMeta {beer} />
	</div>
</article>
