<script lang="ts">
	import { page } from '$app/stores';
	import { FILE_LOCATION } from '$src/constant';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import ImageInputPreview from '$component/base/ImageInput.svelte';
	import AvatarInput from '$component/base/AvatarInput.svelte';
	import type { ActionData } from './$types';
	import AlertText from '$src/lib/components/AlertText.svelte';

	// Props
	export let parent: any;
	export let employee = {
		id: 0,
		firstname: '',
		lastname: '',
		positionId: '',
		birthdate: '',
		gender: '',
		address: '',
		tel: '',
		citizenId: '',
		nationality: '',
		imageFile: '',
		citizenCardFile: '',
		jobApplicationFile: '',
		workPermitFile: ''
	};
</script>

<ModalFormBase {parent}>
	<input bind:value={employee.id} hidden />
	<div class="flex justify-between items-start gap-4">
		<AvatarInput
			initials="{employee.firstname ? employee.firstname[0] : ''}{employee.lastname
				? employee.lastname[0]
				: ''}"
			src={employee.imageFile ? FILE_LOCATION + employee.imageFile : ''}
		/>
		<div class="grid grid-rows-2 gap-4">
			<div class="grid grid-cols-2 gap-2">
				<label for="firstname">
					<span>ชื่อ</span>
					<input
						bind:value={employee.firstname}
						class="input rounded-md p-2"
						type="text"
						name="firstname"
						placeholder="Firstname"
					/>
				</label>
				<label for="lastname">
					<span>นามสกุล</span>
					<input
						bind:value={employee.lastname}
						class="input rounded-md p-2"
						type="text"
						name="lastname"
						placeholder="Lastname"
					/>
				</label>
				<AlertText alerts={$page.form} field="firstname" />
			</div>
			<label for="positionId">
				<span>ตำแหน่งงาน</span>
				<div class="flex flex-col">
					<select bind:value={employee.positionId} class="select rounded-md p-2" name="positionId">
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
					bind:value={employee.birthdate}
					type="date"
					class="input rounded-md p-2"
					name="birthdate"
				/>
				<AlertText alerts={$page.form} field="birthdate" />
			</div>
		</label>
		<label for="gender" class="flex justify-start items-center w-full">
			<span class="w-20">เพศ</span>
			<div class="flex flex-col">
				<select bind:value={employee.gender} class="select rounded-md p-2" name="gender">
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
					bind:value={employee.nationality}
					type="text"
					class="input rounded-md p-2"
					name="nationality"
					placeholder="Nationality"
				/>
			</div>
		</label>
		<label for="tel" class="flex justify-start items-center w-full">
			<span class="w-20">เบอร์โทร</span>
			<div class="flex flex-col">
				<input
					bind:value={employee.tel}
					type="tel"
					class="input rounded-md p-2"
					name="tel"
					placeholder="Telephone"
				/>
			</div>
		</label>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="address" class="flex justify-start items-center w-full">
			<span class="w-20">ที่อยู่</span>
			<div class="flex flex-col">
				<input
					bind:value={employee.address}
					type="text"
					class="input rounded-md p-2"
					name="address"
					placeholder="Address"
				/>
			</div>
		</label>
	</div>
	<div class="flex justify-between items-center gap-4">
		<label for="citizenId" class="flex justify-between items-center w-full">
			<span class="w-72">หมายเลขประจำตัวประชาชน</span>
			<div class="flex flex-col">
				<input
					bind:value={employee.citizenId}
					class="input rounded-md p-2 ml-3"
					type="text"
					name="citizenId"
					placeholder="Citizen ID"
				/>
			</div>
		</label>
	</div>
	<ImageInputPreview
		src={employee.citizenCardFile ? FILE_LOCATION + employee.citizenCardFile : ''}
		label="บัตรประจำตัวประชาชน"
		name="citizenCardFile"
		title="Citizen Card"
	/>
	<ImageInputPreview
		src={employee.jobApplicationFile ? FILE_LOCATION + employee.jobApplicationFile : ''}
		label="ใบสมัครงาน"
		name="jobApplicationFile"
		title="Job Application"
	/>
	<ImageInputPreview
		src={employee.workPermitFile ? FILE_LOCATION + employee.workPermitFile : ''}
		label="ใบอนุญาติทำงาน"
		name="workPermitFile"
		title="Work Permit"
	/>
</ModalFormBase>
