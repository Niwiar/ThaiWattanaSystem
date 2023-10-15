<script lang="ts">
	import type { BusinessHoursInput, CalendarOptions, EventSourceInput } from 'svelte-fullcalendar';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import { onMount } from 'svelte';

	export let events: EventSourceInput = [];
	export let handleEvent: (event: any) => void = () => {};
	export let handleDay: (date: any, event: any) => void = () => {};
	export let businessHours: BusinessHoursInput = {
		daysOfWeek: [1, 2, 3, 4, 5, 6],
		startTime: '08:00',
		endTime: '17:00'
	};

	let FullCalendar: any = null;

	onMount(async () => {
		FullCalendar = (await import('svelte-fullcalendar')).default;
	});

	const options: CalendarOptions = {
		plugins: [dayGridPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		events,
		headerToolbar: {
			start: 'today',
			center: 'title',
			end: 'prev,next'
		},
		titleFormat: {
			year: '2-digit',
			month: 'short'
		},
		height: '100%',
		weekends: true,
		eventBackgroundColor: 'transparent',
		eventBorderColor: 'transparent',
		eventTextColor: 'gray',
		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
			meridiem: false,
			hour12: false
		},
		businessHours: businessHours,
		eventClick: handleEvent,
		navLinks: true,
		navLinkDayClick: handleDay
	};
</script>

{#if FullCalendar}
	<FullCalendar {options} />
	<!-- <svelte:component this={FullCalendar} {options} /> -->
{/if}
