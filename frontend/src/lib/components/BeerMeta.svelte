<script lang="ts">
	import type { Beer } from 'backend';
	import { formatValidity } from '#lib/format.ts';
	import Facts from './Facts.svelte';

	let { beer }: { beer: Beer } = $props();

	const pantLabel = { included: 'Inkl. pant', excluded: '+ pant', unknown: null } as const;
</script>

<!-- Only the deposit and purchase limit get the brand color, since they change what you actually pay. -->
{#snippet pant()}<span class="font-medium text-brand-ink">{pantLabel[beer.pant]}</span>{/snippet}
{#snippet limit()}<span class="font-medium text-brand-ink">Max {beer.maxQuantity}</span>{/snippet}

<Facts
	class="text-xs text-ink-muted"
	items={[
		pantLabel[beer.pant] ? pant : null,
		beer.maxQuantity ? limit : null,
		formatValidity(beer.validFrom, beer.validUntil)
	]}
/>
