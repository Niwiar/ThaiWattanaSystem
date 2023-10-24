<script lang="ts">
	import {
		Avatar,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import type { EmployeeList } from '$src/lib/types/hr';
	import SearchBox from '$src/lib/components/datatable/SearchBox.svelte';
	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import RowPerPage from '$src/lib/components/datatable/RowPerPage.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';
	import Pagination from '$src/lib/components/datatable/Pagination.svelte';
	import ThFilter from '$src/lib/components/datatable/ThFilter.svelte';
	import { FILE_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';
	import ThFilter2 from '$src/lib/components/datatable/ThFilter2.svelte';

	export let employeeSource: EmployeeList[] = [];
	export let employee = {};

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();
	const selected = handler.getSelected();
	const isAllSelected = handler.isAllSelected();

	const handleEdit = (row: EmployeeList) => {
		if ($selected.includes(row.id)) {
			employee = {};
			$selected = [];
			return;
		}
		$selected = [];
		handler.select(row.id);
		employee = row;
	};

	const modalStore = getModalStore();

	$: employeeSource, handler.setRows(employeeSource);
</script>

<div class="table-container h-max shadow-lg overflow-y-auto">
	<div>
		<input
			type="checkbox"
			on:click={() => handler.selectAll({ selectBy: 'id' })}
			checked={$isAllSelected}
		/><span>select all</span>
	</div>

	<header class="flex justify-between items-center m-2">
		<SearchBox {handler} />
		<RowPerPage {handler} />
	</header>

	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th rowspan="2" colspan="2" class="text-center">Select</th>
				<ThSort {handler} orderBy="firstname">Name</ThSort>
				<ThSort {handler} orderBy="positionId">Position</ThSort>
				<th rowspan="2" />
			</tr>
			<tr class="bg-primary-500 text-white">
				<ThFilter2
					{handler}
					filterBy1="firstname"
					placeholder1="firstname"
					filterBy2="lastname"
					placeholder2="lastname"
				/>
				<ThFilter {handler} filterBy="position" placeholder="position" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr class:table-row-checked={$selected.includes(row.id)} on:click={() => handleEdit(row)}>
					<input name="id" value={row.id} hidden />
					<td class="!align-middle"
						><input
							type="checkbox"
							on:click={() => handler.select(row.id)}
							checked={$selected.includes(row.id)}
						/></td
					>
					<td class="!align-middle"
						><Avatar
							initials="{row.firstname ? row.firstname[0] : ''}{row.lastname
								? row.lastname[0]
								: ''}"
							width="w-12"
							src={row.imageFile ? FILE_LOCATION + row.imageFile : ''}
							alt="{row.firstname}-avatar"
						/></td
					>
					<td class="!align-middle">{row.firstname} {row.lastname}</td>
					<td class="!align-middle">{row.position ? row.position.name : ''}</td>
					<td class="!align-middle">
						<button class="btn variant-soft-primary rounded-md">Detail</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<footer class="flex justify-between items-center m-2">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
</div>

<style>
	div.table-container {
		height: 600px;
	}
</style>
