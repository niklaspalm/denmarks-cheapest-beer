<script lang="ts">
	let { text }: { text: string } = $props();

	// A flag emoji is a pair of regional-indicator characters. Shops write them flush against the name
	// ("🇩🇪Riesling"), so each flag gets its own span with a little margin, unless a space already follows.
	const FLAG = /(\p{Regional_Indicator}{2})/u;

	const parts = $derived(
		text.split(FLAG).map((part, index, all) => ({
			text: part,
			isFlag: index % 2 === 1,
			spaced: /^\s/.test(all[index + 1] ?? '')
		}))
	);
</script>

{#each parts as part, index (index)}{#if part.isFlag}<span class={part.spaced ? '' : 'mr-[0.25em]'}>{part.text}</span
		>{:else}{part.text}{/if}{/each}
