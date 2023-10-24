<script lang="ts">
	import { enhance } from '$app/forms';
	import AttnCalendar from '$src/lib/components/calendar/AttnCalendar.svelte';
	import type { Holiday } from '@prisma/client';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { EventClickArg, EventSourceInput } from 'svelte-fullcalendar';
	import HolidayModal from './HolidayModal.svelte';
	import { handleModal } from '$src/lib/action';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import { daysOfWeek } from '$src/constant';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { page } from '$app/stores';
	import { pvGetDate } from '$src/lib/datetime';

	export let data;
	export let form;
	let render = 0;

	let holidays: EventSourceInput = [];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const defaultWorkday = JSON.stringify({
		'1': true,
		'2': true,
		'3': true,
		'4': true,
		'5': true,
		'6': false,
		'7': false
	});
	const defaultWorktime = JSON.stringify({
		startWorktime: '08:00',
		endWorktime: '17:00',
		lateTime: '08:15'
	});
	let workday: Record<string, boolean> = JSON.parse(data.setting?.workday ?? defaultWorkday);
	let worktime = data.setting! ?? defaultWorktime;

	const handleWorkday = (day: string) => {
		workday[day] = !workday[day];
	};

	$: if (data.holidays) {
		holidays = data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true,
			editable: true,
			id: holiday.id
		}));
	}

	$: {
		if (form?.success) {
			if (form.type === 'holiday') modalStore.close();
			toastSuccess(toastStore, form.message);
			render++;
			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
		}
	}

	const handleDay = (date: string, e: UIEvent) => {
		const holiday = { date: pvGetDate(new Date(date)) };
		handleModal(modalStore, 'Create Holiday', 'createHoliday', HolidayModal, { formData: holiday });
	};

	const handleEvent = (e: EventClickArg) => {
		const event = e.event;
		if (!event.durationEditable) return;
		const holiday = {
			id: event.id,
			name: event.title,
			date: event.startStr
		};
		handleModal(modalStore, 'Edit Holiday', 'editHoliday', HolidayModal, { formData: holiday });
	};
</script>

<div class="space-y-4">
	<h2 class="text-lg font-bold">General Setting</h2>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<span class="text-lg font-semibold">Workday Setting</span>
			</div>
			<form
				method="POST"
				action="?/createSetting"
				use:enhance
				enctype="multipart/form-data"
				class="space-y-2"
			>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Workday</span>
					<div class="flex flex-col">
						<div class="grid grid-cols-4 gap-2">
							{#each Object.keys(workday) as day}
								<!-- <label class="label flex w-16 justify-start items-center gap-1">
									<input class="input w-4 rounded-md text-primary-500" type="checkbox" name={day} />
									<span class="capitalize !m-0">{day}</span>
								</label> -->
								<input bind:checked={workday[day]} type="checkbox" name="d{day}" hidden />
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<span
									class="chip {workday[parseInt(day)] ? 'variant-filled-tertiary' : 'variant-soft'}"
									on:click={() => handleWorkday(day)}
								>
									<input
										bind:value={workday[parseInt(day)]}
										type="checkbox"
										name={'d' + day}
										hidden
									/>
									<span class="capitalize">{daysOfWeek[parseInt(day) - 1]}</span>
								</span>
							{/each}
						</div>
						<AlertText alerts={$page.form} form="setting" field="workday" />
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Worktime</span>
					<div class="flex flex-col">
						<div class="flex items-center gap-2">
							<!-- bind:value={worktime['startWorktime']} -->
							<input
								bind:value={worktime['startWorktime']}
								class="input px-2 py-1 rounded-md"
								type="time"
								name="startWorktime"
							/>
							-
							<!-- bind:value={worktime['stopWorktime']} -->
							<input
								bind:value={worktime['stopWorktime']}
								class="input px-2 py-1 rounded-md"
								type="time"
								name="stopWorktime"
							/>
						</div>
						<AlertText alerts={$page.form} form="setting" field="startWorktime" />
						<AlertText alerts={$page.form} form="setting" field="stopWorktime" />
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Late Time</span>
					<div class="flex flex-col gap-2">
						<!-- bind:value={worktime['lateTime']} -->
						<input
							bind:value={worktime['lateTime']}
							class="input px-2 py-1 rounded-md"
							type="time"
							name="lateTime"
						/>

						<AlertText alerts={$page.form} form="setting" field="lateTime" />
					</div>
				</div>
				<button class="btn variant-filled-primary rounded-md" type="submit">Save</button>
			</form>
		</div>

		<div class="space-y-4">
			<div class="flex justify-between items-start mb-2">
				<span class="text-lg font-semibold">Holiday Setting</span>
				<button
					on:click={() => handleModal(modalStore, 'Create Holiday', 'createHoliday', HolidayModal)}
					class="btn-icon variant-filled-primary"
				>
					<i class="fa fa-plus" />
				</button>
			</div>
			<div class="card">
				{#key render}
					<AttnCalendar events={holidays} {handleDay} {handleEvent} />
				{/key}
			</div>
		</div>
	</div>
</div>
