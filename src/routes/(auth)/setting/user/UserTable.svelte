<script lang="ts">
	import { page } from '$app/stores';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { DataHandler } from '@vincjo/datatables';
	import IndexCell from '$src/lib/components/datatable/IndexCell.svelte';
	import ThSort from '$src/lib/components/datatable/ThSort.svelte';
	import type { UserList } from '$src/lib/types/hr';
	import { handleModal } from '$src/lib/action';
	import PasswordModal from './PasswordModal.svelte';

	const modalStore = getModalStore();

	export let userSource: UserList[] = [];
	export let userSetting: boolean;
	export let userData = {};

	const handler = new DataHandler(userSource, { rowsPerPage: 20 });
	const rows = handler.getRows();

	export let selected = handler.getSelected();
	const handleSelected = (row: UserList, e: MouseEvent) => {
		const btn = e.target as HTMLButtonElement;
		if (btn.nodeName === 'BUTTON' || btn.nodeName === 'path')
			return handleModal(modalStore, 'Change Password', 'changePassword', PasswordModal, {
				formData: row
			});
		if ($selected.includes(row.id)) {
			userData = {};
			$selected = [];
			userSetting = false;
			return;
		}
		$selected = [];
		handler.select(row.id);
		userData = { ...row, ...JSON.parse(row.permission) };
		userSetting = true;
	};

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
					on:click={(e) => handleSelected(row, e)}
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
