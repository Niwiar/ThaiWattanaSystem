<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	const rowsPerPage = handler.getRowsPerPage();
	const options = [5, 10, 20, 50, 100];
</script>

<aside>
	Show
	<select bind:value={$rowsPerPage} class="select w-20 !pr-4 mx-2">
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
	entries
</aside>

<style>
	aside {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #616161;
	}
</style>
