<script lang="ts">
	import { formatPrice } from '#lib/format.ts';

	let { price, size = 'sm', class: className = '' }: { price: number; size?: 'sm' | 'lg'; class?: string } = $props();
</script>

<!-- The number people compare on, so it gets its own tinted box wherever it appears. -->
{#if size === 'lg'}
	<p
		class="inline-flex flex-wrap items-baseline gap-x-1.5 rounded-2xl bg-brand-soft {className} px-[clamp(0.625rem,3vw,1rem)] py-[clamp(0.375rem,1.5vw,0.625rem)] text-brand-ink"
	>
		<span class="text-[clamp(1.75rem,9vw,2.75rem)] leading-none font-semibold tracking-tighter tabular-nums">
			{formatPrice(price)}
		</span>
		<span class="text-[clamp(0.8125rem,3.3vw,1rem)] font-medium whitespace-nowrap opacity-80">pr. liter</span>
	</p>
{:else}
	<p
		class="inline-flex items-baseline rounded-lg bg-brand-soft px-2 py-1 {className} text-[clamp(0.8125rem,3.7vw,0.9375rem)] font-semibold tracking-tight whitespace-nowrap text-brand-ink tabular-nums"
	>
		{formatPrice(price)}<span class="text-[0.75em] font-bold">/l</span>
	</p>
{/if}
