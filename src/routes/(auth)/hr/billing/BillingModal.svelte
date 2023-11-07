<script lang="ts">
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import { enhance } from '$app/forms';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import type { RoleList } from '$src/lib/types/hr';

	// Props
	export let parent: any;
	export let formData: any = {};
	export let size: string = '';

	let isDisabled: boolean = false;
	let roleList: any = $page.data.roles;

	$: if (formData.teamId) {
		fetchRole(formData.teamId);
	}

	const fetchRole = async (teamId: number) => {
		const roleRes = await fetch(`/api/hr/team/${teamId}/role?dataField=dropdown`);
		const roles = await roleRes.json();
		console.log(roles.data);
		roleList = roleRes.status == 200 ? (roles.data as RoleList[]) : [];
	};
</script>

<ModalFormBase {parent} {size}>
	<input bind:value={formData.id} name="id" hidden />
	<div class="grid grid-cols-2 gap-4">
		<label class="flex items-center" for="name">
			<span class="w-40 font-semibold text-surface-900 text-lg">ชื่อพนักงาน Name:</span>
			<span>{formData.name}</span>
		</label>
		<label class="flex items-center" for="name">
			<span class="w-40 font-semibold text-surface-900 text-lg">แผนก/ฝ่าย Dept.:</span>
			<span>{formData.position.name}</span>
		</label>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col">
			<span class="font-bold text-surface-900 text-xl">รายได้ Income</span>
		</div>
		<div class="flex flex-col">
			<span class="font-bold text-surface-900 text-xl">รายการหัก Deduction</span>
		</div>
	</div>
</ModalFormBase>
