<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';

	import IndexCell from '$component/table/IndexCell.svelte';
	import ThSort from '$component/table/ThSort.svelte';
	import type { UserList } from '$src/lib/types/hr';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import PasswordModal from './PasswordModal.svelte';

	export let userSource: UserList[] = [];
	export let userSetting: boolean;
	export let user = {};

	const handler = new DataHandler(userSource, { rowsPerPage: 20 });
	const rows = handler.getRows();

	export let selected = handler.getSelected();
	const handleSelected = (row: UserList) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON') return handleChangePass(row);
		if ($selected.includes(row.id)) {
			user = {};
			$selected = [];
			userSetting = false;
			return;
		}
		$selected = [];
		handler.select(row.id);
		const { hr, production, warehouse, setting } = JSON.parse(row.permission);
		user = { ...row, hr, production, warehouse, setting };
		userSetting = true;
	};

	const modalStore = getModalStore();

	const handleChangePass = async (row: UserList) => {
		const res = await handleChangePassModal(row);
		console.log(res);
	};

	const handleChangePassModal = (row: UserList) =>
		new Promise((resolve) => {
			const modalFormComponent: ModalComponent = {
				ref: PasswordModal,
				props: { employee: row }
			};
			const modalForm: ModalSettings = {
				type: 'component',
				component: modalFormComponent,
				title: 'Change Password',
				body: 'Form for ...',
				value: { action: 'changePassword' },
				response: (r) => resolve(r)
			};
			modalStore.trigger(modalForm);
		});

	$: userSource, handler.setRows(userSource);
</script>

<div class="table-container">
	<table class="table table-interactive table-compact overflow-y-auto">
		<thead>
			<tr class="bg-primary-500 text-white">
				<th>Index</th>
				<ThSort {handler} orderBy="username">Username</ThSort>
				<ThSort {handler} orderBy="email">Email</ThSort>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row, i}
				<tr
					class:table-row-checked={$selected.includes(row.id)}
					on:click={() => handleSelected(row)}
				>
					<IndexCell {handler} rowNumber={i} />
					<td>{row.username}</td>
					<td>{row.email}</td>
					<td class="!align-middle">
						<button class="btn variant-soft-primary rounded-md"><i class="fa fa-key" /></button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	table {
		max-height: 500px;
	}
</style>
