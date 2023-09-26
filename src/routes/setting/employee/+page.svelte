<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { PositionList } from '$src/lib/types/hr';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import PositionTable from './PositionTable.svelte';
	import PaymentBox from './PaymentBox.svelte';
	import PaymentModal from './PaymentModal.svelte';

	export let data;
	export let form;
	let positionSetting: boolean = false;
	let position: any = {};
	let positionSelected: any;

	let positionSource: PositionList[];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const handlePayment = async () => {
		const res = await handlePaymentModal();
		console.log(res);
	};

	const handlePaymentModal = () =>
		new Promise((resolve) => {
			const modalFormComponent: ModalComponent = {
				ref: PaymentModal,
				// slot: '<p>Skeleton</p>',
				props: {}
			};
			const modalForm: ModalSettings = {
				type: 'component',
				component: modalFormComponent,
				title: 'Create Payment',
				body: 'Form for ...',
				value: { action: 'createEmployee' },
				response: (r) => resolve(r)
			};
			modalStore.trigger(modalForm);
		});

	const handleAddPosition = async () => {
		if (positionSelected) $positionSelected = [];
		position = {};
		positionSetting = true;
	};

	const positionSettingClose = () => {
		positionSetting = false;
		if (positionSelected) $positionSelected = [];
		position = {};
	};

	$: {
		if (form?.success) {
			if (form.type === 'position') positionSettingClose();
			if (form.type === 'payment' && $modalStore[0].response) $modalStore[0].response(form.message);
			modalStore.close();
			toastStore.trigger({
				message: `✔️ ${form.message}`,
				timeout: 10000,
				background: 'variant-filled-success text-surface-100'
			});
		}
	}
	$: positionSource = data.positions?.map((position: PositionList) => {
		let payTypeText: string;
		switch (position.payType) {
			case 3:
				payTypeText = 'รายเดือน';
				break;
			case 2:
				payTypeText = 'รายวัน';
				break;
			case 1:
				payTypeText = 'รายชั่วโมง';
				break;
			default:
				payTypeText = '';
		}
		return { ...position, payTypeText };
	});
</script>

<div class="space-y-2">
	<h2 class="text-lg font-bold">Employee Setting</h2>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
		<div class="flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<span class="text-lg font-semibold">Payment Setting</span>
				<button class="btn-icon variant-filled-primary" on:click={handlePayment}>
					<i class="fa fa-plus" />
				</button>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
				<div class="space-y-2">
					<div>
						<span class="text-lg">O.T.</span>
						<PaymentBox pay={{ id: 0, type: 1, name: 'O.T. 1.5x', amount: 0, payType: '1' }} />
					</div>
					<div>
						<span class="text-lg">Allowance</span>
					</div>
					<div>
						<span class="text-lg">Welfare</span>
					</div>
				</div>
				<div>
					<span class="text-lg">Deduction</span>
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<span class="text-lg font-semibold">Position List</span>
				<button class="btn-icon variant-filled-primary" on:click={handleAddPosition}>
					<i class="fa fa-plus" />
				</button>
			</div>
			<PositionTable
				bind:selected={positionSelected}
				bind:position
				bind:positionSetting
				{positionSource}
			/>
			{#if positionSetting}
				<div class="flex justify-start items-center my-2">
					<span class="text-lg font-semibold"
						>{position.id ? 'Edit Position' : 'Create Position'}</span
					>
				</div>
				<form
					class="space-y-1"
					method="POST"
					action="?/{position.id ? 'editPosition' : 'createPosition'}"
					use:enhance
					enctype="multipart/form-data"
				>
					<input bind:value={position.id} name="id" hidden />
					<label class="label gap-2 flex justify-start items-center" for="citizenCardFile">
						<span class="w-20">Position</span>
						<input
							bind:value={position.name}
							class="input rounded-md p-2 w-72"
							type="text"
							name="name"
							placeholder="Position"
						/>
					</label>
					<label class="label gap-2 flex justify-start items-center" for="citizenCardFile">
						<span class="w-20">Salary</span>
						<input
							bind:value={position.salary}
							class="input rounded-md p-2 w-20"
							type="text"
							name="salary"
							placeholder="Salary"
						/>
						<select
							bind:value={position.payType}
							class="select rounded-md p-2 w-28 h-full"
							name="payType"
						>
							<PayTypeOptions />
						</select>
					</label>
					<div class="flex justify-between items-center">
						<div>
							{#if position.id}
								<form
									class="space-y-1"
									method="POST"
									action="?/deletePosition"
									use:enhance
									enctype="multipart/form-data"
								>
									<input bind:value={position.id} name="id" hidden />
									<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
								</form>
							{/if}
						</div>
						<div>
							<button
								class="btn rounded-md variant-soft-secondary"
								type="reset"
								on:click={positionSettingClose}>Cancel</button
							>
							<button class="btn rounded-md variant-filled-primary" type="submit">Save</button>
						</div>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
