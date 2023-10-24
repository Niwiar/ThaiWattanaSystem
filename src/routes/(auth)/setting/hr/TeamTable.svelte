<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';

	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import type { TeamList } from '$src/lib/types/hr';
	import { handleModal } from '$src/lib/action';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import TeamModal from './TeamModal.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';

	const modalStore = getModalStore();

	export let teamSource: TeamList[] = [];
	export let team = {};

	const handler = new DataHandler(teamSource);
	const rows = handler.getRows();

	export let selected = handler.getSelected();
	const handleSelected = (row: TeamList, e: MouseEvent) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON')
			return handleModal(modalStore, 'Edit Team', 'editTeam', TeamModal, { formData: row });
		if ($selected.includes(row.id)) {
			team = {};
			$selected = [];
			return;
		}
		$selected = [];
		handler.select(row.id);
		team = row;
	};

	$: teamSource, handler.setRows(teamSource);
</script>

<div class="table-container">
	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th>Index</th>
				<ThSort {handler} orderBy="name">Team</ThSort>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={(e) => handleSelected(row, e)}
				>
					<IndexCell {handler} rowNumber={i} />
					<td>{row.name}</td>
					<td class="!align-middle">
						<button class="btn btn-sm variant-soft-primary rounded-md">Edit</button>
					</td>
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
