<script lang="ts">
	import type { Drink } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import ProductImage from './ProductImage.svelte';
	import DrinkMeta from './DrinkMeta.svelte';
	import Facts from './Facts.svelte';
	import PricePerLiter from './PricePerLiter.svelte';
	import StoreLogo from './StoreLogo.svelte';
	import WebshopButton from './WebshopButton.svelte';

	let { drink, rank }: { drink: Drink; rank: number } = $props();
</script>

{#snippet store()}
	<span class="inline-flex items-center gap-1.5">
		<StoreLogo name={drink.store.name} logo={drink.store.logo} class="size-[1.25em]" />{drink.store.name}
	</span>
{/snippet}

<article class="flex items-center gap-[clamp(0.75rem,3vw,1rem)] py-4">
	<!-- The rank column costs ~30px; on narrow screens that space goes to the name instead. -->
	<span class="hidden w-5 shrink-0 text-right text-sm font-medium text-ink-muted tabular-nums sm:block">{rank}</span>

	<ProductImage src={drink.image} alt={drink.name} class="size-[clamp(3rem,14vw,4rem)]" />

	<div class="min-w-0 flex-1 space-y-1">
		<h3 class="line-clamp-2 text-[clamp(0.875rem,3.9vw,1rem)] leading-snug font-medium">{drink.name}</h3>
		<Facts class="text-[clamp(0.75rem,3.4vw,0.875rem)] text-ink-muted" items={[store, drink.pack]} />
		<DrinkMeta {drink} />
		{#if drink.webshopLink}
			<div class="pt-1">
				<WebshopButton href={drink.webshopLink} drinkName={drink.name} storeName={drink.store.name} />
			</div>
		{/if}
	</div>

	<div class="flex shrink-0 flex-col items-end gap-1">
		<PricePerLiter price={drink.pricePerLiter} />
		{#if drink.price !== null}
			<p class="text-[clamp(0.75rem,3.4vw,0.875rem)] whitespace-nowrap text-ink-muted tabular-nums">
				{formatPrice(drink.price)}
			</p>
		{/if}
	</div>
</article>
