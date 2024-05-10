<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let pay: any = {};
	let payTypeText: string = '';

	let disabled: boolean = true;
	let disabledClass = 'disabled:border-none disabled:bg-transparent';

	$: {
		payTypeText = pay.payment.payType === 1 ? 'บ./ชั่วโมง' : pay.payment.payType === 2 ? 'บ./วัน' : 'บ./เดือน';
		if ($page.form?.success) {
			if ($page.form.name === 'payment' && $page.form.id === pay.id.toString()) disabled = true;
		}
	}
</script>

<form method="POST" action="?/editPaymentEmployee" use:enhance enctype="multipart/form-data">
	<div class="grid grid-flow-row grid-cols-[2rem_1fr_4.2rem_6.5rem_70px]">
		<input type="text" name="id" bind:value={pay.id} hidden />
		<input type="checkbox" name="active" class="" checked={pay.active} {disabled} />
		<span class="px-2 py-1 w-full">{pay.payment.name}</span>
		<input
			class="input rounded-md px-2 py-1 w-full {disabled && disabledClass}"
			type="number"
			name="amount"
			bind:value={pay.amount}
			placeholder="Amount"
			{disabled}
		/>
		<span class="px-2 py-1 w-full">{payTypeText}</span>
		{#if disabled}
			<button class="btn-icon btn-icon-sm !p-2" type="button" on:click={() => (disabled = false)}>
				<i class="fa fa-edit" />
			</button>
		{:else}
			<div class="flex flex-row justify-end items-center !px-0">
				<button class="btn-icon btn-icon-sm !p-2" type="submit"><i class="fa fa-save" /></button>
			</div>
		{/if}
	</div>
</form>
