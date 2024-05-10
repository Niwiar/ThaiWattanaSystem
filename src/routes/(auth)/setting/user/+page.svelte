<script lang="ts">
	import { page } from '$app/stores';
	import PermissionRadio from './PermissionRadio.svelte';
	import UserTable from './UserTable.svelte';
	import type { UserList } from '$src/lib/types/hr';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { enhance } from '$app/forms';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { toastError, toastSuccess } from '$src/lib/action/toast.action';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let form;
	export let data;

	let userSetting: boolean = false;
	let userData: any = {};
	let userSelected: any;

	let userSource: UserList[] = [];

	let userP = {
		hr: 0,
		production: 0,
		warehouse: 0,
		setting: 0,
		user: 0
	};

	const handleAddUser = () => {
		if (userSelected) $userSelected = [];
		userData = {};
		userP = {
			hr: 0,
			production: 0,
			warehouse: 0,
			setting: 0,
			user: 0
		};
		userSetting = true;
	};

	const userSettingClose = () => {
		userSetting = false;
		if (userSelected) $userSelected = [];
	};

	$: userSource = data.users;
	$: userP = {
		hr: userData.hr,
		production: userData.production,
		warehouse: userData.warehouse,
		setting: userData.setting,
		user: userData.user
	};

	$: {
		if (form?.success) {
			if (form.type === 'user') userSettingClose();
			if (form.type === 'password') modalStore.close();
			toastSuccess(toastStore, form.message);
			form.success = false;
		} else if (form?.error) {
			toastError(toastStore, form.message);
			form.error = false;
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
			<UserTable bind:selected={userSelected} bind:userSetting bind:userData {userSource} />
		</div>

		{#if userSetting}
			<div class="flex flex-col">
				<form
					class="space-y-2"
					method="POST"
					action="?/{userData.id ? 'editUser' : 'createUser'}"
					use:enhance
					enctype="multipart/form-data"
				>
					<input bind:value={userData.id} name="id" hidden />
					<div>
						<span class="text-lg font-semibold">{userData.id ? 'Edit User' : 'Create User'}</span>
						<label class="label gap-2 flex justify-start items-center" for="username">
							<span class="w-24">Username</span>
							<div class="flex flex-col">
								<input
									bind:value={userData.username}
									class="input rounded-md w-full p-2"
									type="text"
									name="username"
									placeholder="Username"
								/>
								<AlertText form="user" alerts={$page.form} field="username" />
							</div>
						</label>
						<label class="label gap-2 flex justify-start items-center" for="email">
							<span class="w-24">Email</span>
							<div class="flex flex-col">
								<input
									bind:value={userData.email}
									class="input rounded-md p-2"
									type="email"
									name="email"
									placeholder="Email"
								/>
								<AlertText form="user" alerts={$page.form} field="email" />
							</div>
						</label>
						{#if !userData.id}
							<label class="label gap-2 flex justify-start items-center" for="password">
								<span class="w-24">Password</span>
								<div class="flex flex-col">
									<input
										class="input rounded-md p-2"
										type="password"
										name="password"
										placeholder="Password"
									/>
									<AlertText form="user" alerts={$page.form} field="password" />
								</div>
							</label>
						{/if}
					</div>

					<div>
						<span class="text-lg font-semibold">Permission</span>
						<label class="label gap-2 flex justify-start items-center" for="hr">
							<span class="w-24">HR</span>
							<PermissionRadio group={userP.hr} name="hr" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="production">
							<span class="w-24">Production</span>
							<PermissionRadio group={userP.production} name="production" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="warehouse">
							<span class="w-24">Warehouse</span>
							<PermissionRadio group={userP.warehouse} name="warehouse" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="setting">
							<span class="w-24">Setting</span>
							<PermissionRadio group={userP.setting} name="setting" />
						</label>
						<label class="label gap-2 flex justify-start items-center" for="user">
							<span class="w-24">User</span>
							<PermissionRadio group={userP.user} name="user" />
						</label>
					</div>

					<div class="flex justify-between items-center">
						<div>
							{#if userData.id}
								<form
									class="space-y-1"
									method="POST"
									action="?/deletePosition"
									use:enhance
									enctype="multipart/form-data"
								>
									<input bind:value={userData.id} name="id" hidden />
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
							<button class="btn rounded-md variant-filled-primary" type="submit">Save</button>
						</div>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>
