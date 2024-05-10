<script lang="ts">
	import { page } from '$app/stores';
	import type { Holiday } from '@prisma/client';
	import { Avatar, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { EventClickArg, EventInput } from 'svelte-fullcalendar';
	import { slide } from 'svelte/transition';
	import { EMPLOYEE_LOCATION } from '$src/constant';
	import { handleModal } from '$src/lib/action';
	import AttendanceModal from './AttendanceModal.svelte';
	import AttnCalendar from '$src/lib/components/calendar/AttnCalendar.svelte';
	import { onMount } from 'svelte';
	import { fetchGet } from '$src/lib/fetch';
	import LeaveEditModal from './LeaveEditModal.svelte';
	import OtEditModal from './OtEditModal.svelte';
	import CheckInModal from './CheckInModal.svelte';
	import { pvGetDate, pvGetHHMM } from '$src/lib/datetime';
	import CheckInPreviewModal from './CheckInPreviewModal.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let employee: any = {};
	let render = 0;

	let attendances: EventInput[] = [];
	let holidays: EventInput[] = [];
	let events: EventInput[] = [];
	// let lastEvents: EventInput[] = [];

	let businessLeave: any[] = [];
	let sickLeave: any[] = [];
	let absent: any[] = [];
	let late: any[] = [];
	let attend: any[] = [];

	let businessLeaveCount: number = 0;
	let sickLeaveCount: number = 0;
	let otCount: number = 0;
	let allowanceCount: number = 0;
	let deligenceCount: number = 0;

	let lastEmployee: number | null;
	let lastYear: string | null;

	let date: string;
	let summaryType: string = 'month';
	let infomation: any = {};
	if ($page.data.holidays) {
		holidays = $page.data.holidays.map((holiday: Holiday) => ({
			title: holiday.name,
			date: holiday.date,
			allDay: true
		}));
		events = [...attendances, ...holidays];
	}

	$: {
		resetInfo();
		if (Object.keys(employee).length !== 0 && date) {
			let year = date.split('-')[0];
			if (summaryType === 'month') {
				lastEmployee = null;
				lastYear = null;
				fetchBilling(employee.id, date, summaryType);
			} else if (lastEmployee !== employee.id || lastYear === year) {
				lastEmployee = employee.id;
				lastYear = year;
				fetchBilling(employee.id, date, summaryType);
			}
		}
	}

	const resetInfo = () => {
		infomation = {};
		attendances = [];
		absent = [];
		late = [];
		attend = [];
		businessLeave = [];
		sickLeave = [];
		businessLeaveCount = 0;
		sickLeaveCount = 0;
		otCount = 0;
		allowanceCount = 0;
		deligenceCount = 0;
	};

	$: if (
		$page.form?.success &&
		$page.form?.name === 'attendance' &&
		Object.keys(employee).length !== 0 &&
		date
	) {
		fetchBilling(employee.id, date, summaryType);
	}

	const fetchBilling = async (employeeId: number, month: string, summaryType: string = 'month') => {
		resetInfo();
		const billingRes = await fetch(
			`/api/hr/billing/${employeeId}/${month}?summaryType=${summaryType}`
		);
		const billings = await billingRes.json();
		infomation = billingRes.status == 200 ? billings.data : {};
		if (!infomation?.billing) return;
		absent = infomation.attendance.filter((a: any) => a.type === 'absent');
		late = infomation.attendance.filter((a: any) => a.type === 'late');
		attend = infomation.attendance.filter((a: any) => a.type !== 'absent');
		if (infomation.leave.length > 0) {
			businessLeave = infomation.leave.filter((l: any) => l.type === 1);
			sickLeave = infomation.leave.filter((l: any) => l.type === 2);
			businessLeaveCount = businessLeave.reduce(
				(acc: number, l: any) => acc + (l.period === 1 ? 1 : 0.5),
				0
			);
			sickLeaveCount = sickLeave.reduce(
				(acc: number, l: any) => acc + (l.period === 1 ? 1 : 0.5),
				0
			);
		}
		infomation.billing.employeePayment
			.filter((p: any) => p.type === 1 && p.period != 0)
			.forEach((p: any) => (otCount += parseFloat(p.period.toFixed(2))));
		infomation.billing.employeePayment
			.filter((p: any) => p.paymentEmployee.payment.name === 'เบี้ยเลี้ยง')
			.forEach((p: any) => (allowanceCount += parseFloat(p.amount.toFixed(2))));
		infomation.billing.employeePayment
			.filter((p: any) => p.paymentEmployee.payment.name === 'เบี้ยขยัน')
			.forEach((p: any) => (deligenceCount += parseFloat(p.amount.toFixed(2))));

		attendances = [
			...infomation.attendance.map((a: any) => ({
				date: a.date,
				start: a.type === 'absent' ? null : a._min.createdAt,
				end: a.type === 'absent' ? null : a._max.createdAt,
				title: a.type === 'absent' ? 'ขาดงาน' : 'เข้า',
				editable: a.type === 'absent' ? true : false,
				backgroundColor: a.type === 'absent' ? '#f77b72' : null,
				textColor: a.type === 'absent' ? '#fbfdfd' : 'gray',
				borderColor: a.type === 'absent' ? '#f77b72' : a.type === 'late' ? '#CDA244' : '#50B27C'
			})),
			...infomation.leave.map((l: any) => ({
				id: l.id,
				date: l.date,
				title: `${l.type === 1 ? 'ลากิจ' : 'ลาป่วย'} (${
					l.period === 2 ? 'เช้า' : l.period === 3 ? 'บ่าย' : 'ทั้งวัน'
				})`,
				allDay: true,
				editable: true,
				backgroundColor: '#3788d8',
				textColor: '#fbfdfd'
			})),
			...infomation.billing.employeePayment
				.filter((p: any) => p.type === 1 && p.period != 0)
				.map((pay: any) => ({
					id: pay.id,
					date: pay.date,
					title: `${pay.paymentEmployee.payment.name} (${pay.period.toFixed(2)} ชม.)`,
					allDay: true,
					editable: true,
					backgroundColor: '#50B27C',
					textColor: '#fbfdfd'
				}))
		];
		events = [...attendances, ...holidays];
		render++;
	};
	const handleDay = (date: string, e: UIEvent) => {
		let attend = infomation.attendance.find(
			(a: any) => pvGetDate(new Date(a.date)) === pvGetDate(new Date(date))
		);
		let leave = infomation.leave.find(
			(a: any) => pvGetDate(new Date(a.date)) === pvGetDate(new Date(date))
		);
		let attendance = {
			type: 'ไม่พบข้อมูลการเข้างาน',
			checkin: '--:--',
			checkinImage: '',
			checkout: '--:--',
			checkoutImage: ''
		};
		if (attend) {
			if (attend.type === 'absent') attendance = { ...attendance, type: 'ขาดงาน' };
			else {
				attendance = {
					type: attend.type === 'late' ? 'มาสาย' : 'เข้างาน',
					checkin: pvGetHHMM(new Date(attend._min.createdAt)),
					checkinImage: attend._min.imageFile,
					checkout:
						attend._max.id !== attend._min.id
							? pvGetHHMM(new Date(attend._max.createdAt))
							: '--:--',
					checkoutImage: attend._max.id !== attend._min.id ? attend._max.imageFile : ''
				};
			}
		} else if (leave) {
			if (leave.type === 1) attendance = { ...attendance, type: 'ลากิจ' };
			else attendance = { ...attendance, type: 'ลาป่วย' };
		}
		handleModal(modalStore, 'Check In Previw', '', CheckInPreviewModal, {
			formData: { ...employee, date: pvGetDate(new Date(date)), ...attendance }
		});
	};

	const handleEvent = (e: EventClickArg) => {
		const event = e.event;
		if (!event.durationEditable) return;
		if (event.title.includes('ลา')) {
			const leave = {
				id: event.id,
				name: event.title,
				date: event.startStr
			};
			handleModal(modalStore, 'Edit Leave Issue', 'editLeave', LeaveEditModal, {
				formData: { ...employee, infomation, leave }
			});
		} else if (event.title.includes('ขาด')) {
			handleModal(modalStore, 'Check In Issue', 'addCheckIn', CheckInModal, {
				formData: { ...employee, infomation, date: event.startStr }
			});
		} else {
			const ot = {
				id: event.id,
				name: event.title,
				date: event.startStr
			};
			handleModal(modalStore, 'Edit OT Issue', 'editOT', OtEditModal, {
				formData: { ...employee, infomation, ot }
			});
		}
	};
</script>

{#if Object.keys(employee).length !== 0}
	<div
		transition:slide={{ axis: 'x' }}
		on:introend={() => render++}
		class="ml-0 mt-4 lg:ml-4 lg:mt:0 card space-y-2 p-4 h-[800px] lg:max-h-[calc(100vh-200px)] overflow-y-auto lg:w-[700px]"
	>
		<div class="flex justify-start items-start gap-4">
			<Avatar
				initials={employee.name ? employee.name[0] + (employee.name[1] || '') : ''}
				src={employee.imageFile ? EMPLOYEE_LOCATION + employee.imageFile : ''}
				width="w-60"
				rounded="rounded-lg bg-transparent"
			/>
			<div class="w-full flex flex-col gap-2">
				<div class="flex flex-row justify-between">
					<div class="flex flex-col">
						<span class="text-2xl">{employee.name} </span>
						<span class="font-bold">{employee.position?.name || '-'}</span>
					</div>
					<select class="select text-sm variant-soft-primary w-min h-min" bind:value={summaryType}>
						<option value="month">รายเดือน</option>
						<option value="year">รายปี</option>
					</select>
				</div>
				<div class="flex flex-col h-min">
					{#if !infomation?.billing}
						<span class="">เข้างาน 0 / สาย 0 / ขาด 0</span>
						<span class="">ลากิจ 0 / ลาป่วย 0</span>
						<span class="">O.T. 0 ชั่วโมง</span>
						<span class="">เบี้ยเลี้ยง 0 / เบี้ยขยัน 0</span>
					{:else}
						<span class="">
							เข้างาน {attend.length} / สาย {late.length} / ขาด {absent.length}
						</span>
						<span class="">
							ลากิจ {businessLeaveCount} / ลาป่วย {sickLeaveCount}
						</span>
						<span class="">O.T. {otCount} ชั่วโมง</span>
						<span class="">เบี้ยเลี้ยง {allowanceCount} / เบี้ยขยัน {deligenceCount}</span>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex justify-between items-center">
			<span class="text-lg font-semibold">Attendance</span>
			<button
				class="btn btn-sm variant-filled-primary rounded-md"
				on:click={() =>
					handleModal(modalStore, 'Create Attendance', 'createAttendance', AttendanceModal, {
						formData: { ...employee, infomation }
					})}
				disabled={!infomation?.billing?.id}
			>
				Issue
			</button>
		</div>
		<div class="h-[480px]">
			{#key render}
				<AttnCalendar bind:events bind:date height="h-[20rem]" {handleDay} {handleEvent} />
			{/key}
		</div>
	</div>
{/if}
