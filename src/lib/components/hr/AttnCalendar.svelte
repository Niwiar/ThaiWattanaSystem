<script lang="ts">
	import type { CalendarOptions, EventSourceInput } from 'svelte-fullcalendar';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import { onMount } from 'svelte';

	export let events: EventSourceInput = [];

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
		navLinks: true,
		navLinkDayClick: function (date) {
			console.log('day', date.toISOString());
		},
		eventBackgroundColor: 'transparent',
		eventBorderColor: 'transparent',
		eventTextColor: 'gray',
		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
			meridiem: false,
			hour12: false
		},
		businessHours: {
			daysOfWeek: [1, 2, 3, 4, 5, 6],
			startTime: '08:00',
			endTime: '17:00'
		},
		eventDidMount: (info) => {
			if (info.event.extendedProps.status === 'done') {
				info.borderColor = 'green';
			}
		}
		// dateClick: (e) => console.log(e.dayEl)
	};
</script>

{#if FullCalendar}
	<FullCalendar {options} />
{/if}
