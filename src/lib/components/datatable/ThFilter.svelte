<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	export let placeholder: string = 'Filter';
	export let filterBy: string | null = null;
	let value = '';
</script>

<th class="!p-2">
	<input
		class="input rounded-md variant-ghost-surface border-0 px-2 py-1 font-light"
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
