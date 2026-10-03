<script lang="ts">
	import type { Drink } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import ProductImage from './ProductImage.svelte';
	import DrinkMeta from './DrinkMeta.svelte';
	import DrinkName from './DrinkName.svelte';
	import Facts from './Facts.svelte';
	import PricePerLiter from './PricePerLiter.svelte';
	import StoreLogo from './StoreLogo.svelte';
	import WebshopButton from './WebshopButton.svelte';

	let { drink }: { drink: Drink } = $props();
</script>

{#snippet store()}
	<span class="inline-flex items-center gap-1.5">
		<StoreLogo name={drink.store.name} logo={drink.store.logo} class="size-[1.35em]" />{drink.store.name}
	</span>
{/snippet}

<article
	class="flex items-center gap-[clamp(0.875rem,4vw,1.5rem)] rounded-3xl bg-surface p-[clamp(1rem,4.5vw,1.5rem)] ring-1 ring-line"
>
	<ProductImage src={drink.image} alt={drink.name} class="size-[clamp(5rem,26vw,10rem)]" />

	<div class="min-w-0 flex-1 space-y-[clamp(0.5rem,2.5vw,0.75rem)]">
		<p class="text-[clamp(0.625rem,2.8vw,0.75rem)] font-semibold tracking-wider text-brand uppercase">
			Billigst lige nu
		</p>

		<PricePerLiter price={drink.pricePerLiter} size="lg" />

		<div class="space-y-1">
			<h2 class="text-[clamp(1rem,4.5vw,1.125rem)] leading-snug font-medium"><DrinkName text={drink.name} /></h2>
			<Facts
				class="text-sm text-ink-muted"
				items={[store, drink.pack, drink.price === null ? null : formatPrice(drink.price)]}
			/>
		</div>

		<DrinkMeta {drink} />
		{#if drink.webshopLink}
			<WebshopButton href={drink.webshopLink} drinkName={drink.name} storeName={drink.store.name} size="md" />
		{/if}
	</div>
</article>
