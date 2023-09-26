<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	let value = '';
</script>

<input
	class="input rounded-md p-2 w-72"
	type="text"
	placeholder="Search..."
	bind:value
	on:input={() => handler.search(value ?? '')}
/>
