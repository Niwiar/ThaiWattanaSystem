<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	export let placeholder1: string = 'Filter';
	export let placeholder2: string = 'Filter';
	export let filterBy1: string | null = null;
	export let filterBy2: string | null = null;
	let value1 = '';
	let value2 = '';
</script>

<th class="!p-2 flex gap-2">
	<input
		class="input variant-ghost-surface px-2 py-1 font-light"
		type="text"
		placeholder={placeholder1}
		bind:value={value1}
		on:input={() => handler.filter(value1, filterBy1 ?? '')}
	/>
	<input
		class="input variant-ghost-surface px-2 py-1 font-light"
		type="text"
		placeholder={placeholder2}
		bind:value={value2}
		on:input={() => handler.filter(value2, filterBy2 ?? '')}
	/>
</th>

<style>
	input::placeholder {
		color: #f8f8f8;
		font-style: italic;
		font-size: 13px;
	}
</style>
