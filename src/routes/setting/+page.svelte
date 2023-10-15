<script lang="ts">
	import { enhance } from '$app/forms';
	import AttnCalendar from '$src/lib/components/hr/AttnCalendar.svelte';
	import type { Holiday } from '@prisma/client';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { EventClickArg, EventSourceInput } from 'svelte-fullcalendar';
	import HolidayModal from './HolidayModal.svelte';
	import { handleModal } from '$src/lib/action';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import { daysOfWeek } from '$src/constant';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { page } from '$app/stores';

	export let data;
	export let form;
	let render = 0;

	let holidays: EventSourceInput = [];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let workday: Record<string, boolean> = JSON.parse(data.setting.workday);

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
		const holiday = {
			date: new Date(date).toISOString().split('T')[0]
		};
		handleModal(modalStore, 'Create Holiday', 'createHoliday', HolidayModal, holiday);
	};

	const handleEvent = (e: EventClickArg) => {
		const event = e.event;
		if (!event.durationEditable) return;
		const holiday = {
			id: event.id,
			name: event.title,
			date: event.startStr
		};
		handleModal(modalStore, 'Edit Holiday', 'editHoliday', HolidayModal, holiday);
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
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							{#each Object.keys(workday) as day}
								<!-- <label class="label flex w-16 justify-start items-center gap-1">
									<input class="input w-4 rounded-md text-primary-500" type="checkbox" name={day} />
									<span class="capitalize !m-0">{day}</span>
								</label> -->
								<input bind:checked={workday[day]} type="checkbox" name="d{day}" hidden />
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
						<AlertText alerts={$page.form} field="workday" />
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Worktime</span>
					<div class="flex flex-col">
						<div class="flex items-center gap-2">
							<input
								bind:value={data.setting['startWorktime']}
								class="input px-2 rounded-md"
								type="time"
								name="startWorktime"
							/>
							-
							<input
								bind:value={data.setting['stopWorktime']}
								class="input px-2 rounded-md"
								type="time"
								name="stopWorktime"
							/>
						</div>
						<AlertText alerts={$page.form} field="startWorktime" />
						<AlertText alerts={$page.form} field="stopWorktime" />
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Leave Day</span>
					<div class="flex flex-col gap-2">
						<div class="flex justify-start items-center gap-2">
							<span class="w-20">Business</span>
							<input
								bind:value={data.setting['leaveBusiness']}
								class="input px-2 py-1 rounded-md w-16"
								type="number"
								min="0"
								max="99"
								name="leaveBusiness"
							/>
							<span>day</span>
						</div>
						<AlertText alerts={$page.form} field="leaveBusiness" />
						<div class="flex justify-start items-center gap-2">
							<span class="w-20">Sick</span>
							<input
								bind:value={data.setting['leaveSick']}
								class="input px-2 py-1 rounded-md w-16"
								type="number"
								min="0"
								max="99"
								name="leaveSick"
							/>
							<span>day</span>
						</div>
						<AlertText alerts={$page.form} field="leaveSick" />
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
			<div class="card h-[32rem]">
				{#key render}
					<AttnCalendar events={holidays} {handleDay} {handleEvent} />
				{/key}
			</div>
		</div>
	</div>
</div>
