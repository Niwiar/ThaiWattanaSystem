<script lang="ts">
	import AttnCalendar from '$src/lib/components/calendar/AttnCalendar.svelte';
	import type { Holiday } from '@prisma/client';
	import type { EventInput } from 'svelte-fullcalendar';

	export let data;
	let render = 0;

	// Employee
	let employee: any = {};
	// Attendance
	let date: string;
	let attendances: EventInput[] = [];
	let holidays: EventInput[] = [];
	let events: EventInput[] = [];

	$: if (data.holidays) {
		holidays = data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true
		}));
	}
	$: events = [...attendances, ...holidays];
	// $: render++;
</script>

<div class=" grid grid-cols-1 lg:grid-cols-2 m-6">
	<div class="card h-max">
		<AttnCalendar bind:date bind:events />
		<!-- {#key render}
			{/key} -->
	</div>
	<div class="card" />
</div>
