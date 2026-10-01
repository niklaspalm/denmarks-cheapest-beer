<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Dot-separated facts that wrap between items, never inside one, and never leave a dangling dot. */
	type Fact = string | Snippet;

	let { items, class: className = '' }: { items: (Fact | null | undefined)[]; class?: string } = $props();

	const isPresent = (item: Fact | null | undefined): item is Fact => item !== null && item !== undefined && item !== '';
	const visible = $derived(items.filter(isPresent));
</script>

<p class="flex flex-wrap items-center gap-x-1.5 {className}">
	{#each visible as item, index (index)}
		<span class="whitespace-nowrap">
			{#if index > 0}<span aria-hidden="true" class="mr-1.5">·</span>{/if}{#if typeof item === 'string'}{item}{:else}{@render item()}{/if}
		</span>
	{/each}
</p>
