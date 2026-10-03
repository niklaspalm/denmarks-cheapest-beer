<script lang="ts">
	let {
		href,
		drinkName,
		storeName,
		size = 'sm'
	}: { href: string; drinkName: string; storeName: string; size?: 'sm' | 'md' } = $props();
</script>

<!-- External shop link: new tab, and noopener/noreferrer so the shop gets no handle on (or referrer from) our page. -->
<a
	{href}
	target="_blank"
	rel="noopener noreferrer nofollow"
	aria-label="Køb {drinkName} online hos {storeName} (åbner i en ny fane)"
	class="inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap text-ink-muted ring-1 ring-line-strong transition-colors hover:bg-subtle hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none {size ===
	'md'
		? 'px-[15px] py-[7px] text-[13px]'
		: 'px-[9px] py-[3px] text-[11px]'}"
>
	Køb online
	<svg viewBox="0 0 16 16" class="size-[1.1em]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M6 4h6v6M12 4 4.5 11.5" />
	</svg>
</a>
