<script lang="ts">
	import { page } from '$app/stores';
	import PermissionRadio from './PermissionRadio.svelte';
	import UserTable from './UserTable.svelte';
	import type { UserList } from '$src/lib/types/hr';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let form;
	export let data;

	let userSetting: boolean = false;
	let user: any = {};
	let userSelected: any;

	let userSource: UserList[] = [];

	let userP = {
		hr: 0,
		production: 0,
		warehouse: 0,
		setting: 0
	};

	const toastStore = getToastStore();

	const handleAddUser = () => {
		if (userSelected) $userSelected = [];
		user = {};
		userP = {
			hr: 0,
			production: 0,
			warehouse: 0,
			setting: 0
		};
		userSetting = true;
	};

	const userSettingClose = () => {
		userSetting = false;
		if (userSelected) $userSelected = [];
	};

	$: userSource = data.users;
	$: userP = {
		hr: user.hr,
		production: user.production,
		warehouse: user.warehouse,
		setting: user.setting
	};

	$: {
		if (form?.success) {
			userSettingClose();
			toastStore.trigger({
				message: `✔️ ${form.message}`,
				timeout: 10000,
				background: 'variant-filled-success text-surface-100'
			});
		} else if (form?.error) {
			toastStore.trigger({
				message: `❗ ${form.message}`,
				autohide: false,
				background: 'variant-filled-error text-surface-100'
			});
		}
	}
</script>

<div class="space-y-2">
	<h2 class="text-lg font-bold">User Setting</h2>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
		<div class="flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<span class="text-lg font-semibold">User List</span>
				<button class="btn-icon variant-filled-primary" on:click={handleAddUser}>
					<i class="fa fa-plus" />
				</button>
			</div>
			<UserTable bind:selected={userSelected} bind:userSetting bind:user {userSource} />
		</div>

		{#if userSetting}
			<div class="flex flex-col">
				<form
					class="space-y-2"
					method="POST"
					action="?/{user.id ? 'editUser' : 'createUser'}"
					use:enhance
					enctype="multipart/form-data"
				>
					<input bind:value={user.id} name="id" hidden />
					<div>
						<span class="text-lg font-semibold">{user.id ? 'Edit User' : 'Create User'}</span>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">Username</span>
							<div class="flex flex-col">
								<input
									bind:value={user.username}
									class="input rounded-md w-full p-2"
									type="text"
									name="username"
									placeholder="Username"
								/>
								<AlertText alerts={$page.form} field="username" />
							</div>
						</label>
						<label class="label gap-2 flex justify-start items-center" for="email">
							<span class="w-24">Email</span>
							<div class="flex flex-col">
								<input
									bind:value={user.email}
									class="input rounded-md p-2"
									type="email"
									name="email"
									placeholder="Email"
								/>
								<AlertText alerts={$page.form} field="email" />
							</div>
						</label>
						{#if !user.id}
							<label class="label gap-2 flex justify-start items-center" for="password">
								<span class="w-24">Password</span>
								<div class="flex flex-col">
									<input
										class="input rounded-md p-2"
										type="password"
										name="password"
										placeholder="Password"
									/>
									<AlertText alerts={$page.form} field="password" />
								</div>
							</label>
						{/if}
					</div>

					<div>
						<span class="text-lg font-semibold">Permission</span>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">HR</span>
							<PermissionRadio group={userP.hr} name="hr" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">Production</span>
							<PermissionRadio group={userP.production} name="production" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">Warehouse</span>
							<PermissionRadio group={userP.warehouse} name="warehouse" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">Setting</span>
							<PermissionRadio group={userP.setting} name="setting" />
						</label>
					</div>

					<div class="flex justify-between items-center">
						<div>
							{#if user.id}
								<form
									class="space-y-1"
									method="POST"
									action="?/deletePosition"
									use:enhance
									enctype="multipart/form-data"
								>
									<input bind:value={user.id} name="id" hidden />
									<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
								</form>
							{/if}
						</div>
						<div>
							<button
								class="btn rounded-md variant-soft-secondary"
								type="reset"
								on:click={userSettingClose}>Cancel</button
							>
							{#if user.id}
								<button class="btn rounded-md variant-filled-tertiary" type="button"
									>Change Password</button
								>
							{/if}
							<button class="btn rounded-md variant-filled-primary" type="submit">Save</button>
						</div>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>
