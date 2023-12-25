<script lang="ts">
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';

	// Props
	export let parent: any;
	export let formData: any = {};

	let otId: string = '';
	let ot: any = {};

	$: if (otId) {
		ot = $page.data.ot.find((o: any) => o.id === otId);
	}
	$: console.log(formData);
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<label for="date" class="flex justify-start items-center w-full">
		<span class="w-24">วันที่</span>
		<div class="flex flex-col">
			<input
				bind:value={formData.date}
				type="date"
				class="input rounded-md px-2 py-1"
				name="date"
			/>
			<AlertText alerts={$page.form} form="attendance" field="date" />
		</div>
	</label>
	<label for="checkin" class="flex justify-start items-center w-full">
		<span class="w-24">เวลาเข้างาน</span>
		<div class="flex flex-col">
			<input type="time" class="input rounded-md px-2 py-1" name="checkin" />
			<AlertText alerts={$page.form} form="attendance" field="checkin" />
		</div>
	</label>
	<label for="checkout" class="flex justify-start items-center w-full">
		<span class="w-24">เวลาออกงาน</span>
		<div class="flex flex-col">
			<input type="time" class="input rounded-md px-2 py-1" name="checkout" />
			<AlertText alerts={$page.form} form="attendance" field="checkout" />
		</div>
	</label>
</ModalFormBase>
