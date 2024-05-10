<script lang="ts">
	import { page } from '$app/stores';
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import AlertText from '$src/lib/components/AlertText.svelte';
	import PayTypeOptions from '$src/lib/components/base/PayTypeOptions.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	// Props
	export let parent: any;
	export let formData: any = {};

	let issueType: string = '1'; // 1 Leave, 2 OT
	let otId: string = '';
	let type: string = '1';
	let period: string = '1';
	let ot: any = {};
	let otList: any[] = [];

	
	$: fetchEmployeeOt(formData.id)
	const fetchEmployeeOt=async (employeeId:string)=>{
		const paymentEmployeeRes = await fetch(`/api/hr/employee/${employeeId}/payment`);
		const paymentEmployee = await paymentEmployeeRes.json();
		otList = paymentEmployee.data.filter((pay: any) => pay.payment.type === 1)
		
	}
	$: if (otId) {
		ot = otList.find((o: any) => o.id === otId);
	}
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.id} name="id" hidden />
	<input bind:value={formData.infomation.billing.id} name="billingId" hidden />
	<label class="flex justify-start items-center w-full">
		<span class="w-16">Issue</span>
		<select bind:value={issueType} name="issueType" class="select w-64 rounded-md px-2 py-1">
			<option value="1">แจ้งลางาน</option>
			<option value="2">แจ้งทำงานล่วงเวลา</option>
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
		<label for="type" class="flex justify-start items-center w-full">
			<span class="w-16">Type</span>
			<div class="flex flex-col">
				<RadioGroup
					rounded="rounded-md"
					active="variant-filled-tertiary"
					hover="hover:variant-soft-tertiary"
				>
					<RadioItem bind:group={type} name="type" value="1">
						<i class="fa fa-briefcase" /> ลากิจ
					</RadioItem>
					<RadioItem bind:group={type} name="type" value="2">
						<i class="fa fa-heart-pulse" /> ลาป่วย
					</RadioItem>
				</RadioGroup>
				<AlertText alerts={$page.form} form="attendance" field="type" />
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
			<div class="flex flex-col">
				<select bind:value={otId} name="otId" class="select w-64 rounded-md px-2 py-1">
					<option value="">เลือกประเภท O.T.</option>
					{#each otList as ot}
						<option value={ot.id}>{ot.payment.name}</option>
					{/each}
				</select>
				<AlertText alerts={$page.form} form="attendance" field="otId" />
			</div>
		</label>
		<label class="flex justify-start items-center w-full">
			<span class="w-16">Amount</span>
			<div class="flex flex-row">
				<input
					value={ot.amount}
					type="number"
					class="input rounded-md px-2 py-1 w-16"
					name="amount"
				/>
				<select class="select rounded-md px-2 py-1" value={ot.payment?.payType} name="payType">
					<PayTypeOptions />
				</select>
			</div>
		</label>
		<label class="flex justify-start items-center w-full">
			<span class="w-16">Time (min)</span>
			<div class="flex flex-col">
				<input type="number" class="input rounded-md px-2 py-1" name="time" />
				<AlertText alerts={$page.form} form="attendance" field="time" />
			</div>
		</label>
	{/if}
</ModalFormBase>
