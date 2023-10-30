<script lang="ts">
	import type { BusinessHoursInput, CalendarOptions, EventSourceInput } from 'svelte-fullcalendar';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import { onMount } from 'svelte';
	import { pvGetMonth } from '$src/lib/datetime';
	import { page } from '$app/stores';

	export let height: String = 'h-[40rem]';
	export let events: EventSourceInput = [];
	export let date = pvGetMonth(new Date());
	export let handleEvent: (event: any) => void = () => {};
	export let handleDay: (date: any, event: any) => void = () => {};
	$: height;

	let businessHours: BusinessHoursInput = {
		daysOfWeek: [1, 2, 3, 4, 5, 6],
		startTime: '08:00',
		endTime: '17:00'
	};
	let FullCalendar: any = null;
	let calendarRef;
	let options: CalendarOptions = {};

	const handleDateChange = () => {
		const calendar = calendarRef!.getAPI();
		calendar.gotoDate(date);
	};

	const handleToday = () => {
		const calendar = calendarRef!.getAPI();
		date = pvGetMonth(new Date());
		calendar.today();
	};
	const handleNext = () => {
		const calendar = calendarRef!.getAPI();
		var d = new Date(date);
		date = pvGetMonth(new Date(d.setMonth(d.getMonth() + 1)));
		calendar.next();
	};
	const handlePrev = () => {
		const calendar = calendarRef!.getAPI();
		var d = new Date(date);
		date = pvGetMonth(new Date(d.setMonth(d.getMonth() - 1)));
		calendar.prev();
	};

	onMount(async () => {
		FullCalendar = (await import('svelte-fullcalendar')).default;

		if ($page.data.setting) {
			let daysOfWeek: number[] = [];
			Object.keys(JSON.parse($page.data.setting.workday)).forEach(
				(key) => JSON.parse($page.data.setting.workday)[key] && daysOfWeek.push(parseInt(key))
			);
			businessHours = {
				daysOfWeek,
				startTime: $page.data.setting.startWorktime,
				endTime: $page.data.setting.stopWorktime
			};
		}

		options = {
			plugins: [dayGridPlugin, interactionPlugin],
			initialView: 'dayGridMonth',
			initialDate: date,
			events,
			headerToolbar: false,
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
			businessHours,
			eventClick: handleEvent,
			navLinks: true,
			navLinkDayClick: handleDay
		};
	});
</script>

<div class="flex justify-between mb-1">
	<button class="btn rounded variant-filled-tertiary" on:click={handleToday}>Today</button>

	<input
		class="input rounded-md px-2 py-1 w-48 variant-ringed-tertiary text-xl text-center"
		type="month"
		bind:value={date}
		on:change={handleDateChange}
	/>
	<div class="btn-group rounded variant-filled-tertiary">
		<button on:click={handlePrev}>
			<i class="fa fa-chevron-left" />
		</button>
		<button on:click={handleNext}>
			<i class="fa fa-chevron-right" />
		</button>
	</div>
</div>
{#if FullCalendar}
	<!-- <FullCalendar class="!h-[40rem]" bind:this={calendarRef} {options} />	 -->
	<svelte:component this={FullCalendar} class="!{height}" bind:this={calendarRef} {options} />
{/if}
