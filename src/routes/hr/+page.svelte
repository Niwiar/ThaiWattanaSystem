<script lang="ts">
	import { Avatar, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import type { EventSourceInput } from 'svelte-fullcalendar';

	import AttnCalendar from '$src/lib/components/hr/AttnCalendar.svelte';
	import EmployeeTable from './EmployeeTable.svelte';
	import EmployeeModal from './EmployeeModal.svelte';

	export let data;
	export let form;

	let employee: any = {};

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const handleEmployee = async () => {
		const res = await handleEmployeeModal();
		console.log(res);
	};

	const handleEmployeeModal = () =>
		new Promise((resolve) => {
			const modalFormComponent: ModalComponent = {
				ref: EmployeeModal,
				props: {}
			};
			const modalForm: ModalSettings = {
				type: 'component',
				component: modalFormComponent,
				title: 'Create Employee',
				body: 'Form for ...',
				value: { action: 'createEmployee' },
				response: (r) => resolve(r)
			};
			modalStore.trigger(modalForm);
		});

	let attendances: EventSourceInput = [
		{
			title: 'Meeting',
			start: '2023-09-12T14:30:00',
			borderColor: 'red'
		},
		{
			title: '',
			start: '2023-09-13T07:00:00',
			borderColor: 'green'
		},
		{
			title: '',
			start: '2023-09-13T16:30:00',
			borderColor: 'green'
		}
	];

	// ❌ ✔️ ⛔ ❗ 🔥 ❓ 🔎 💡 📌 📣 💼
	$: {
		console.log(form);
		if (form?.success) {
			if ($modalStore[0].response) $modalStore[0].response(form.message);
			modalStore.close();
			toastStore.trigger({
				message: `✔️ ${form.message}`,
				timeout: 10000,
				background: 'variant-filled-success text-surface-100'
			});
		}
	}
</script>

<!-- <div class="container grid grid-cols-1 lg:grid-cols-[minmax(600px,_1fr)_auto] gap-4 my-6"> -->
<div class="w-full grid grid-cols-1 lg:grid-cols-[minmax(500px,_1fr)_auto] m-6">
	<div class="h-max space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Employee</span>
			<button class="btn-icon variant-filled-primary" on:click={handleEmployee}>
				<i class="fa fa-plus" />
			</button>
		</div>
		<div class="card">
			<EmployeeTable bind:employee employeeSource={data.employees} />
		</div>
	</div>

	{#if Object.keys(employee).length !== 0}
		<div class="ml-0 mt-4 lg:ml-4 lg:mt:0 card space-y-2 p-4 overflow-y-auto">
			<div class="flex justify-start items-start gap-4">
				<Avatar
					initials="{employee.firstname ? employee.firstname[0] : ''}{employee.lastname
						? employee.lastname[0]
						: ''}"
					width="w-60"
					rounded="rounded-lg bg-transparent"
				/>
				<div class="w-full grid grid-rows-2 gap-2">
					<span class="text-2xl">{employee.firstname} {employee.lastname}</span>
					<span class="font-bold">{employee.position?.name || '-'}</span>
					<span class="">ขาด 0 / ลากิจ 0 / ลาป่วย 0</span>
					<span class="">O.T. 0 ชั่วโมง</span>
				</div>
			</div>
			<div class="h-full">
				<AttnCalendar events={attendances} />
			</div>
		</div>
	{/if}
</div>
