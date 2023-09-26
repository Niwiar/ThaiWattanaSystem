<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';

	import IndexCell from '$component/table/IndexCell.svelte';
	import ThSort from '$component/table/ThSort.svelte';
	import type { PositionList } from '$src/lib/types/hr';

	export let positionSource: PositionList[] = [];
	export let positionSetting: boolean;
	export let position = {};

	const handler = new DataHandler(positionSource);
	const rows = handler.getRows();

	export let selected = handler.getSelected();
	const handleSelected = (row: PositionList) => {
		if ($selected.includes(row.id)) {
			position = {};
			$selected = [];
			positionSetting = false;
			return;
		}
		$selected = [];
		handler.select(row.id);
		position = row;
		positionSetting = true;
	};

	$: positionSource, handler.setRows(positionSource);
</script>

<div class="table-container">
	<table class="table table-interactive table-compact overflow-y-auto">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th>Index</th>
				<ThSort {handler} orderBy="name">Position</ThSort>
				<ThSort {handler} orderBy="salary">Salary</ThSort>
				<ThSort {handler} orderBy="payType">Pay Type</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={() => handleSelected(row)}
				>
					<IndexCell {handler} rowNumber={i} />
					<td>{row.name}</td>
					<td>{row.salary}</td>
					<td>{row.payTypeText}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	table {
		max-height: 500px;
	}
</style>
