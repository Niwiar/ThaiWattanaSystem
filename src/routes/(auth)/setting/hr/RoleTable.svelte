<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';

	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import type { RoleList } from '$src/lib/types/hr';
	import { handleModal } from '$src/lib/action';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import RoleModal from './RoleModal.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';

	const modalStore = getModalStore();

	export let roleSource: RoleList[] = [];

	const handler = new DataHandler(roleSource);
	const rows = handler.getRows();

	export let selected = handler.getSelected();
	const handleSelected = (row: RoleList) => {
		handleModal(modalStore, 'Edit Role', 'editRole', RoleModal, { formData: row });
	};

	$: roleSource, handler.setRows(roleSource);
</script>

<div class="table-container">
	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th>Index</th>
				<ThSort {handler} orderBy="name">Role</ThSort>
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
		max-height: 250px;
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
