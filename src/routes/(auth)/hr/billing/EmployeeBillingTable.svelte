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
	import BillingModal from './BillingModal.svelte';

	export let employeeSource: EmployeeList[] = [];

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();
	const selected = handler.getSelected();
	const isAllSelected = handler.isAllSelected();

	const handleEdit = (e: MouseEvent, row: EmployeeList) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON')
			return handleModal(modalStore, 'Edit Employee', 'editEmployee', BillingModal, {
				formData: row,
				size: 'w-full max-w-6xl'
			});
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
				<ThSort {handler} orderBy="employeeCode">Code</ThSort>
				<ThSort {handler} orderBy="name">Name</ThSort>
				<ThSort {handler} orderBy="salary">Salary</ThSort>
				<ThSort {handler} orderBy="payTypeText">Pay Type</ThSort>
				<th rowspan="2" />
			</tr>
			<tr class="bg-primary-500 text-white">
				<ThFilter {handler} filterBy="employeeCode" placeholder="code" />
				<ThFilter {handler} filterBy="name" placeholder="name" />
				<ThFilter {handler} filterBy="salary" placeholder="salary" />
				<ThFilter {handler} filterBy="payTypeText" placeholder="pay type" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={(e) => handleEdit(e, row)}
				>
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
							initials={row.name[0] + (row.name[1] || '')}
							width="w-12"
							src={row.imageFile ? FILE_LOCATION + row.imageFile : ''}
							alt="{row.name}-avatar"
						/></td
					>
					<td class="!align-middle">{row.employeeCode}</td>
					<td class="!align-middle">{row.name}</td>
					<td class="!align-middle">{row.salary}</td>
					<td class="!align-middle">{row.payTypeText}</td>
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
