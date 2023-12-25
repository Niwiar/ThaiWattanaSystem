<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	// Props
	export let payment: any = {};
	export let hideAmount: boolean = false;
	export let hidePeriod: boolean = false;
	export let hideTotal: boolean = false;
	export let isDisabled: boolean = true;
	export let name: string = '';

	let amountType: string = '';
	let periodType: string = '';
	let disabledClass = 'disabled:border-none disabled:bg-transparent';

	onMount(() => {
		amountType =
			payment.payType === 1 ? 'บ./ชั่วโมง' : payment.payType === 2 ? 'บ./วัน' : 'บ./เดือน';
		periodType = payment.payType === 1 ? 'ชั่วโมง' : payment.payType === 2 ? 'วัน' : 'เดือน';
		hidePeriod = payment.payType === 3;
	});
</script>

<div class="grid grid-cols-4 text-xs items-center p-1">
	<div>{payment.name}</div>
	<div class="text-justify">
		<div class="w-full" hidden={hideAmount}>
			<input
				class="input variant-soft-primary text-end rounded-md px-2 py-1 w-16 {isDisabled &&
					disabledClass}"
				type="number"
				{name}
				bind:value={payment.amount}
				min={0}
				placeholder="Amount"
				disabled={isDisabled}
			/>
			{amountType}
		</div>
	</div>
	<div class="text-end">
		<div class="w-full" hidden={hidePeriod}>{payment.period} {periodType}</div>
	</div>
	<div class="text-end" hidden={hideTotal}>{payment.amount * payment.period}</div>
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		appearance: textfield;
	}
</style>
