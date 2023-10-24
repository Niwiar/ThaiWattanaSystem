<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export const formData: any = {};
	export const size: string = '';

	// Stores
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import PaymentOptions from '$src/lib/components/base/PaymentOptions.svelte';
	import ModalFormBase from '$src/lib/components/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { page } from '$app/stores';
</script>

<ModalFormBase {parent} {size}>
	<label class="label gap-2 flex justify-start items-center" for="type">
		<span class="w-20">Type</span>
		<select class="select rounded-md px-2 py-1 w-28 h-full" name="type">
			<PaymentOptions />
		</select>
	</label>
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Payment</span>
		<input class="input rounded-md px-2 py-1 w-20" type="text" name="name" placeholder="Name" />
		<AlertText alerts={$page.form} form="payment" field="name" />
	</label>
	<label class="label gap-2 flex justify-start items-center" for="amount">
		<span class="w-20">Amount</span>
		<input
			class="input rounded-md px-2 py-1 w-20"
			type="number"
			name="amount"
			placeholder="Amount"
		/>
		<select class="select rounded-md px-2 py-1 w-28 h-full" name="payType">
			<PayTypeOptions />
		</select>
	</label>

	<AlertText alerts={$page.form} form="payment" field="amount" />
	<AlertText alerts={$page.form} form="payment" field="payType" />
</ModalFormBase>
