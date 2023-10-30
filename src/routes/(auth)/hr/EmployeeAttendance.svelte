<script lang="ts">
	import { page } from '$app/stores';
	import type { Holiday } from '@prisma/client';
	import { Avatar, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { EventInput } from 'svelte-fullcalendar';
	import { slide } from 'svelte/transition';
	import { FILE_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';
	import AttendanceModal from './AttendanceModal.svelte';
	import AttnCalendar from '$src/lib/components/calendar/AttnCalendar.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let employee: any = {};
	let render = 0;

	let attendances: EventInput[] = [];
	let holidays: EventInput[] = [];
	let events: EventInput[] = [];
	let lastEvents: EventInput[] = [];

	$: if ($page.data.holidays) {
		holidays = $page.data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true
		}));
		events = [...attendances, ...holidays];
		if (lastEvents.length !== events.length) {
			render++;
			lastEvents = events;
		}
	}
</script>

{#if Object.keys(employee).length !== 0}
	<div
		transition:slide={{ axis: 'x' }}
		on:introend={() => render++}
		class="ml-0 mt-4 lg:ml-4 lg:mt:0 card space-y-2 p-4 overflow-y-auto"
	>
		<div class="flex justify-start items-start gap-4">
			<Avatar
				initials={employee.name ? employee.name[0] + (employee.name[1] || '') : ''}
				src={employee.imageFile ? FILE_LOCATION + employee.imageFile : ''}
				width="w-60"
				rounded="rounded-lg bg-transparent"
			/>
			<div class="w-full grid grid-rows-2 gap-2">
				<span class="text-2xl">{employee.name} </span>
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
					handleModal(modalStore, 'Create Attendance', 'createAttendance', AttendanceModal, {
						formData: employee
					})}
			>
				Issue
			</button>
		</div>
		<div class="h-[520px]">
			{#key render}
				<AttnCalendar bind:events height="h-[20rem]" />
			{/key}
		</div>
	</div>
{/if}
