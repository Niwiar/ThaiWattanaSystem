<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import type { PaymentList, RoleList } from '$src/lib/types/hr';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';
	import { handleModal } from '$src/lib/action';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import PositionTable from './PositionTable.svelte';
	import PaymentBox from './PaymentBox.svelte';
	import PaymentModal from './PaymentModal.svelte';
	import PositionModal from './PositionModal.svelte';
	import TeamTable from './TeamTable.svelte';
	import RoleTable from './RoleTable.svelte';
	import TeamModal from './TeamModal.svelte';
	import RoleModal from './RoleModal.svelte';

	export let data;
	export let form;

	let team: any = {};
	let roleSource: RoleList[] = [];

	let otSrc: PaymentList[] = [];
	let allowanceSrc: PaymentList[] = [];
	let welfareSrc: PaymentList[] = [];
	let deductionSrc: PaymentList[] = [];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	$: {
		if (data.payments) {
			otSrc = data.payments.filter((pay: PaymentList) => pay.type === 1) || [];
			allowanceSrc = data.payments.filter((pay: PaymentList) => pay.type === 2) || [];
			welfareSrc = data.payments.filter((pay: PaymentList) => pay.type === 3) || [];
			deductionSrc = data.payments.filter((pay: PaymentList) => pay.type === 4) || [];
		}
	}

	$: {
		if (form?.success) {
			if (
				form.name === 'position' ||
				form.name === 'team' ||
				form.name === 'role' ||
				(form.name === 'payment' && !form.id)
			)
				modalStore.close();
			toastSuccess(toastStore, form.message);
			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
		}
		Object.keys(team).length !== 0 ? fetchRole(team.id) : (roleSource = []);
	}
	const fetchRole = async (teamId: number) => {
		const roleRes = await fetch(`/api/setting/team/${teamId}/role`);
		const roles = await roleRes.json();
		console.log(roles.data);
		roleSource = roleRes.status == 200 ? (roles.data as RoleList[]) : [];
	};
</script>

<div class="space-y-2">
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_250px]">
			<div class="flex flex-col">
				<div class="flex justify-between items-center mb-2">
					<span class="text-lg font-semibold">Payment Setting</span>
					<button
						class="btn-icon variant-filled-primary"
						on:click={() =>
							handleModal(modalStore, 'Create Payment', 'createPayment', PaymentModal)}
					>
						<i class="fa fa-plus" />
					</button>
				</div>
				<div class="grid xl:grid-cols-2">
					<div class="space-y-2">
						<div>
							<span class="text-lg">O.T.</span>
							{#each otSrc as pay}
								<PaymentBox {pay} />
							{/each}
						</div>
						<div>
							<span class="text-lg">Allowance</span>
							{#each allowanceSrc as pay}
								<PaymentBox {pay} />
							{/each}
						</div>
						<div>
							<span class="text-lg">Welfare</span>
							{#each welfareSrc as pay}
								<PaymentBox {pay} />
							{/each}
						</div>
					</div>
					<div class="space-y-2">
						<div>
							<span class="text-lg">Deduction</span>
							{#each deductionSrc as pay}
								<PaymentBox {pay} />
							{/each}
						</div>
						<AlertText alerts={$page.form} form="payment" field="name" />
						<AlertText alerts={$page.form} form="payment" field="amount" />
						<AlertText alerts={$page.form} form="payment" field="payType" />
					</div>
				</div>
			</div>
			<div class="flex flex-col">
				<div class="flex justify-between items-center mb-2">
					<span class="text-lg font-semibold">Position List</span>
					<button
						class="btn-icon variant-filled-primary"
						on:click={() =>
							handleModal(modalStore, 'Create Position', 'createPosition', PositionModal)}
					>
						<i class="fa fa-plus" />
					</button>
				</div>
				<PositionTable positionSource={data.positions} />
			</div>
		</div>
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center">
					<span class="text-lg font-semibold">Team List</span>
					<button
						class="btn-icon variant-filled-primary"
						on:click={() => handleModal(modalStore, 'Create Team', 'createTeam', TeamModal)}
					>
						<i class="fa fa-plus" />
					</button>
				</div>
				<TeamTable bind:team teamSource={data.teams} />
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center">
					<span class="text-lg font-semibold">Role List</span>
					<button
						class="btn-icon variant-filled-primary disabled:variant-glass-primary"
						disabled={Object.keys(team).length === 0}
						on:click={() =>
							handleModal(modalStore, `Create Role for ${team.name}`, 'createRole', RoleModal, {
								formData: { teamId: team.id, teamName: team.name }
							})}
					>
						<i class="fa fa-plus" />
					</button>
				</div>
				<RoleTable {roleSource} />
			</div>
		</div>
	</div>
	<div class="flex flex-col" />
</div>
