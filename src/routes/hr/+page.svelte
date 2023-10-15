<script lang="ts">
	import { Avatar, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import type { EventInput, EventSourceInput } from 'svelte-fullcalendar';

	import AttnCalendar from '$src/lib/components/hr/AttnCalendar.svelte';
	import EmployeeTable from './EmployeeTable.svelte';
	import EmployeeModal from './EmployeeModal.svelte';
	import { FILE_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import type { Holiday } from '@prisma/client';
	import { fly, slide } from 'svelte/transition';
	import AttendanceModal from './AttendanceModal.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data;
	export let form;
	let render = 0;

	// Employee
	let employee: any = {};
	// Attendance

	let attendances: EventInput[] = [];
	let holidays: EventInput[] = [];

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
	$: if (data.holidays) {
		holidays = data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true
		}));
	}

	$: events = [...attendances, ...holidays];
	$: render++;
</script>

<!-- <div class="container grid grid-cols-1 lg:grid-cols-[minmax(600px,_1fr)_auto] gap-4 my-6"> -->
<div class="w-full grid grid-cols-1 lg:grid-cols-[minmax(500px,_1fr)_auto] m-6">
	<div class="h-max space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Employee</span>
			<button
				class="btn-icon variant-filled-primary"
				on:click={() => handleModal(modalStore, 'Create Employee', 'createEmployee', EmployeeModal)}
			>
				<i class="fa fa-plus" />
			</button>
		</div>
		<div class="card">
			<EmployeeTable bind:employee employeeSource={data.employees} />
		</div>
	</div>

	{#if Object.keys(employee).length !== 0}
		<div
			transition:slide={{ axis: 'x' }}
			on:introend={() => render++}
			class="ml-0 mt-4 lg:ml-4 lg:mt:0 card space-y-2 p-4 overflow-y-auto"
		>
			<div class="flex justify-start items-start gap-4">
				<Avatar
					initials="{employee.firstname ? employee.firstname[0] : ''}{employee.lastname
						? employee.lastname[0]
						: ''}"
					src={employee.imageFile ? FILE_LOCATION + employee.imageFile : ''}
					width="w-60"
					rounded="rounded-lg bg-transparent"
				/>
				<div class="w-full grid grid-rows-2 gap-2">
					<span class="text-2xl">{employee.firstname} {employee.lastname}</span>
					<span class="font-bold">{employee.position?.name || '-'}</span>
					<span class="">ขาด 0 / ลากิจ 0 / ลาป่วย 0</span>
					<span class="">O.T. 0 ชั่วโมง</span>
					<span class="">เบี้ยเลี้ยง 0 / เบี้ยขยัน 0</span>
				</div>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-lg font-semibold">Attendance</span>
				<button
					class="btn btn-sm variant-filled-primary rounded-md"
					on:click={() =>
						handleModal(
							modalStore,
							'Create Attendance',
							'createAttendance',
							AttendanceModal,
							employee
						)}
				>
					Issue
				</button>
			</div>
			<div class="h-[500px]">
				{#key render}
					<AttnCalendar bind:events />
				{/key}
			</div>
		</div>
	{/if}
</div>
