<script lang="ts">
	import { page } from '$app/stores';
	import { EMPLOYEE_LOCATION } from '$src/constant';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { pvDiffDate, pvGetDateDMY, pvToDate } from '$src/lib/datetime';
	import type { RoleList } from '$src/lib/types/hr';
	import Modal from '$src/lib/components/base/Modal.svelte';

	// Props
	export let parent: any;
	export let formData: any = {};

	$: employment = pvDiffDate(formData.workdate, new Date());

	const payTypeText = ['', 'บ./ชั่วโมง', 'บ./วัน', 'บ./เดือน'];

	let roleList: any = $page.data.roles;
	let lastTeamId: any = null;

	$: if (formData.teamId) {
		if (lastTeamId != formData.teamId) {
			lastTeamId = formData.teamId;
			fetchRole(formData.teamId);
		}
	}

	const fetchRole = async (teamId: number) => {
		const roleRes = await fetch(`/api/setting/team/${teamId}/role?dataField=dropdown`);
		const roles = await roleRes.json();
		roleList = roleRes.status == 200 ? (roles.data as RoleList[]) : [];
	};
</script>

<Modal {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<div class="grid grid-cols-[auto_1fr] gap-4">
		<Avatar
			rounded="rounded-lg bg-transparent"
			initials={formData.imageFile
				? null
				: formData.name
				? formData.name[0] + (formData.name[1] || '')
				: ''}
			src={formData.imageFile ? EMPLOYEE_LOCATION + formData.imageFile : ''}
			width="w-48 lg:w-72"
		/>
		<div class="flex flex-col space-y-2">
			<div>รหัสพนักงาน : {formData.employeeCode}</div>
			<div>ชื่อ : {formData.name}</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				<div>ตำแหน่ง : {formData.position?.name}</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
					<div>ทีม : {formData.team?.name || '-'}</div>
					<div>หน้าที่ : {formData.role?.name || '-'}</div>
				</div>
			</div>
			<div>เงินเดือน : {formData.salary} {payTypeText[formData.payType]}</div>
			<div class="grid grid-cols-2 gap-2">
				<div>วันลากิจ : {formData.leaveBusiness}</div>
				<div>วันลาป่วย : {formData.leaveSick}</div>
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
				<div>วันที่เริ่มงาน : {pvGetDateDMY(pvToDate(formData.workdate))}</div>
				<div>อายุงาน : {employment} วัน</div>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-2">
		<div>วันเกิด : {pvGetDateDMY(pvToDate(formData.birthdate))}</div>
		<div>เพศ : {formData.gender}</div>
	</div>
	<div class="grid grid-cols-2">
		<div>สัญชาติ : {formData.nationality}</div>
		<div>เบอร์โทร : {formData.tel}</div>
	</div>
	<div>ที่อยู่ : {formData.address}</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
		<div>หมายเลขประจำตัวประชาชน : {formData.citizenId}</div>
		<div>หมายเลขสมาชิกประกันสังคม : {formData.socialServiceId}</div>
	</div>
	<div>
		<span>บัตรประจำตัวประชาชน :</span>
		{#if formData.citizenCardFile}
			<img src={EMPLOYEE_LOCATION + formData.citizenCardFile} alt="บัตรประชาชน" />
		{:else}
			ไม่มีไฟล์
		{/if}
	</div>
	<div>
		<span>ใบสมัครงาน :</span>
		{#if formData.jobApplicationFile}
			<object
				type="application/pdf"
				data={EMPLOYEE_LOCATION + formData.jobApplicationFile}
				title="ใบสมัครงาน"
				height="500px"
				width="100%"
			/>
		{:else}
			ไม่มีไฟล์
		{/if}
	</div>
	<div>
		<span>ใบอนุญาติทำงาน :</span>
		{#if formData.workPermitFile}
			<img src={EMPLOYEE_LOCATION + formData.workPermitFile} alt="ใบอนุญาติทำงาน" />
		{:else}
			ไม่มีไฟล์
		{/if}
	</div>
	<div class="grid grid-cols-2 gap-2">
		<div>ธนาคาร : {formData.bankName}</div>
		<div>เลขบัญชี : {formData.bankAccountNo}</div>
		<div>ชื่อบัญชี : {formData.bankAccountHolder}</div>
	</div>
</Modal>
