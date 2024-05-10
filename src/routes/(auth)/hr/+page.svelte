<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import EmployeeTable from './EmployeeTable.svelte';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import EmployeeAttendance from './EmployeeAttendance.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data;
	export let form;

	// Employee
	let employee: any = {};
	// Attendance

	$: {
		if (form?.success) {
			modalStore.close();
			toastSuccess(toastStore, form.message);
			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
		}
	}
</script>

<!-- <div class="container grid grid-cols-1 lg:grid-cols-[minmax(600px,_1fr)_auto] gap-4 my-6"> -->

<div class=" grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_auto]">
	<div class="h-max space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Employee</span>
		</div>
		<div class="card">
			<EmployeeTable bind:employee employeeSource={data.employees} />
		</div>
	</div>
	<EmployeeAttendance {employee} />
</div>
