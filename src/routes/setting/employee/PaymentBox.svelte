<script lang="ts">
	import type { PaymentList } from '$src/lib/types/hr';

	export let pay: PaymentList = { id: 0, name: '', amount: 0, payType: '3' };

	let disabled: boolean = true;
	let disabledClass = 'disabled:border-none';

	const handleEdit = () => {};
</script>

<form class="ml-2 space-y-1">
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">{pay.name}</span>
		<input
			class="input rounded-md p-2 w-20 {disabled && disabledClass}"
			type="text"
			name="name"
			bind:value={pay.name}
			placeholder="Salary"
			{disabled}
		/>
		<input
			class="input rounded-md p-2 w-20 {disabled && disabledClass}"
			type="text"
			name="amount"
			bind:value={pay.amount}
			placeholder="Amount"
			{disabled}
		/>
		<select
			class="select rounded-md p-2 w-28 h-full {disabled && disabledClass}"
			bind:value={pay.payType}
			name="payType"
			{disabled}
		>
			<option value="3">บ./เดือน</option>
			<option value="2">บ./วัน</option>
			<option value="1">บ./ชั่วโมง</option>
		</select>
		<button class="btn-icon" type="button"><i class="fa fa-edit" /></button>
	</label>
</form>
