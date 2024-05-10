<script lang="ts">
	import { toastError } from '$src/lib/action/toast.action.js';
	import AttnCalendar from '$src/lib/components/calendar/AttnCalendar.svelte';
	import { pvDiffDate, pvGetDate, pvGetDayOfWeek, pvGetTime } from '$src/lib/datetime.js';
	import type { Holiday } from '@prisma/client';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { EventInput } from 'svelte-fullcalendar';
	import AttendanceTable from './AttendanceTable.svelte';
	import type { EmployeeAttendanceList } from '$src/lib/types/hr';

	const toastStore = getToastStore();

	export let data;
	let render = 0;

	// Employee
	let employeeSource: EmployeeAttendanceList[] = [];
	// Attendance
	let date: string;
	let summaryDate: string = pvGetDate(new Date());
	let attendances: EventInput[] = [];
	let holidays: EventInput[] = [];
	let events: EventInput[] = [];

	let monthData: any;
	let dateCache: string[] = [];

	const dataFetch = async (url: string) => {
		const res = await fetch(url);
		const result = await res.json();
		if (res.status != 200) toastError(toastStore, result.message);
		return res.status == 200 ? result.data : null;
	};

	const handleDay = (date: string, e: UIEvent) => (summaryDate = pvGetDate(new Date(date)));

	const getSummary = async (date: string) => {
		if (!date) return;
		// attendances = [];
		monthData = await dataFetch(`/api/dashboard/attendance/${date}`);
		// const attn = new Array(data.max);
		for (let i = 1; i <= monthData.max; i++) {
			const day = `${date}-${i.toString().padStart(2, '0')}`;
			const attn: { [key: string]: number } = { present: 0, absent: 0, late: 0, leave: 0 };
			// if (pvGetDayOfWeek(day) === 0 || pvGetDayOfWeek(day) === 6) continue;
			monthData.attendances.forEach((a: any) => {
				a.attendance.forEach((at: any) => {
					if (pvGetDate(new Date(at.date)) == day) attn[at.type as string] += 1;
				});
				a.leave.forEach((l: any) => {
					if (pvGetDate(new Date(l.date)) == day) {
						attn['leave'] += 1;
					}
				});
			});
			attendances.push({
				date: day,
				title: `เข้างาน ${attn.present} / สาย ${attn.late}`,
				allDay: true,
				backgroundColor: '#3788d8',
				textColor: '#fbfdfd'
			});
			attendances.push({
				date: day,
				title: `ขาด ${attn.absent} / ลา ${attn.leave}`,
				allDay: true,
				backgroundColor: '#f77b72',
				textColor: '#fbfdfd'
			});
		}
		events = [...holidays, ...attendances];
		render++;
	};

	$: if (data.holidays) {
		holidays = data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true
		}));
		events = [...attendances, ...holidays];
	}

	$: if (browser) {
		if (!dateCache.find((d) => d === date)) {
			dateCache.push(date);
			getSummary(date);
		}
	}

	$: if (summaryDate && monthData) {
		employeeSource = monthData.attendances.map((a: any) => {
			const attend = a.attendance.find((at: any) => pvGetDate(new Date(at.date)) === summaryDate);
			const leave = a.leave.find((at: any) => pvGetDate(new Date(at.date)) === summaryDate);
			let checkInTime = new Date();
			if (attend?._min) {
				checkInTime = attend?._min && new Date(attend._min.createdAt.replaceAll(/Z|T/g, ' '));
				checkInTime.setHours(checkInTime.getHours() + 7);
			}

			return {
				name: a.employee.name,
				imageFile: a.employee.imageFile,
				attendance: attend
					? attend.type === 'present'
						? `เข้างาน\n${checkInTime.toLocaleTimeString('en-GB').slice(0, 5)}`
						: attend.type === 'late'
						? `สาย\n${checkInTime.toLocaleTimeString('en-GB').slice(0, 5)}`
						: attend.type === 'absent'
						? 'ขาดงาน'
						: '-'
					: leave
					? leave.type === 1
						? 'ลากิจ'
						: 'ลาป่วย'
					: '-'
			};
		});
		// console.log(employeeSource);
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] m-6 gap-4 h-full">
	<div class="card h-full overflow-auto">
		{#key render}
			<AttnCalendar bind:date bind:events height="h-[40rem]" {handleDay} />
		{/key}
	</div>

	<div class="h-full space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Attendance</span>
			<input
				class="input rounded-md px-2 py-1 w-52 variant-soft-tertiary text-xl text-center"
				type="date"
				disabled
				bind:value={summaryDate}
			/>
		</div>
		<div class="card">
			<AttendanceTable {employeeSource} />
		</div>
	</div>
</div>
