<script lang="ts">
	import type { Beer } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import BeerImage from './BeerImage.svelte';
	import BeerMeta from './BeerMeta.svelte';
	import Facts from './Facts.svelte';

	let { beer, rank }: { beer: Beer; rank: number } = $props();
</script>

<article class="flex items-center gap-[clamp(0.75rem,3vw,1rem)] py-4">
	<!-- The rank column costs ~30px; on narrow screens that space goes to the name instead. -->
	<span class="hidden w-5 shrink-0 text-right text-sm font-medium text-ink-muted tabular-nums sm:block">{rank}</span>

	<BeerImage src={beer.image} alt={beer.name} class="size-[clamp(3rem,14vw,4rem)]" />

	<div class="min-w-0 flex-1 space-y-1">
		<h3 class="line-clamp-2 text-[clamp(0.875rem,3.9vw,1rem)] leading-snug font-medium">{beer.name}</h3>
		<Facts class="text-[clamp(0.75rem,3.4vw,0.875rem)] text-ink-muted" items={[beer.store.name, beer.pack]} />
		<BeerMeta {beer} />
	</div>

	<div class="shrink-0 text-right">
		<p class="text-[clamp(0.875rem,3.9vw,1rem)] font-semibold tracking-tight whitespace-nowrap tabular-nums">
			{formatPrice(beer.pricePerLiter)}<span class="text-xs font-normal text-ink-muted">/l</span>
		</p>
		<p class="text-[clamp(0.75rem,3.4vw,0.875rem)] whitespace-nowrap text-ink-muted tabular-nums">
			{formatPrice(beer.price)}
		</p>
	</div>
</article>
