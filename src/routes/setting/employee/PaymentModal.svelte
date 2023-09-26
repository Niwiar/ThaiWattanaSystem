<script lang="ts">
	import { enhance } from '$app/forms';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import PaymentOptions from '$src/lib/components/base/PaymentOptions.svelte';
	import ModalFormBase from '$src/lib/components/base/ModalFormBase.svelte';
</script>

<ModalFormBase {parent}>
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Type</span>
		<select class="select rounded-md p-2 w-28 h-full" name="payType">
			<PaymentOptions />
		</select>
	</label>
	<label class="label gap-2 flex justify-start items-center" for="name">
		<span class="w-20">Payment</span>
		<input class="input rounded-md p-2 w-20" type="text" name="name" placeholder="Name" />
	</label>
	<label class="label gap-2 flex justify-start items-center" for="citizenCardFile">
		<span class="w-20">Amount</span>
		<input class="input rounded-md p-2 w-20" type="text" name="amount" placeholder="Amount" />
		<select class="select rounded-md p-2 w-28 h-full" name="payType">
			<PayTypeOptions />
		</select>
	</label>
</ModalFormBase>
