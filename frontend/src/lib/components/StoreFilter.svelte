<script lang="ts">
	import type { StoreSummary } from 'backend';
	import PricePerLiter from './PricePerLiter.svelte';
	import DrinkName from './DrinkName.svelte';
	import StoreLogo from './StoreLogo.svelte';

	let {
		category,
		stores,
		selected,
		resultCount
	}: { category: string; stores: StoreSummary[]; selected: string[]; resultCount: number } = $props();

	let dialog: HTMLDialogElement;

	const summary = $derived.by(() => {
		if (selected.length === 0) return 'Alle butikker';
		const names = stores.filter((store) => selected.includes(store.id)).map((store) => store.name);
		return names.length <= 2 ? names.join(', ') : `${names.length} butikker`;
	});

	// `command`/`commandfor` open and close the dialog without JS; these handlers cover browsers without invoker support.
	const open = () => {
		if (!dialog.open) dialog.showModal();
	};
	const close = () => dialog.close();

	// The form fills the dialog, so a click whose target is the dialog itself landed on the backdrop.
	const closeOnBackdrop = (event: MouseEvent) => {
		if (event.target === dialog) close();
	};
</script>

<button
	type="button"
	commandfor="store-filter"
	command="show-modal"
	onclick={open}
	aria-haspopup="dialog"
	class="inline-flex max-w-full items-center gap-2 rounded-full bg-surface py-2 pr-3 pl-3.5 text-sm font-medium ring-1 transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none {selected.length > 0
		? 'ring-brand/50'
		: 'ring-line hover:ring-line-strong'}"
>
	<svg viewBox="0 0 20 20" class="size-4 shrink-0 text-ink-muted" aria-hidden="true">
		<path d="M3.5 6h13M6 10h8M8.5 14h3" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	</svg>
	<span class="truncate">{summary}</span>
	{#if selected.length > 0}
		<span class="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-semibold text-on-brand tabular-nums">
			{selected.length}
		</span>
	{/if}
	<svg viewBox="0 0 20 20" class="size-4 shrink-0 text-ink-muted" aria-hidden="true">
		<path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</button>

<dialog
	bind:this={dialog}
	id="store-filter"
	closedby="any"
	aria-labelledby="store-filter-title"
	onclick={closeOnBackdrop}
	class="store-dialog mx-0 mt-auto mb-0 max-h-[calc(100dvh-1rem)] w-full max-w-none overflow-hidden rounded-t-3xl bg-surface text-ink shadow-2xl ring-1 ring-line backdrop:bg-snow-950/40 backdrop:backdrop-blur-sm sm:m-auto sm:max-h-[min(40rem,calc(100dvh-1rem))] sm:w-[min(28rem,calc(100vw-1rem))] sm:rounded-3xl"
>
	<!-- A plain GET form: works without JS, and with JS each change navigates instantly behind the modal. -->
	<form
		method="GET"
		class="flex max-h-[inherit] flex-col"
		data-sveltekit-keepfocus
		data-sveltekit-noscroll
		data-sveltekit-replacestate
	>
		<input type="hidden" name="category" value={category} />

		<header class="flex items-start gap-3 border-b border-line px-5 pt-5 pb-4">
			<div class="min-w-0 flex-1">
				<h2 id="store-filter-title" class="text-lg font-semibold tracking-tight">Vælg butikker</h2>
				<p class="text-sm text-ink-muted">Sorteret efter kædens billigste tilbud</p>
			</div>
			<button
				type="button"
				commandfor="store-filter"
				command="close"
				onclick={close}
				aria-label="Luk"
				class="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
			>
				<svg viewBox="0 0 20 20" class="size-5" aria-hidden="true">
					<path d="m5.5 5.5 9 9m0-9-9 9" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
				</svg>
			</button>
		</header>

		<!-- The div scrolls, not the fieldset: Chromium won't scroll a fieldset that is a flex item. -->
		<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
			<!-- min-w-0: fieldsets default to min-content width, which would stop long names from truncating. -->
			<fieldset class="min-w-0 px-2 py-2">
				<legend class="sr-only">Butikker</legend>
				{#each stores as store, index (store.id)}
					<label
						class="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-subtle has-checked:bg-brand-soft"
					>
						<input
							type="checkbox"
							name="store"
							value={store.id}
							checked={selected.includes(store.id)}
							onchange={(event) => event.currentTarget.form?.requestSubmit()}
							class="size-4 shrink-0 accent-dannebrog-600"
						/>
						<StoreLogo name={store.name} logo={store.logo} class="size-8" />
						<span class="min-w-0 flex-1">
							<span class="flex items-baseline gap-1.5">
								<span class="truncate text-sm font-medium">{store.name}</span>
								{#if index === 0 && store.cheapest}
									<span class="text-[10px] font-semibold tracking-wider text-brand uppercase">Billigst</span>
								{/if}
							</span>
							{#if store.cheapest}
								<span class="block truncate text-xs text-ink-muted"><DrinkName text={store.cheapest.name} /> · {store.offerCount} tilbud</span>
							{:else}
								<!-- A selected store kept from another category, listed so it can be unselected here. -->
								<span class="block truncate text-xs text-ink-muted">Ingen tilbud i denne kategori</span>
							{/if}
						</span>
						<span class="shrink-0">
							{#if store.cheapest}
								<!-- A checked row is tinted the same as the price box, so the box switches to the surface color there. -->
								<PricePerLiter price={store.cheapest.pricePerLiter} class="group-has-checked:bg-surface" />
							{:else}
								<span class="px-2 text-sm text-ink-muted">–</span>
							{/if}
						</span>
					</label>
				{/each}
			</fieldset>
		</div>

		<footer class="flex items-center gap-3 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
			{#if selected.length > 0}
				<a href="?category={category}" data-sveltekit-noscroll data-sveltekit-keepfocus class="text-sm text-ink-muted hover:text-ink">Ryd valg</a>
			{/if}
			<!-- Without JS this submits the selection; with JS the list is already filtered, so it just closes. -->
			<button
				onclick={close}
				class="ml-auto rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
			>
				Vis {resultCount} tilbud
			</button>
		</footer>
	</form>
</dialog>

<style>
	.store-dialog[open] {
		animation: sheet-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.store-dialog[open]::backdrop {
		animation: fade-in 0.25s ease-out;
	}

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(1.5rem);
		}
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.store-dialog[open],
		.store-dialog[open]::backdrop {
			animation: none;
		}
	}
</style>
