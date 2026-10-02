<script lang="ts">
	import type { CategoryOption } from '#lib/server/listing.ts';

	let {
		categories,
		active,
		selectedStores
	}: { categories: CategoryOption[]; active: string; selectedStores: string[] } = $props();

	let scroller: HTMLElement;
	// Before hydration we can't measure, so assume the common phone case: more tabs to the right.
	let atStart = $state(true);
	let atEnd = $state(false);

	const measure = () => {
		atStart = scroller.scrollLeft <= 1;
		atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
	};

	$effect(() => {
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(scroller);
		return () => observer.disconnect();
	});

	// Center the active tab, e.g. when landing on "Whisky" at the far end. Centering (not "nearest") keeps it clear of
	// the edge fades, and setting scrollLeft directly never nudges the page's vertical scroll like scrollIntoView can.
	$effect(() => {
		void active;
		const centerActiveTab = () => {
			const tab = scroller.querySelector<HTMLElement>('[aria-current="page"]');
			if (tab) scroller.scrollLeft = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
			measure();
		};
		centerActiveTab();
		// The web font widens the tabs once it loads, so re-center against the final widths.
		void document.fonts.ready.then(centerActiveTab);
	});

	const scrollByPage = (direction: 1 | -1) =>
		scroller.scrollBy({ left: direction * scroller.clientWidth * 0.7, behavior: 'smooth' });

	// Keep the store selection when switching category; the server drops stores without offers there.
	const hrefFor = (categoryId: string) => {
		const params = new URLSearchParams({ category: categoryId });
		for (const store of selectedStores) params.append('store', store);
		return `?${params}`;
	};

	const arrow =
		'absolute inset-y-0 z-10 grid w-12 items-center text-ink-muted transition-opacity duration-200 hover:text-ink';
</script>

<!-- Text tabs with an underline, like a shop's department bar. On narrow screens the row scrolls sideways;
     the edges fade and show a chevron wherever more tabs are hidden. -->
<div class="relative">
	<nav
		bind:this={scroller}
		onscroll={measure}
		aria-label="Kategori"
		class="overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
		style:--fade-start={atStart ? '0px' : '2.5rem'}
		style:--fade-end={atEnd ? '0px' : '2.5rem'}
		style:mask-image="linear-gradient(to right, transparent, #000 var(--fade-start), #000 calc(100% - var(--fade-end)), transparent)"
	>
		<ul class="flex w-max gap-[clamp(1rem,4vw,1.5rem)] px-4">
			{#each categories as category (category.id)}
				{@const isActive = category.id === active}
				<li>
					<a
						href={hrefFor(category.id)}
						aria-current={isActive ? 'page' : undefined}
						data-sveltekit-noscroll
						class="relative block py-3 text-sm whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors {isActive
							? 'font-semibold text-ink after:bg-brand'
							: 'font-medium text-ink-muted after:bg-transparent hover:text-ink'}"
					>
						{category.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Pointer/touch affordance only: keyboard users already reach every tab with Tab. -->
	<button
		type="button"
		tabindex="-1"
		aria-hidden="true"
		onclick={() => scrollByPage(-1)}
		class="left-0 justify-items-start bg-linear-to-r from-page from-45% to-transparent pl-2 {arrow} {atStart ? 'pointer-events-none opacity-0' : 'opacity-100'}"
	>
		<svg viewBox="0 0 20 20" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m12 5-5 5 5 5" />
		</svg>
	</button>
	<button
		type="button"
		tabindex="-1"
		aria-hidden="true"
		onclick={() => scrollByPage(1)}
		class="right-0 justify-items-end bg-linear-to-l from-page from-45% to-transparent pr-2 {arrow} {atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'}"
	>
		<svg viewBox="0 0 20 20" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m8 5 5 5-5 5" />
		</svg>
	</button>
</div>
