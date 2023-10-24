<script lang="ts">
	import { page } from '$app/stores';
	import { FILE_LOCATION } from '$src/constant';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import ImageInputPreview from '$component/base/ImageInput.svelte';
	import AvatarInput from '$component/base/AvatarInput.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { enhance } from '$app/forms';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';

	// Props
	export let parent: any;
	export let formData: any = {};
	export let size: string = '';

	let isDisabled: boolean = false;
</script>

<ModalFormBase {parent} {size}>
	<input bind:value={formData.id} name="id" hidden />
	<div class="grid grid-cols-[auto_1fr] gap-4">
		<AvatarInput
			initials={formData.imageFile
				? null
				: formData.name
				? formData.name[0] + (formData.name[1] || '')
				: ''}
			src={formData.imageFile ? FILE_LOCATION + formData.imageFile : ''}
			width="w-48 lg:w-72"
		/>
		<div class="flex flex-col space-y-2">
			<div class="flex flex-col">
				<label for="employeeCode">
					<!-- <span class="w-20">รหัสพนักงาน</span> -->
					<input
						bind:value={formData.employeeCode}
						class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
						type="text"
						name="employeeCode"
						placeholder="Code"
						disabled={isDisabled}
					/>
				</label>
				<AlertText alerts={$page.form} form="employee" field="employeeCode" />
			</div>
			<div class="flex flex-col">
				<label class="flex items-center" for="name">
					<!-- <span class="w-20">ชื่อ</span> -->
					<input
						bind:value={formData.name}
						class="input variant-filled-surface variant-filled-surface rounded-md px-2 py-1 max-w-[24rem]"
						type="text"
						name="name"
						placeholder="Name"
						disabled={isDisabled}
					/>
				</label>
				<AlertText alerts={$page.form} form="employee" field="name" />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
				<label class="flex items-center" for="positionId">
					<!-- <span class="w-20">ตำแหน่ง</span> -->
					<div class="flex flex-col">
						<select
							bind:value={formData.positionId}
							class="select variant-filled-surface rounded-md px-2 py-1 max-w-[16rem]"
							name="positionId"
							disabled={isDisabled}
						>
							<option value="">Choose position</option>
							{#each $page.data.positions ?? [] as position (position.id)}
								<option value={position.id}>{position.name}</option>
							{/each}
						</select>
						<AlertText alerts={$page.form} form="employee" field="positionId" />
					</div>
				</label>
				<div class="grid grid-cols-2 gap-2">
					<label class="flex items-center" for="teamId">
						<!-- <span class="w-20">ทีม</span> -->
						<div class="flex flex-col">
							<select
								bind:value={formData.teamId}
								class="select variant-filled-surface rounded-md px-2 py-1 max-w-[16rem]"
								name="teamId"
								disabled={isDisabled}
							>
								<option value="">Choose team</option>
								{#each $page.data.teams ?? [] as team (team.id)}
									<option value={team.id}>{team.name}</option>
								{/each}
							</select>
							<AlertText alerts={$page.form} form="employee" field="teamId" />
						</div>
					</label>
					<label class="flex items-center" for="roleId">
						<!-- <span class="w-20">หน้าที่</span> -->
						<div class="flex flex-col">
							<select
								bind:value={formData.roleId}
								class="select variant-filled-surface rounded-md px-2 py-1 max-w-[16rem]"
								name="roleId"
								disabled={isDisabled}
							>
								<option value="">Choose role</option>
								{#each $page.data.roles ?? [] as role (role.id)}
									<option value={role.id}>{role.name}</option>
								{/each}
							</select>
							<AlertText alerts={$page.form} form="employee" field="roleId" />
						</div>
					</label>
					<AlertText alerts={$page.form} form="employee" field="firstname" />
				</div>
			</div>

			<label class="flex items-center" for="salary">
				<!-- <span class="w-20">เงินเดือน</span> -->
				<div class="flex flex-col">
					<div class="flex space-x-2">
						<input
							bind:value={formData.salary}
							class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
							type="text"
							name="salary"
							placeholder="Salary"
							disabled={isDisabled}
						/>
						<select
							bind:value={formData.payType}
							class="select variant-filled-surface rounded-md px-2 py-1 w-40"
							name="payType"
							disabled={isDisabled}
						>
							<PayTypeOptions />
						</select>
					</div>
					<AlertText alerts={$page.form} form="employee" field="salary" />
				</div>
			</label>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				<label class="flex items-center" for="leaveBusiness">
					<span class="w-20">วันลากิจ</span>
					<div class="flex flex-col">
						<div class="flex space-x-2">
							<input
								bind:value={formData.leaveBusiness}
								class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
								type="number"
								name="leaveBusiness"
								placeholder="Business Leave"
								disabled={isDisabled}
							/>
						</div>
						<AlertText alerts={$page.form} form="employee" field="leaveBusiness" />
					</div>
				</label>
				<label class="flex items-center" for="leaveSick">
					<span class="w-20">วันลาป่วย</span>
					<div class="flex flex-col">
						<div class="flex space-x-2">
							<input
								bind:value={formData.leaveSick}
								class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
								type="number"
								name="leaveSick"
								placeholder="Sick Leave"
								disabled={isDisabled}
							/>
						</div>
						<AlertText alerts={$page.form} form="employee" field="leaveSick" />
					</div>
				</label>
			</div>
			<label for="workdate" class="flex justify-start items-center w-full">
				<span class="w-20">วันที่เริ่มงาน</span>
				<div class="flex flex-col">
					<input
						bind:value={formData.workdate}
						type="date"
						class="input variant-filled-surface rounded-md px-2 py-1 w-40"
						name="workdate"
						disabled={isDisabled}
					/>
					<AlertText alerts={$page.form} form="employee" field="workdate" />
				</div>
			</label>
		</div>
	</div>
	<div class="grid grid-cols-2">
		<label for="birthdate" class="flex justify-start items-center">
			<span class="w-20">วันเกิด</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.birthdate}
					type="date"
					class="input variant-filled-surface rounded-md px-2 py-1"
					name="birthdate"
					disabled={isDisabled}
				/>
				<AlertText alerts={$page.form} form="employee" field="birthdate" />
			</div>
		</label>
		<label for="gender" class="flex justify-start items-center">
			<span class="w-20">เพศ</span>
			<div class="flex flex-col">
				<select
					bind:value={formData.gender}
					class="select variant-filled-surface rounded-md px-2 py-1"
					name="gender"
					disabled={isDisabled}
				>
					<option value="" selected>Choose a gender</option>
					<option value="ชาย">ชาย</option>
					<option value="หญิง">หญิง</option>
					<option value="LGBTQ+">LGBTQ+</option>
					<option value="ไม่ระบุ">ไม่ระบุ</option>
				</select>
				<AlertText alerts={$page.form} form="employee" field="gender" />
			</div>
		</label>
	</div>
	<div class="grid grid-cols-2">
		<label for="nationality" class="flex justify-start items-center w-full">
			<span class="w-20">สัญชาติ</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.nationality}
					type="text"
					class="input variant-filled-surface rounded-md px-2 py-1"
					name="nationality"
					placeholder="Nationality"
					disabled={isDisabled}
				/>
			</div>
		</label>
		<label for="tel" class="flex justify-start items-center w-full">
			<span class="w-20">เบอร์โทร</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.tel}
					type="tel"
					class="input variant-filled-surface rounded-md px-2 py-1"
					name="tel"
					placeholder="Telephone"
					disabled={isDisabled}
				/>
			</div>
		</label>
	</div>
	<label for="address" class="flex justify-start items-center w-full">
		<span class="w-20">ที่อยู่</span>
		<div class="flex flex-col">
			<textarea
				bind:value={formData.address}
				class="input variant-filled-surface rounded-md px-2 py-1 w-[480px]"
				name="address"
				placeholder="Address"
				disabled={isDisabled}
			/>
		</div>
	</label>
	<div class="grid lg:grid-cols-2 gap-2">
		<label for="citizenId" class="flex justify-start items-center w-full">
			<span class="w-48">หมายเลขประจำตัวประชาชน</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.citizenId}
					class="input variant-filled-surface rounded-md px-2 py-1 ml-3 w-64"
					type="text"
					name="citizenId"
					placeholder="Citizen ID"
					disabled={isDisabled}
				/>
			</div>
		</label>
		<label for="socialServiceId" class="flex justify-start items-center w-full">
			<span class="w-48">หมายเลขสมาชิกประกันสังคม</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.socialServiceId}
					class="input variant-filled-surface rounded-md px-2 py-1 ml-3 w-64"
					type="text"
					name="socialServiceId"
					placeholder="Social Service ID"
					disabled={isDisabled}
				/>
			</div>
		</label>
	</div>
	<ImageInputPreview
		src={formData.citizenCardFile ? FILE_LOCATION + formData.citizenCardFile : ''}
		label="บัตรประจำตัวประชาชน"
		name="citizenCardFile"
		title="Citizen Card"
	/>
	<ImageInputPreview
		src={formData.jobApplicationFile ? FILE_LOCATION + formData.jobApplicationFile : ''}
		label="ใบสมัครงาน"
		name="jobApplicationFile"
		title="Job Application"
	/>
	<ImageInputPreview
		src={formData.workPermitFile ? FILE_LOCATION + formData.workPermitFile : ''}
		label="ใบอนุญาติทำงาน"
		name="workPermitFile"
		title="Work Permit"
	/>
	<div class="flex justify-start items-center">
		{#if formData.id}
			<form
				class="space-y-1"
				method="POST"
				action="?/deleteEmployee"
				use:enhance
				enctype="multipart/form-data"
			>
				<input bind:value={formData.id} name="id" hidden />
				<button class="btn rounded-md variant-ghost-error" type="submit">Delete</button>
			</form>
		{/if}
	</div>
</ModalFormBase>
