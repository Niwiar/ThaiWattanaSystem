<script lang="ts">
	import { page } from '$app/stores';
	import { FILE_LOCATION } from '$src/constant';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import ImageInputPreview from '$component/base/ImageInput.svelte';
	import AvatarInput from '$component/base/AvatarInput.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { enhance } from '$app/forms';

	// Props
	export let parent: any;
	export let formData: any = {};

	let isDisabled: boolean = false;
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<div class="flex justify-between items-start gap-4">
		<AvatarInput
			initials="{formData.firstname ? formData.firstname[0] : ''}{formData.lastname
				? formData.lastname[0]
				: ''}"
			src={formData.imageFile ? FILE_LOCATION + formData.imageFile : ''}
		/>
		<div class="grid grid-rows-2 gap-4">
			<div class="grid grid-cols-2 gap-2">
				<label for="firstname">
					<span>ชื่อ</span>
					<input
						bind:value={formData.firstname}
						class="input rounded-md p-2"
						type="text"
						name="firstname"
						placeholder="Firstname"
						disabled={isDisabled}
					/>
				</label>
				<label for="lastname">
					<span>นามสกุล</span>
					<input
						bind:value={formData.lastname}
						class="input rounded-md p-2"
						type="text"
						name="lastname"
						placeholder="Lastname"
						disabled={isDisabled}
					/>
				</label>
				<AlertText alerts={$page.form} field="firstname" />
			</div>
			<label for="positionId">
				<span>ตำแหน่งงาน</span>
				<div class="flex flex-col">
					<select
						bind:value={formData.positionId}
						class="select rounded-md p-2"
						name="positionId"
						disabled={isDisabled}
					>
						<option value="">Choose position</option>
						{#each $page.data.positions as position (position.id)}
							<option value={position.id}>{position.name}</option>
						{/each}
					</select>
					<AlertText alerts={$page.form} field="positionId" />
				</div>
			</label>
		</div>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="birthdate" class="flex justify-start items-center w-full">
			<span class="w-20">วันเกิด</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.birthdate}
					type="date"
					class="input rounded-md p-2"
					name="birthdate"
					disabled={isDisabled}
				/>
				<AlertText alerts={$page.form} field="birthdate" />
			</div>
		</label>
		<label for="gender" class="flex justify-start items-center w-full">
			<span class="w-20">เพศ</span>
			<div class="flex flex-col">
				<select
					bind:value={formData.gender}
					class="select rounded-md p-2"
					name="gender"
					disabled={isDisabled}
				>
					<option value="" selected>Choose a gender</option>
					<option value="ชาย">ชาย</option>
					<option value="หญิง">หญิง</option>
					<option value="LGBTQ+">LGBTQ+</option>
					<option value="ไม่ระบุ">ไม่ระบุ</option>
				</select>
				<AlertText alerts={$page.form} field="gender" />
			</div>
		</label>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="nationality" class="flex justify-start items-center w-full">
			<span class="w-20">สัญชาติ</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.nationality}
					type="text"
					class="input rounded-md p-2"
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
					class="input rounded-md p-2"
					name="tel"
					placeholder="Telephone"
					disabled={isDisabled}
				/>
			</div>
		</label>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="address" class="flex justify-start items-center w-full">
			<span class="w-20">ที่อยู่</span>
			<div class="flex flex-col">
				<textarea
					bind:value={formData.address}
					class="input rounded-md p-2 w-[480px]"
					name="address"
					placeholder="Address"
					disabled={isDisabled}
				/>
			</div>
		</label>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="citizenId" class="flex justify-start items-center w-full">
			<span class="w-48">หมายเลขประจำตัวประชาชน</span>
			<div class="flex flex-col">
				<input
					bind:value={formData.citizenId}
					class="input rounded-md p-2 ml-3 w-64"
					type="text"
					name="citizenId"
					placeholder="Citizen ID"
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
