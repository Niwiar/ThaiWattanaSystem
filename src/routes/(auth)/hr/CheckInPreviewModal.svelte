<script lang="ts">
	import { ATTENDANCE_LOCATION } from '$src/constant';
	import Modal from '$src/lib/components/base/Modal.svelte';

	// Props
	export let parent: any;
	export let formData: any = {};

	const cImage = 'max-w-[90%] max-h-[90%] rounded-container-token overflow-hidden shadow-xl';
</script>

<Modal {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<div class="grid grid-cols-2 gap-2 text-lg">
		<div>
			<span class="">วันที่ :</span>
			<span class="font-medium">{formData.date}</span>
		</div>
		<div>
			<span class="">สถานะ :</span>
			<span class="font-medium">{formData.type}</span>
		</div>
		<div>
			<span class="">ชื่อพนักงาน :</span>
			<span class="font-medium">{formData.name}</span>
		</div>
		<div>
			<span class="">ตำแหน่ง :</span>
			<span class="font-medium">{formData.position?.name || '-'}</span>
		</div>
		<div>
			<span class="">ทีม :</span>
			<span class="font-medium">{formData.team?.name || '-'}</span>
		</div>
		<div>
			<span class="">ตำแหน่งงาน :</span>
			<span class="font-medium">{formData.role?.name || '-'}</span>
		</div>
	</div>
	<div class="grid grid-cols-2 text-lg">
		<div class="flex flex-col justify-start items-center">
			<div>
				<span class="">เข้างาน :</span>
				<span class="font-bold">{formData.checkin} น.</span>
			</div>
			{#if formData.checkinImage}
				<img
					src={ATTENDANCE_LOCATION + formData.checkinImage}
					class={cImage}
					alt="CheckInPreview"
					title="checkin"
				/>
			{:else}
				<span class="font-bold">ไม่มีรูปภาพ</span>
			{/if}
		</div>
		<div class="flex flex-col justify-start items-center">
			<div>
				<span class="">ออกงาน :</span>
				<span class="font-bold">{formData.checkout} น.</span>
			</div>
			{#if formData.checkoutImage}
				<img
					src={ATTENDANCE_LOCATION + formData.checkoutImage}
					class={cImage}
					alt="CheckInPreview"
					title="checkin"
				/>{:else}
				<span class="font-bold">ไม่มีรูปภาพ</span>
			{/if}
		</div>
	</div>
</Modal>
