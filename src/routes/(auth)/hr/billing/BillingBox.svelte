<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	// Props
	export let payment: any = {};

	let amountType: string = '';
	let periodType: string = '';
	let isDisabled: boolean = true;
	let disabledClass = 'disabled:border-none disabled:bg-transparent';

	onMount(() => {
		amountType =
			payment.payType === 0 ? 'บาท/ชั่วโมง' : payment.payType === 1 ? 'บาท/วัน' : 'บาท/เดือน';
		periodType = payment.payType === 0 ? 'ชั่วโมง' : payment.payType === 1 ? 'วัน' : 'เดือน';
	});
</script>

<div class="grid grid-cols-4">
	<span>{payment.name}</span>
	<span>
		<input
			class="input rounded-md px-2 py-1 w-20 {isDisabled && disabledClass}"
			type="text"
			name="amount"
			bind:value={payment.amount}
			placeholder="Amount"
			disabled={isDisabled}
		/>
		{amountType}
	</span>
	<span>{payment.period} {periodType}</span>
	<span>{payment.total}</span>
</div>
