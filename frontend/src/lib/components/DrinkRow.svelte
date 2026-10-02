<script lang="ts">
	import type { Drink } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import ProductImage from './ProductImage.svelte';
	import DrinkMeta from './DrinkMeta.svelte';
	import Facts from './Facts.svelte';

	let { drink, rank }: { drink: Drink; rank: number } = $props();
</script>

<article class="flex items-center gap-[clamp(0.75rem,3vw,1rem)] py-4">
	<!-- The rank column costs ~30px; on narrow screens that space goes to the name instead. -->
	<span class="hidden w-5 shrink-0 text-right text-sm font-medium text-ink-muted tabular-nums sm:block">{rank}</span>

	<ProductImage src={drink.image} alt={drink.name} class="size-[clamp(3rem,14vw,4rem)]" />

	<div class="min-w-0 flex-1 space-y-1">
		<h3 class="line-clamp-2 text-[clamp(0.875rem,3.9vw,1rem)] leading-snug font-medium">{drink.name}</h3>
		<Facts class="text-[clamp(0.75rem,3.4vw,0.875rem)] text-ink-muted" items={[drink.store.name, drink.pack]} />
		<DrinkMeta {drink} />
	</div>

	<div class="shrink-0 text-right">
		<p class="text-[clamp(0.875rem,3.9vw,1rem)] font-semibold tracking-tight whitespace-nowrap tabular-nums">
			{formatPrice(drink.pricePerLiter)}<span class="text-xs font-normal text-ink-muted">/l</span>
		</p>
		{#if drink.price !== null}
			<p class="text-[clamp(0.75rem,3.4vw,0.875rem)] whitespace-nowrap text-ink-muted tabular-nums">
				{formatPrice(drink.price)}
			</p>
		{/if}
	</div>
</article>
