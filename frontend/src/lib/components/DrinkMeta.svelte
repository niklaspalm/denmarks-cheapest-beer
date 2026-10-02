<script lang="ts">
	import type { Drink } from 'backend';
	import { formatValidity } from '#lib/format.ts';
	import Facts from './Facts.svelte';

	let { drink }: { drink: Drink } = $props();

	const pantLabel = { included: 'Inkl. pant', excluded: '+ pant', unknown: null } as const;
</script>

<!-- Only the deposit and purchase limit get the brand color, since they change what you actually pay. -->
{#snippet pant()}<span class="font-medium text-brand-ink">{pantLabel[drink.pant]}</span>{/snippet}
{#snippet limit()}<span class="font-medium text-brand-ink">Max {drink.maxQuantity}</span>{/snippet}

<Facts
	class="text-xs text-ink-muted"
	items={[
		pantLabel[drink.pant] ? pant : null,
		drink.maxQuantity ? limit : null,
		formatValidity(drink.validFrom, drink.validUntil)
	]}
/>
