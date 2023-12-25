<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Props
	export let parent: any;
	export let formData: any = {};

	let otId: string = '';
	let ot: any = { amount: 0 };
	let time: number = 0;
	let amount: number = 0;
	let payType: number = 0;

	$: if (otId) {
		ot = $page.data.ot.find((o: any) => o.id === otId);
	}
	onMount(() => {
		if (formData) {
			console.log(formData);
			ot = $page.data.ot.find((o: any) => o.name === formData.ot.name.split('(')[0].trim());
			console.log(ot);
			amount = ot.amount;
			payType = ot.payType;
			otId = ot.id;
			time = parseFloat(formData.ot.name.split('(')[1].replace(' ชม.)', '').trim()) * 60;
		}
	});
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.ot.id} name="id" hidden />
	<input bind:value={formData.infomation.billing.id} name="billingId" hidden />
	<label for="date" class="flex justify-start items-center w-full">
		<span class="w-16">Date</span>
		<div class="flex flex-col">
			<input
				bind:value={formData.ot.date}
				type="date"
				class="input rounded-md px-2 py-1"
				name="date"
			/>
			<AlertText alerts={$page.form} form="attendance" field="date" />
		</div>
	</label>
	<label class="flex justify-start items-center w-full">
		<span class="w-16">Type</span>
		<div class="flex flex-col">
			<select bind:value={otId} name="otId" class="select w-64 rounded-md px-2 py-1">
				<option value="">เลือกประเภท O.T.</option>
				{#each $page.data.ot as ot}
					<option value={ot.id}>{ot.name}</option>
				{/each}
			</select>
			<AlertText alerts={$page.form} form="attendance" field="otId" />
		</div>
	</label>
	<label class="flex justify-start items-center w-full">
		<span class="w-16">Amount</span>
		<div class="flex flex-row">
			<input value={amount} type="number" class="input rounded-md px-2 py-1 w-16" name="amount" />
			<select class="select rounded-md px-2 py-1" bind:value={payType} name="payType">
				<PayTypeOptions />
			</select>
		</div>
	</label>
	<label class="flex justify-start items-center w-full">
		<span class="w-16">Time (min)</span>
		<div class="flex flex-col">
			<input bind:value={time} type="number" class="input rounded-md px-2 py-1" name="time" />
			<AlertText alerts={$page.form} form="attendance" field="time" />
		</div>
	</label>
	<div class="flex justify-start items-center">
		{#if formData.id}
			<form
				class="space-y-1"
				method="POST"
				action="?/deleteOT"
				use:enhance
				enctype="multipart/form-data"
			>
				<input bind:value={formData.ot.id} name="id" hidden />
				<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
			</form>
		{/if}
	</div>
</ModalFormBase>
