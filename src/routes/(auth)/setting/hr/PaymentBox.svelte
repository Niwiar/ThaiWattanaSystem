<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PayTypeOptions from '$component/base/PayTypeOptions.svelte';

	export let pay: any = {};

	let disabled: boolean = true;
	let disabledClass = 'disabled:border-none disabled:bg-transparent';

	$: {
		if ($page.form?.success) {
			if ($page.form.name === 'payment' && $page.form.id === pay.id.toString()) disabled = true;
		}
	}
</script>

<form
	class="ml-2 space-y-1"
	method="POST"
	action="?/editPayment"
	use:enhance
	enctype="multipart/form-data"
>
	<div class="grid grid-flow-row grid-cols-[1fr_4.2rem_6.5rem_70px]">
		<input type="text" name="id" bind:value={pay.id} hidden />
		<input type="text" name="type" bind:value={pay.type} hidden />
		<input
			class="input rounded-md px-2 py-1 w-full {disabled && disabledClass}"
			type="text"
			name="name"
			bind:value={pay.name}
			placeholder="Salary"
			{disabled}
		/>
		<input
			class="input rounded-md px-2 py-1 w-full {disabled && disabledClass}"
			type="text"
			name="amount"
			bind:value={pay.amount}
			placeholder="Amount"
			{disabled}
		/>
		<select
			class="select rounded-md px-2 py-1 w-full {disabled && disabledClass}"
			bind:value={pay.payType}
			name="payType"
			{disabled}
		>
			<PayTypeOptions />
		</select>
		{#if disabled}
			<button class="btn-icon btn-icon-sm !p-2" type="button" on:click={() => (disabled = false)}>
				<i class="fa fa-edit" />
			</button>
		{/if}
		{#if !disabled}
			<div class="flex flex-row justify-end items-center !px-0">
				<button class="btn-icon btn-icon-sm !p-2" type="submit"><i class="fa fa-save" /></button>
				<form method="POST" action="?/deletePayment" use:enhance>
					<input type="text" name="id" bind:value={pay.id} hidden />
					<button class="btn-icon btn-icon-sm !p-2" type="submit">
						<i class="fa fa-trash text-danger" />
					</button>
				</form>
			</div>
		{/if}
	</div>
</form>
