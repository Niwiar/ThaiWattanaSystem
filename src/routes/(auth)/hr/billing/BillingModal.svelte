<script lang="ts">
	import ModalFormBase from '$component/base/ModalFormBase.svelte';
	import type { BillingList } from '$src/lib/types/hr';
	import BillingBox from './BillingBox.svelte';
	import { onMount } from 'svelte';
	import SalaryBox from './SalaryBox.svelte';
	import { enhance } from '$app/forms';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	// Props
	export let parent: any;
	export let formData: any = {};

	let incomeTotal: number = 0;
	let deductionTotal: number = 0;

	let otSrc: BillingList[] = [];
	let allowanceSrc: BillingList[] = [];
	let welfareSrc: BillingList[] = [];
	let deductionSrc: BillingList[] = [];
	let businessLeave: any[] = [];
	let sickLeave: any[] = [];
	let atWork: any[] = [];
	let absent: any[] = [];

	let payDate: string | null;

	onMount(() => {
		if (formData.infomation.billing?.employeePayment) {
			otSrc =
				formData.infomation.billing.employeePayment.filter((pay: BillingList) => pay.type === 1) ||
				[];
			allowanceSrc =
				formData.infomation.billing.employeePayment.filter((pay: BillingList) => pay.type === 2) ||
				[];
			welfareSrc =
				formData.infomation.billing.employeePayment.filter((pay: BillingList) => pay.type === 3) ||
				[];
			deductionSrc =
				formData.infomation.billing.employeePayment.filter((pay: BillingList) => pay.type === 4) ||
				[];
		}
		payDate = formData.infomation.billing?.payDate?.split('T')[0] || null;
		// console.log(otSrc);
		const result = otSrc.reduce((r: any, a: any) => {
			const name = a.paymentEmployee.payment.name as string;
			(r[name] = r[name] || []).push(a);

			return r;
		}, {});
		otSrc = [];
		for (const [key, value] of Object.entries(result)) {
			const pay = (value as any).reduce((r: any, a: any, i: number) => {
				r.period = r.period + a.period;
				return r;
			});
			pay.total = pay.amount * pay.period;
			otSrc.push(pay);
			// console.log(`${key}: ${value}`);
		}
		if (formData.infomation.leave.length > 0) {
			businessLeave = formData.infomation.leave.filter((l: any) => l.type === 1);
			sickLeave = formData.infomation.leave.filter((l: any) => l.type === 2);
		}
		if (formData.infomation.billing) {
			incomeTotal = formData.infomation.billing.income;
			deductionTotal = formData.infomation.billing.deduction;
		}
		if (formData.infomation.attendance.length > 0) {
			atWork = formData.infomation.attendance.filter((a: any) => a.type !== 'absent');
			absent = formData.infomation.attendance.filter((a: any) => a.type === 'absent');
		}
	});

	const paidConfirm: PopupSettings = {
		event: 'click',
		target: 'paidConfirmPopup',
		closeQuery: '.paidConfirmBtn',
		placement: 'top-start'
	};
</script>

<ModalFormBase {parent}>
	<input bind:value={formData.infomation.billing.id} name="id" hidden />
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-2 text-md">
		<label class="flex items-center" for="name">
			<span class="w-40 font-semibold text-surface-900 text-lg">ชื่อพนักงาน Name:</span>
			<input
				name="name"
				type="text"
				class="input w-60 !text-tertiary-500"
				disabled
				value={formData.name}
			/>
		</label>
		<label class="flex items-center" for="position">
			<span class="w-40 font-semibold text-surface-900 text-lg">แผนก/ฝ่าย Dept.:</span>
			<input
				name="position"
				type="text"
				class="input w-60 !text-tertiary-500"
				disabled
				value={formData.position.name}
			/>
		</label>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-md">
		<div class="flex flex-col">
			<span class="font-bold text-surface-900 text-md">รายได้ Income</span>

			<SalaryBox
				name="salary"
				payment={{
					name: 'อัตราเงินเดือน',
					amount: formData.infomation.billing?.salary || 0,
					payType: formData.payType,
					salary: formData.salary,
					period: 1
				}}
				hidePeriod={true}
				isDisabled={formData.infomation.billing.paid}
			/>
			<BillingBox
				name="attendance"
				payment={{
					name: 'วันทำงาน',
					period: atWork.length,
					payType: 2
				}}
				hideAmount={true}
				hideTotal={true}
			/>
			{#each otSrc as pay}
				<BillingBox
					name="ot{pay.id}"
					payment={{
						name: pay.paymentEmployee.payment.name,
						amount: pay.amount,
						payType: pay.payType,
						period: pay.period.toFixed(2),
						total: pay.total
					}}
					isDisabled={true}
				/>
			{/each}
			{#each allowanceSrc as pay}
				<BillingBox
					name="allowance{pay.id}"
					payment={{
						name: pay.paymentEmployee.payment.name,
						amount: pay.amount,
						payType: pay.payType,
						period: pay.period,
						total: pay.total
					}}
					isDisabled={formData.infomation.billing.paid}
				/>
			{/each}
			{#each welfareSrc as pay}
				<BillingBox
					name="welfare{pay.id}"
					payment={{
						name: pay.paymentEmployee.payment.name,
						amount: pay.amount,
						payType: pay.payType,
						period: pay.period,
						total: pay.total
					}}
					isDisabled={formData.infomation.billing.paid}
				/>
			{/each}
		</div>
		<div class="flex flex-col">
			<span class="font-bold text-surface-900 text-md">รายการหัก Deduction</span>
			<BillingBox
				name="sickLeave"
				payment={{
					name: 'ลาป่วย',
					period: sickLeave.length,
					payType: 2
				}}
				hideAmount={true}
				hideTotal={true}
			/>
			<BillingBox
				name="businessLeave"
				payment={{
					name: 'ลากิจ',
					period: businessLeave.length,
					payType: 2
				}}
				hideAmount={true}
				hideTotal={true}
			/>
			<BillingBox
				name="absent"
				payment={{
					name: 'ขาดงาน',
					period: absent.length,
					payType: 2
				}}
				hideAmount={true}
				hideTotal={true}
			/>
			<BillingBox
				name="tax3"
				payment={{
					name: 'หัก ณ ที่จ่าย 3%',
					amount: formData.infomation.billing?.tax3 || 0,
					period: 1,
					payType: 3
				}}
			/>
			{#each deductionSrc as pay}
				<BillingBox
					name="deduction{pay.id}"
					payment={{
						name: pay.paymentEmployee.payment.name,
						amount: pay.amount,
						payType: pay.payType,
						period: pay.period,
						total: pay.total
					}}
					hidePeriod={true}
					isDisabled={formData.infomation.billing.paid}
				/>
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-md">
		<div class="flex flex-col">
			<hr class="!border-t-2" />
			<div class="flex justify-between items-center">
				<h6 class="h6">รวมรายได้ (Total Income)</h6>
				<input
					class="input rounded-md px-2 py-1 w-20"
					type="number"
					name="income"
					bind:value={incomeTotal}
					disabled={true}
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<hr class="!border-t-2" />
			<div class="flex justify-between items-center">
				<h6 class="h6">รวมรายการหัก (Total Deduction)</h6>
				<input
					class="input rounded-md px-2 py-1 w-20"
					type="number"
					name="deduction"
					bind:value={deductionTotal}
					disabled={true}
				/>
			</div>
		</div>
	</div>
	<hr class="!border-t-2" />
	<div
		class="mt-1 flex flex-col justify-between ltems-end lg:flex-row lg:justify-betweem lg:items-center gap-4 text-sm"
	>
		<form method="POST" action="?/paidฺBilling" use:enhance enctype="multipart/form-data">
			<input bind:value={formData.infomation.billing.id} name="id" hidden />
			<input bind:value={payDate} type="date" name="payDate" hidden />
			<button
				use:popup={paidConfirm}
				type="button"
				class="btn variant-filled-tertiary"
				disabled={formData.infomation.billing.paid}>จ่ายเงิน</button
			>
			<div class="card variant-outline-primary p-4" data-popup="paidConfirmPopup">
				<p class="mb-2">หากยืนยันการจ่ายเงินแล้วจะไม่สามารถแก้ไขใบเสร็จนี้ได้อีกต่อไป</p>
				<button type="submit" class="paidConfirmBtn btn variant-filled-primary">ยืนยัน</button>
				<button type="button" class="paidConfirmBtn btn variant-ghost-surface">ยกเลิก</button>
			</div>
		</form>
		<div
			class="flex flex-col justify-center ltems-end lg:flex-row lg:justify-betweem lg:items-center gap-4 text-sm"
		>
			<label class="flex flex-row justify-between lg:justify-end items-center gap-2" for="payDate">
				<span class="w-20">วันที่จ่าย</span>
				<input
					bind:value={payDate}
					class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
					type="date"
					name="payDate"
					disabled={formData.infomation.billing.paid}
				/>
			</label>
			<label class="flex flex-row justify-between lg:justify-end items-center gap-2" for="summary">
				<span class="w-36">สรุปเงินเดือน (Salary)</span>
				<input
					value={formData.infomation.billing?.summary || 0}
					class="input variant-filled-surface rounded-md px-2 py-1 max-w-[12rem]"
					type="number"
					name="summary"
					placeholder="Summary"
					disabled={true}
				/>
			</label>
		</div>
	</div>
</ModalFormBase>
