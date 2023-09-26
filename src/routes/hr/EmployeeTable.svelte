<script lang="ts">
	import {
		Avatar,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import type { EmployeeList } from '$src/lib/types/hr';
	import EmployeeModal from './EmployeeModal.svelte';
	import SearchBox from '$component/table/SearchBox.svelte';
	import IndexCell from '$component/table/IndexCell.svelte';
	import ThSort from '$component/table/ThSort.svelte';
	import RowPerPage from '$component/table/RowPerPage.svelte';
	import RowCount from '$component/table/RowCount.svelte';
	import Pagination from '$component/table/Pagination.svelte';
	import ThFilter from '$component/table/ThFilter.svelte';
	import { FILE_LOCATION } from '$src/constant';

	export let employeeSource: EmployeeList[] = [];
	export let employee = {};

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();
	const selected = handler.getSelected();

	const handleSelected = (row: EmployeeList, e: MouseEvent) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON') return handleEmployee(row);
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

	const handleEmployee = async (row: EmployeeList) => {
		const res = await handleEmployeeModal(row);
		console.log(res);
	};

	const handleEmployeeModal = (row: EmployeeList) =>
		new Promise((resolve) => {
			const modalFormComponent: ModalComponent = {
				ref: EmployeeModal,
				props: { employee: row }
			};
			const modalForm: ModalSettings = {
				type: 'component',
				component: modalFormComponent,
				title: 'Employee Detail',
				body: 'Form for ...',
				value: { action: 'editEmployee' },
				response: (r) => resolve(r)
			};
			modalStore.trigger(modalForm);
		});

	$: employeeSource, handler.setRows(employeeSource);
</script>

<div class="table-container h-max shadow-lg overflow-y-auto">
	<header class="flex justify-between items-center m-2">
		<SearchBox {handler} />
		<RowPerPage {handler} />
	</header>

	<table class="table table-interactive table-compact">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th rowspan="2" colspan="2" class="text-center">Index</th>
				<ThSort {handler} orderBy="firstname">Name</ThSort>
				<ThSort {handler} orderBy="positionId">Position</ThSort>
				<ThSort {handler} orderBy="tel">Tel</ThSort>
				<th rowspan="2" />
			</tr>
			<tr class="bg-primary-500 text-white">
				<ThFilter {handler} filterBy="firstname" placeholder="firstname" />
				<ThFilter {handler} filterBy="position" placeholder="position" />
				<ThFilter {handler} filterBy="tel" placeholder="tel" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={(e) => handleSelected(row, e)}
				>
					<input name="id" value={row.id} hidden />
					<IndexCell class="!align-middle" {handler} rowNumber={i} />
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
					<td class="!align-middle">{row.tel}</td>
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
