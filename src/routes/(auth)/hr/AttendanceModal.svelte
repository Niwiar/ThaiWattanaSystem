<script lang="ts">
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	// Props
	export let parent: any;
	export let formData: any = {};

	let issueType: string = '1'; // 1 Leave, 2 Payment
	let paymentType: string = '1'; // 1 OT, 2 Allowance, 3 Welfare, 4 Deduction
	let leaveType: string = '3';
	let period: string = '1';
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<label class="flex justify-start items-center w-full">
		<span class="w-16">Issue</span>
		<select bind:value={issueType} class="select w-64 rounded-md px-2 py-1">
			<option value="1">แจ้งลางาน</option>
			<option value="2">ลงรายการเงินได้/รายการหัก</option>
		</select>
	</label>
	<label for="date" class="flex justify-start items-center w-full">
		<span class="w-16">Date</span>
		<div class="flex flex-col">
			<input type="date" class="input rounded-md px-2 py-1" name="date" />
			<AlertText alerts={$page.form} form="attendance" field="date" />
		</div>
	</label>
	{#if issueType === '1'}
		<label for="leaveType" class="flex justify-start items-center w-full">
			<span class="w-16">Type</span>
			<div class="flex flex-col">
				<RadioGroup
					rounded="rounded-md"
					active="variant-filled-tertiary"
					hover="hover:variant-soft-tertiary"
				>
					<RadioItem bind:group={leaveType} name="leaveType" value="3">
						<i class="fa fa-briefcase" /> ลากิจ
					</RadioItem>
					<RadioItem bind:group={leaveType} name="leaveType" value="4">
						<i class="fa fa-heart-pulse" /> ลาป่วย
					</RadioItem>
				</RadioGroup>
				<AlertText alerts={$page.form} form="attendance" field="leaveType" />
			</div>
		</label>
		<label for="period" class="flex justify-start items-center w-full">
			<span class="w-16">Period</span>
			<div class="flex flex-col">
				<RadioGroup
					rounded="rounded-md"
					active="variant-filled-tertiary"
					hover="hover:variant-soft-tertiary"
				>
					<RadioItem bind:group={period} name="period" value="1">ทั้งวัน</RadioItem>
					<RadioItem bind:group={period} name="period" value="2">กะเช้า</RadioItem>
					<RadioItem bind:group={period} name="period" value="3">กะบ่าย</RadioItem>
				</RadioGroup>
				<AlertText alerts={$page.form} form="attendance" field="period" />
			</div>
		</label>
	{:else if issueType === '2'}
		<label class="flex justify-start items-center w-full">
			<span class="w-16">Type</span>
			<select bind:value={paymentType} class="select w-64 rounded-md px-2 py-1">
				<option value="1">ทำงานล่วงเวลา</option>
				<option value="2">เบี้ยเลี้ยง / เบี้ยขยัน</option>
				<option value="3">สวัสดิการ</option>
				<option value="4">รายการหัก</option>
			</select>
		</label>
	{/if}
</ModalFormBase>
