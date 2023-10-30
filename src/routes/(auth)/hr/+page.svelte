<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import EmployeeTable from './EmployeeTable.svelte';
	import EmployeeModal from './EmployeeModal.svelte';
	import { handleModal } from '$src/lib/action';
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

<div class=" grid grid-cols-1 lg:grid-cols-[minmax(500px,_1fr)_auto]">
	<div class="h-max space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Employee</span>
			<button
				class="btn-icon variant-filled-primary"
				on:click={() =>
					handleModal(modalStore, 'Create Employee', 'createEmployee', EmployeeModal, {
						size: 'w-full max-w-6xl'
					})}
			>
				<i class="fa fa-plus" />
			</button>
		</div>
		<div class="card">
			<EmployeeTable bind:employee employeeSource={data.employees} />
		</div>
	</div>
	<EmployeeAttendance {employee} />
</div>
