<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import { handleModal } from '$src/lib/action';
	import EmployeeTable from './EmployeeTable.svelte';
	import EmployeeModal from './EmployeeModal.svelte';
	import PaymentEmployeeBox from './PaymentEmployeeBox.svelte';

	export let data;
	export let form;

	let employee: any = {};
	let paymentEmployee: any[] = [];

	let otSrc: any[] = [];
	let allowanceSrc: any[] = [];
	let welfareSrc: any[] = [];
	let deductionSrc: any[] = [];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: {
		if (form?.success) {
			if (form.name === 'employee') modalStore.close();
			toastSuccess(toastStore, form.message);
			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
		}
	}

	$: {
		paymentEmployee = [];
		if (Object.keys(employee).length !== 0) {
			fetchPaymentByEmployee(employee.id);
		}
	}

	const fetchPaymentByEmployee = async (employeeId: number) => {
		const paymentEmployeeRes = await fetch(`/api/setting/payment/employee/${employeeId}`);
		const paymentEmployees = await paymentEmployeeRes.json();
		paymentEmployee = paymentEmployeeRes.status == 200 ? paymentEmployees.data : [];
		if (paymentEmployee) {
			otSrc = paymentEmployee.filter((pay: any) => pay.payment.type === 1) || [];
			allowanceSrc = paymentEmployee.filter((pay: any) => pay.payment.type === 2) || [];
			welfareSrc = paymentEmployee.filter((pay: any) => pay.payment.type === 3) || [];
			deductionSrc = paymentEmployee.filter((pay: any) => pay.payment.type === 4) || [];
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto]">
		<div class="flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<span class="text-lg font-semibold">Employee Setting</span>
				<button
					class="btn-icon variant-filled-primary"
					on:click={() =>
						handleModal(modalStore, 'Create Employee', 'createEmployee', EmployeeModal, {
							size: 'w-full max-w-6xl'
						})}
				>
					<i class="fa fa-plus" />
				</button>
			</div>
			<div class="card">
				<EmployeeTable bind:employee employeeSource={data.employees} />
			</div>
		</div>
		{#if Object.keys(employee).length !== 0}
			<div class="flex flex-col xl:w-96">
				<div class="flex justify-between items-center mb-2">
					<span class="text-lg font-semibold">Payment List</span>
				</div>
				<div class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
					<div class="space-y-2">
						<div>
							<span class="text-lg">O.T.</span>
							{#each otSrc as pay}
								<PaymentEmployeeBox {pay} />
							{/each}
						</div>
						<div>
							<span class="text-lg">Allowance</span>
							{#each allowanceSrc as pay}
								<PaymentEmployeeBox {pay} />
							{/each}
						</div>
						<div>
							<span class="text-lg">Welfare</span>
							{#each welfareSrc as pay}
								<PaymentEmployeeBox {pay} />
							{/each}
						</div>
					</div>
					<div class="space-y-2">
						<div>
							<span class="text-lg">Deduction</span>
							{#each deductionSrc as pay}
								<PaymentEmployeeBox {pay} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
