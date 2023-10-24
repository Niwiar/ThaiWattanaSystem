<script lang="ts">
	import { pvGetMonth } from '$src/lib/datetime';

	let month: string = pvGetMonth(new Date());
	$: console.log(month);
</script>

<div class=" grid grid-cols-1 lg:grid-cols-[minmax(500px,_1fr)_auto]">
	<div class="h-max space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-2xl">Billing</span>
			<input bind:value={month} type="month" class="input rounded-md px-2 py-1 w-48" />
		</div>
		<div class="card" />
	</div>
	<div class="ml-0 mt-4 lg:ml-4 lg:mt:0 card space-y-2 p-4 overflow-y-auto" />
</div>
