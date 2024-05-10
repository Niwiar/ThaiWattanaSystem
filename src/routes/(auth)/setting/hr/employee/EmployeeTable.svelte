<script lang="ts">
	import { Avatar, getModalStore } from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import type { EmployeeList } from '$src/lib/types/hr';
	import EmployeeModal from './EmployeeModal.svelte';
	import SearchBox from '$src/lib/components/datatable/SearchBox.svelte';
	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import RowPerPage from '$src/lib/components/datatable/RowPerPage.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';
	import Pagination from '$src/lib/components/datatable/Pagination.svelte';
	import ThFilter from '$src/lib/components/datatable/ThFilter.svelte';
	import { EMPLOYEE_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';

	export let employeeSource: EmployeeList[] = [];
	export let employee = {};

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();
	const selected = handler.getSelected();

	const handleSelected = (row: EmployeeList, e: MouseEvent) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON')
			return handleModal(modalStore, 'Edit Employee', 'editEmployee', EmployeeModal, {
				formData: {
					...row,
					birthdate: row.birthdate ? row.birthdate.split('T')[0] : null,
					workdate: row.workdate ? row.workdate.split('T')[0] : null
				}
			});
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

	$: handler.setRows(employeeSource);
</script>

<header class="flex justify-between items-center m-2">
	<SearchBox {handler} />
	<RowPerPage {handler} />
</header>
<div class="table-container h-max shadow-lg overflow-y-auto">
	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th rowspan="2" colspan="2" class="text-center">Index</th>
				<ThSort {handler} class="!justify-center" orderBy="employeeCode">Code</ThSort>
				<ThSort {handler} class="!justify-center" orderBy="firstname">Name</ThSort>
				<ThSort {handler} class="!justify-center" orderBy="position">Position</ThSort>
				<ThSort {handler} class="!justify-center" orderBy="salary">Salary</ThSort>
				<th rowspan="2" />
			</tr>
			<tr class="bg-primary-500 text-white">
				<ThFilter {handler} filterBy="employeeCode" placeholder="employee code" />
				<ThFilter {handler} filterBy="name" placeholder="name" />
				<ThFilter {handler} filterBy="position" placeholder="position" />
				<ThFilter {handler} filterBy="salary" placeholder="salary" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={(e) => handleSelected(row, e)}
				>
					<input name="id" value={row.id} hidden />
					<IndexCell class="!align-middle text-center" {handler} rowNumber={i} />
					<td class="!align-middle"
						><Avatar
							initials={row.name[0] + (row.name[1] || '')}
							width="w-12"
							src={row.imageFile ? EMPLOYEE_LOCATION + row.imageFile : ''}
							alt="{row.name}-avatar"
						/></td
					>
					<td class="!align-middle text-center">{row.employeeCode}</td>
					<td class="!align-middle">{row.name}</td>
					<td class="!align-middle text-center">{row.position ? row.position.name : '-'}</td>
					<td class="!align-middle text-center">{row.salary ? row.salary : '-'}</td>
					<td class="!align-middle text-center">
						<button class="btn variant-soft-primary rounded-md">Edit</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<footer class="flex justify-between items-center m-2">
	<RowCount {handler} />
	<Pagination {handler} />
</footer>

<style>
	.table-container {
		max-height: 600px;
	}
</style>
