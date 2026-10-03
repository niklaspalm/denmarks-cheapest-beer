<script lang="ts">
	let { name, logo, class: className = 'size-5' }: { name: string; logo: string | null; class?: string } = $props();
</script>

<!--
	Store logos come in every shape: full-bleed squares (Lidl, Bilka), circles (Netto, nemlig), bare letters on
	transparency (REMA 1000, SPAR) and wide wordmarks (MENY). A fixed white tile with proportional rounding gives them
	all the same footprint, like app icons. The name is always shown next to it, so the image itself is decorative.
-->
<span
	class="inline-grid shrink-0 place-items-center overflow-hidden rounded-[25%] bg-white p-px align-middle ring-1 ring-black/10 {className}"
>
	{#if logo}
		<img src={logo} alt="" loading="lazy" class="size-full object-contain" />
	{:else}
		<span class="text-[0.6em] font-bold text-snow-600" aria-hidden="true">{name.charAt(0)}</span>
	{/if}
</span>
