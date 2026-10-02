<script lang="ts">
	import type { Drink } from 'backend';
	import { formatPrice } from '#lib/format.ts';
	import ProductImage from './ProductImage.svelte';
	import DrinkMeta from './DrinkMeta.svelte';
	import Facts from './Facts.svelte';

	let { drink }: { drink: Drink } = $props();
</script>

<article
	class="flex items-center gap-[clamp(0.875rem,4vw,1.5rem)] rounded-3xl bg-surface p-[clamp(1rem,4.5vw,1.5rem)] ring-1 ring-line"
>
	<ProductImage src={drink.image} alt={drink.name} class="size-[clamp(5rem,26vw,10rem)]" />

	<div class="min-w-0 flex-1 space-y-[clamp(0.5rem,2.5vw,0.75rem)]">
		<p class="text-[clamp(0.625rem,2.8vw,0.75rem)] font-semibold tracking-wider text-brand uppercase">
			Billigst lige nu
		</p>

		<p class="flex flex-wrap items-baseline gap-x-1.5">
			<span class="text-[clamp(1.875rem,10vw,3rem)] leading-none font-semibold tracking-tighter tabular-nums">
				{formatPrice(drink.pricePerLiter)}
			</span>
			<span class="text-[clamp(0.875rem,3.5vw,1.125rem)] whitespace-nowrap text-ink-muted">pr. liter</span>
		</p>

		<div class="space-y-1">
			<h2 class="text-[clamp(1rem,4.5vw,1.125rem)] leading-snug font-medium">{drink.name}</h2>
			<Facts class="text-sm text-ink-muted" items={[drink.store.name, drink.pack, drink.price === null ? null : formatPrice(drink.price)]} />
		</div>

		<DrinkMeta {drink} />
	</div>
</article>
