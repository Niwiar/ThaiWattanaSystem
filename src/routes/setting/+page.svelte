<script lang="ts">
	import { enhance } from '$app/forms';
	import AttnCalendar from '$src/lib/components/hr/AttnCalendar.svelte';
	import type { EventSourceInput } from 'svelte-fullcalendar';

	let holidays: EventSourceInput = [];

	let workday: Record<string, boolean> = {
		mon: true,
		tue: true,
		wed: true,
		thu: true,
		fri: true,
		sat: true,
		sun: false
	};

	const handleWorkday = (day: string) => {
		workday[day] = !workday[day];
	};
</script>

<div class="space-y-4">
	<h2 class="text-lg font-bold">General Setting</h2>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<span class="text-lg font-semibold">Workday Setting</span>
			</div>
			<form method="POST" action="?/" use:enhance enctype="multipart/form-data" class="space-y-2">
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Workday</span>
					<div class="grid grid-cols-4 gap-2">
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						{#each Object.keys(workday) as day}
							<!-- <label class="label flex w-16 justify-start items-center gap-1">
								<input class="input w-4 rounded-md text-primary-500" type="checkbox" name={day} />
								<span class="capitalize !m-0">{day}</span>
							</label> -->
							<span
								class="chip {workday[day] ? 'variant-filled-tertiary' : 'variant-soft'}"
								on:click={() => handleWorkday(day)}
							>
								<span class="capitalize">{day}</span>
							</span>
						{/each}
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Worktime</span>
					<div class="flex items-center gap-2">
						<input class="input px-2 rounded-md" type="time" />
						-
						<input class="input px-2 rounded-md" type="time" />
					</div>
				</div>
				<div class="flex justify-start items-start gap-4">
					<span class="w-20">Leave Day</span>
					<div class="flex flex-col gap-2">
						<div class="flex justify-start items-center gap-2">
							<span class="w-20">Business</span>
							<input class="input px-2 py-1 rounded-md w-16" type="number" min="0" max="99" />
							<span>day</span>
						</div>
						<div class="flex justify-start items-center gap-2">
							<span class="w-20">Sick</span>
							<input class="input px-2 py-1 rounded-md w-16" type="number" min="0" max="99" />
							<span>day</span>
						</div>
					</div>
				</div>
				<button class="btn variant-filled-primary rounded-md" type="submit">Save</button>
			</form>
		</div>

		<div class="space-y-4">
			<div class="flex justify-between items-start mb-2">
				<span class="text-lg font-semibold">Holiday Setting</span>
				<button class="btn-icon variant-filled-primary">
					<i class="fa fa-plus" />
				</button>
			</div>
			<div class="card h-[32rem]">
				<AttnCalendar events={holidays} />
			</div>
		</div>
	</div>
</div>
