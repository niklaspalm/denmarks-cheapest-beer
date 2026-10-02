<script lang="ts">
	let { src, alt, class: className = '' }: { src: string | null; alt: string; class?: string } = $props();
</script>

<div class="grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-line {className}">
	{#if src}
		<img {src} {alt} loading="lazy" class="size-full object-contain p-1.5" />
	{:else}
		<span class="text-2xl" aria-hidden="true">🍾</span>
	{/if}
</div>
