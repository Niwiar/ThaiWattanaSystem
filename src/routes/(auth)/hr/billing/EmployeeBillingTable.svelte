<script lang="ts">
	import { Avatar, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import type { EmployeeList } from '$src/lib/types/hr';
	import SearchBox from '$src/lib/components/datatable/SearchBox.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import RowPerPage from '$src/lib/components/datatable/RowPerPage.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';
	import Pagination from '$src/lib/components/datatable/Pagination.svelte';
	import ThFilter from '$src/lib/components/datatable/ThFilter.svelte';
	import { EMPLOYEE_LOCATION, SLIP_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';
	import BillingModal from './BillingModal.svelte';
	import { enhance } from '$app/forms';
	import { pvGetMonth } from '$lib/datetime';
	import { handlePreviewModal } from '$lib/action';
	import PreviewModal from '$component/base/ModalPreview.svelte';
	import { toastError, toastWarning } from '$src/lib/action/toast.action';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let employeeSource: EmployeeList[] = [];
	export let month: string = pvGetMonth(new Date());

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();
	const selected = handler.getSelected();
	const isAllSelected = handler.isAllSelected();

	let isPrinting = false;

	const dataFetch = async (url: string) => {
		const res = await fetch(url);
		const result = await res.json();
		if (res.status != 200) toastError(toastStore, result.message);
		return res.status == 200 ? result.data : null;
	};

	const handleEdit = async (e: MouseEvent, row: EmployeeList) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON') {
			const data = await dataFetch(`/api/hr/billing/${row.id}/${month}`);
			if (!data.billing)
				return toastWarning(
					toastStore,
					`ไม่มีข้อมูลใบเสร็จในเดือนนี้ (${
						data.monthType === 'future' ? 'ยังไม่ถึงเดือน' : 'ยังไม่เริ่มงาน'
					})`
				);
			return handleModal(modalStore, 'Employee Billing', 'editฺBilling', BillingModal, {
				formData: { ...row, infomation: data, month, isDisabled: month !== pvGetMonth(new Date()) },
				size: 'w-full max-w-7xl'
			});
		}
	};

	const handlePrint = async () => {
		console.log($selected);
		isPrinting = true;
		const res = await fetch(`/api/hr/billing/print`, {
			method: 'POST',
			body: JSON.stringify({ employeeId: $selected, month })
		});
		const result = await res.json();
		isPrinting = false;
		if (res.status != 200) return toastError(toastStore, result.message);
		else
			handlePreviewModal(modalStore, PreviewModal, {
				data: SLIP_LOCATION + result.data,
				title: 'ใบเสร็จ'
			});
	};

	$: employeeSource, handler.setRows(employeeSource);
</script>

<div class="table-container h-max shadow-lg overflow-y-auto">
	<div class="pt-2 px-3 flex justify-between items-center">
		<div class="flex items-center gap-2">
			<input
				class="checkbox checkbox-sm p-2"
				type="checkbox"
				on:click={() => handler.selectAll({ selectBy: 'id' })}
				checked={$isAllSelected}
			/><span>select all</span>
		</div>
		<form method="POST" action="?/printBilling" use:enhance enctype="multipart/form-data" />
		<button
			class="btn variant-filled-tertiary rounded-md"
			disabled={isPrinting}
			on:click={handlePrint}>Print</button
		>
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
			{#each $rows as row}
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
							src={row.imageFile ? EMPLOYEE_LOCATION + row.imageFile : ''}
							alt="{row.name}-avatar"
						/></td
					>
					<td class="!align-middle">{row.employeeCode}</td>
					<td class="!align-middle">{row.name}</td>
					<td class="!align-middle">{row.salary}</td>
					<td class="!align-middle">{row.payTypeText}</td>
					<td class="!align-middle">
						<button class="btn variant-soft-primary rounded-md">Billing</button>
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
