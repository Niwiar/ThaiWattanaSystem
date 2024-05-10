<script lang="ts">
	import { Avatar, getModalStore } from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import type { EmployeeAttendanceList } from '$src/lib/types/hr';
	import SearchBox from '$src/lib/components/datatable/SearchBox.svelte';
	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import RowPerPage from '$src/lib/components/datatable/RowPerPage.svelte';
	import RowCount from '$src/lib/components/datatable/RowCount.svelte';
	import Pagination from '$src/lib/components/datatable/Pagination.svelte';
	import { EMPLOYEE_LOCATION } from '$src/constant';

	export let employeeSource: EmployeeAttendanceList[] = [];

	const handler = new DataHandler(employeeSource, { rowsPerPage: 20 });
	const rows = handler.getRows();

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
				<th colspan="2" class="text-center">Index</th>
				<ThSort {handler} class="!justify-center" orderBy="firstname">Name</ThSort>
				<ThSort {handler} class="!justify-center" orderBy="attendance">Attendance</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr>
					<IndexCell class="!align-middle text-center" {handler} rowNumber={i} />
					<td class="!align-middle"
						><Avatar
							initials={row.name[0] + (row.name[1] || '')}
							width="w-12"
							src={row.imageFile ? EMPLOYEE_LOCATION + row.imageFile : ''}
							alt="{row.name}-avatar"
						/></td
					>
					<td class="!align-middle">{row.name}</td>
					<td class="!align-middle text-center">{row.attendance}</td>
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
