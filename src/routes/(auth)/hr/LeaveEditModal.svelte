<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Props
	export let parent: any;
	export let formData: any = {};

	let type: string = '1';
	let period: string = '1';

	onMount(() => {
		if (formData) {
			console.log(formData);
			if (formData.leave.name.includes('ลากิจ')) type = '1';
			else type = '2';
			if (formData.leave.name.includes('ทั้งวัน')) period = '1';
			else if (formData.leave.name.includes('เช้า')) period = '2';
			else period = '3';
		}
	});
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.leave.id} name="id" hidden />
	<label for="date" class="flex justify-start items-center w-full">
		<span class="w-16">Date</span>
		<div class="flex flex-col">
			<input
				bind:value={formData.leave.date}
				type="date"
				class="input rounded-md px-2 py-1"
				name="date"
			/>
			<AlertText alerts={$page.form} form="attendance" field="date" />
		</div>
	</label>
	<label for="type" class="flex justify-start items-center w-full">
		<span class="w-16">Type</span>
		<div class="flex flex-col">
			<RadioGroup
				rounded="rounded-md"
				active="variant-filled-tertiary"
				hover="hover:variant-soft-tertiary"
			>
				<RadioItem bind:group={type} name="type" value="1">
					<i class="fa fa-briefcase" /> ลากิจ
				</RadioItem>
				<RadioItem bind:group={type} name="type" value="2">
					<i class="fa fa-heart-pulse" /> ลาป่วย
				</RadioItem>
			</RadioGroup>
			<AlertText alerts={$page.form} form="attendance" field="type" />
		</div>
	</label>
	<label for="period" class="flex justify-start items-center w-full">
		<span class="w-16">Period</span>
		<div class="flex flex-col">
			<RadioGroup
				rounded="rounded-md"
				active="variant-filled-tertiary"
				hover="hover:variant-soft-tertiary"
			>
				<RadioItem bind:group={period} name="period" value="1">ทั้งวัน</RadioItem>
				<RadioItem bind:group={period} name="period" value="2">กะเช้า</RadioItem>
				<RadioItem bind:group={period} name="period" value="3">กะบ่าย</RadioItem>
			</RadioGroup>
			<AlertText alerts={$page.form} form="attendance" field="period" />
		</div>
	</label>
	<div class="flex justify-start items-center">
		{#if formData.id}
			<form
				class="space-y-1"
				method="POST"
				action="?/deleteLeave"
				use:enhance
				enctype="multipart/form-data"
			>
				<input bind:value={formData.leave.id} name="id" hidden />
				<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
			</form>
		{/if}
	</div>
</ModalFormBase>
