<script lang="ts">
	import { pvGetMonth } from '$src/lib/datetime';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import EmployeeBillingTable from './EmployeeBillingTable.svelte';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data;
	export let form;

	let month: string = pvGetMonth(new Date());
	$: {
		if (form?.success) {
			modalStore.close();
			toastSuccess(toastStore, form.message);

			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
		}
	}
</script>

<div class="h-max space-y-2">
	<div class="flex justify-between items-center">
		<span class="text-2xl">Billing</span>
		<input bind:value={month} type="month" class="input rounded-md px-2 py-1 w-48" />
	</div>
	<div class="card">
		<EmployeeBillingTable
			{month}
			employeeSource={data.employees.map((employee) => ({
				...employee,
				payTypeText:
					employee.payType === 0 ? 'บาท/ชั่วโมง' : employee.payType === 1 ? 'บาท/วัน' : 'บาท/เดือน'
			}))}
		/>
	</div>
</div>
