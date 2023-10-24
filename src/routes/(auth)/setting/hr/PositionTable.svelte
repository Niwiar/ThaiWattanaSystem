<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';

	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import type { PositionList } from '$src/lib/types/hr';
	import PositionModal from './PositionModal.svelte';
	import { handleModal } from '$src/lib/action';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';

	const modalStore = getModalStore();

	export let positionSource: PositionList[] = [];

	const handler = new DataHandler(positionSource);
	const rows = handler.getRows();

	const handleSelected = (row: PositionList) => {
		handleModal(modalStore, 'Edit Position', 'editPosition', PositionModal, { formData: row });
	};

	$: positionSource, handler.setRows(positionSource);
</script>

<div class="table-container">
	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th>Index</th>
				<ThSort {handler} orderBy="name">Position</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr on:click={() => handleSelected(row)}>
					<IndexCell {handler} rowNumber={i} />
					<td>{row.name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<footer class="flex justify-between items-center m-2">
	<RowCount {handler} />
</footer>

<style>
	.table-container {
		max-height: 350px;
		overflow-y: auto;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}
	thead {
		position: sticky;
		inset-block-start: 0;
	}
</style>
