<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	export let placeholder: string = 'Filter';
	export let filterBy: string | null = null;
	let value = '';
</script>

<th class="!p-2">
	<input
		class="input variant-ghost-surface px-2 font-light"
		type="text"
		{placeholder}
		bind:value
		on:input={() => handler.filter(value, filterBy ?? '')}
	/>
</th>

<style>
	input::placeholder {
		color: #f8f8f8;
		font-style: italic;
		font-size: 13px;
	}
</style>
