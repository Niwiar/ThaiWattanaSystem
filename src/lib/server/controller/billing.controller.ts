/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BillingUpdate } from '$src/lib/types/billing';
import type { Billing, EmployeePayment, Working } from '@prisma/client';
import type { Column, Content, TDocumentDefinitions, Table } from 'pdfmake/interfaces';
import db from '../prisma';
import { toObject } from '$src/lib';
import { pvDiffMonth, pvGetDate, pvGetLastDate, pvIsFuture } from '$src/lib/datetime';
import { getAttendance, getBusinessDay, getLeave } from './attendance.controller';
import type { BillingPrintList } from '$src/lib/types/hr';
import { number2CommaDecimal } from '$src/lib/utils';

export const createBilling = (employeeId: string, month: string, employee: any, working: Working)=> 
	new Promise(async (resolve)=>{
		let billing = await db.billing.findFirst({
			select: { id:true },
			where: { employeeId: parseInt(employeeId), month: month }
		});
		if(billing) return resolve(billing.id)
		billing = await db.billing.create({
			data: {
				employeeId: parseInt(employeeId),
				salary: employee?.salary || 0,
				month: month
			},
			select: { id:true },
		});
		const paymentEmployee = await db.paymentEmployee.findMany({
			select: {
				id: true,
				amount: true,
				payment: { select: { name: true, payType: true, type: true } }
			},
			where: {
				employeeId: parseInt(employeeId),
				active: true,
				payment: { type: { in: [1, 2, 3, 4] } }
			},
			orderBy: { id: 'asc' }
		});
		await db.employeePayment.createMany({
			data: paymentEmployee.map((p) => ({
				billingId: billing?.id || 0,
				paymentEmployeeId: p.id,
				date: new Date(),
				type: p.payment.type,
				amount: p.amount,
				payType: p.payment.payType,
				period: p.payment.type === 1 ? 0 : 1
			}))
		});
		resolve(billing.id)
	})

export const getBilling = (employeeId: string, month: string, employee: any, working: Working) =>
	new Promise(async (resolve) => {
		const monthType = pvIsFuture(new Date(month))
			? 'future'
			: pvDiffMonth(employee?.workdate || new Date(), new Date(month)) < 0
			? 'beforeWork'
			: Math.abs(pvDiffMonth(employee?.workdate || new Date(), new Date(month))) == 0
			? 'start'
			: 'inRange';
		let businessDay: string[] = [],
			attendance: any[] = [];

		const leave = await getLeave(employeeId, month);
		let billing = await db.billing.findFirst({
			include: {
				employeePayment: {
					include: {
						paymentEmployee: {
							include: { payment: { select: { name: true, payType: true, type: true } } }
						}
					}
				}
			},
			where: { employeeId: parseInt(employeeId), month: month }
		});
		// TODO: Fix Billing Generation
		if (monthType === 'inRange' || monthType === 'start') {
			businessDay = getBusinessDay(
				month,
				JSON.parse(working.workday),
				await db.holiday.findMany({
					where: {
						date: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
					}
				}),
				employee?.workdate || new Date(),
				monthType
			);
			attendance = await getAttendance(employeeId, month, working);
			if (!billing) {
				billing = await db.billing.create({
					data: {
						employeeId: parseInt(employeeId),
						salary: employee?.salary || 0,
						month: month
					},
					include: {
						employeePayment: {
							include: {
								paymentEmployee: {
									include: { payment: { select: { name: true, payType: true, type: true } } }
								}
							}
						}
					}
				});
			}
			if (!billing.employeePayment.length) {
				const paymentEmployee = await db.paymentEmployee.findMany({
					select: {
						id: true,
						amount: true,
						payment: { select: { name: true, payType: true, type: true } }
					},
					where: {
						employeeId: parseInt(employeeId),
						active: true,
						payment: { type: { in: [1, 2, 3, 4] } }
					},
					orderBy: { id: 'asc' }
				});
				await db.employeePayment.createMany({
					data: paymentEmployee.map((p) => ({
						billingId: billing?.id || 0,
						paymentEmployeeId: p.id,
						date: new Date(),
						type: p.payment.type,
						amount: p.amount,
						payType: p.payment.payType,
						period: p.payment.type === 1 ? 0 : 1
					}))
				});
				billing = await db.billing.findFirst({
					include: {
						employeePayment: {
							include: { paymentEmployee: { include: { payment: true } } }
						}
					},
					where: { employeeId: parseInt(employeeId), month: month }
				});
			}
			// console.log(billing);

			if (billing && billing.employeePayment.length > 0) {
				let employeePayment = null;
				if (
					billing.employeePayment.filter((p) => p.payType === 2)[0].period !== attendance.length
				) {
					await updatePaymentDaily(billing, attendance.length);
					employeePayment = await db.employeePayment.findMany({
						include: { paymentEmployee: { include: { payment: { select: { name: true } } } } },
						where: { billingId: billing.id }
					});
				}
				const paymentSummary = getPaymentSummary(
					employeePayment || billing.employeePayment,
					billing.salary || 0
				);
				await updateBilling(parseInt(billing.id.toString()), { ...paymentSummary });
				billing = await db.billing.findFirst({
					include: {
						employeePayment: {
							include: { paymentEmployee: { include: { payment: { select: { name: true } } } } }
						}
					},
					where: { employeeId: parseInt(employeeId), month: month }
				});
			}
			businessDay.map((day) => {
				if (
					!attendance.find((a: { date: string }) => a.date.split('T')[0] === day) &&
					!leave.find((l: { date: string }) => l.date.split('T')[0] === day) &&
					day !== pvGetDate(new Date())
				) {
					attendance.push({
						date: day,
						type: 'absent'
					});
				}
			});
		}
		resolve({
			billing: toObject(billing),
			attendance,
			leave,
			monthType
		});
	});
export const getBillingPrint = (
	employeeId: string,
	month: string,
	employee: any,
	working: Working
) =>
	new Promise(async (resolve, reject) => {
		const monthType = pvIsFuture(new Date(month))
			? 'future'
			: pvDiffMonth(employee?.workdate || new Date(), new Date(month)) < 0
			? 'beforeWork'
			: Math.abs(pvDiffMonth(employee?.workdate || new Date(), new Date(month))) == 0
			? 'start'
			: 'inRange';
		let businessDay: string[] = [],
			attendance: any[] = [];

		const leave = await getLeave(employeeId, month);
		const billing = await db.billing.findFirst({
			include: {
				employeePayment: {
					include: { paymentEmployee: { include: { payment: { select: { name: true } } } } }
				}
			},
			where: { employeeId: parseInt(employeeId), month: month }
		});
		if (monthType === 'inRange' || monthType === 'start') {
			businessDay = getBusinessDay(
				month,
				JSON.parse(working.workday),
				await db.holiday.findMany({
					where: {
						date: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
					}
				}),
				employee?.workdate || new Date(),
				monthType
			);
			attendance = await getAttendance(employeeId, month, working);
			// console.log(attendance);
			if (!billing) {
				reject({ message: 'ไม่พบข้อมูล' });
			}

			businessDay.map((day) => {
				if (
					!attendance.find((a: { date: string }) => a.date.split('T')[0] === day) &&
					!leave.find((l: { date: string }) => l.date.split('T')[0] === day) &&
					day !== pvGetDate(new Date())
				) {
					attendance.push({
						date: day,
						type: 'absent'
					});
				}
			});
		}
		resolve({
			employee,
			billing: toObject(billing),
			attendance,
			leave,
			monthType
		});
	});
export const getPaymentSummary = (
	employeePayment: ({ paymentEmployee: { payment: { name: string } } } & EmployeePayment)[],
	salary: number
) => {
	const income =
		employeePayment.filter((p) => p.type < 4).reduce((a, b) => a + b.amount * b.period, 0) + salary;
	const deduction =
		employeePayment.filter((p) => p.type === 4).reduce((a, b) => a + b.amount * b.period, 0) +
		salary * 0.03;
	return { income, deduction };
};

export const updatePaymentDaily = async (
	billing: Billing & {
		employeePayment: ({ paymentEmployee: { payment: { name: string } } } & EmployeePayment)[];
	},
	period: number
) => {
	const payment = billing.employeePayment.filter((p) => p.payType === 2);
	await db.employeePayment.updateMany({
		where: { id: { in: payment.map((p) => p.id) } },
		data: { period }
	});
};

export const updateBilling = async (billingId: number, data: BillingUpdate) => {
	const { income, deduction } = data;
	await db.billing.update({
		where: { id: billingId },
		data: { income, deduction }
	});
};

const payRow = (name: string, amount: string, period: string) => [
	{ text: name },
	{ text: amount, alignment: 'left' },
	{ text: period, alignment: 'left' }
];
const totalRow = (total: string) => [{ text: total, style: 'tfootlight' }];

const summaryColumn = (billing: any) => {
	const payDateTable: Table = {
		headerRows: 1,
		widths: ['100%'],

		body: [
			[{ text: 'วันที่จ่าย\nPayslip Date', alignment: 'center', style: 'thead' }],
			[{ text: `\n${billing.payDate || ''}\n\n`, alignment: 'center' }]
		]
	};
	const netTable: Table = {
		headerRows: 1,
		widths: ['100%'],

		body: [
			[{ text: 'เงินได้สุทธิ\nNet to Pay', alignment: 'center', style: 'thead' }],
			[{ text: `\n${number2CommaDecimal(billing.summary)}\n\n`, alignment: 'center' }]
		]
	};
	const signTable: Table = {
		headerRows: 1,
		widths: ['100%'],
		body: [
			[{ text: 'ลงชื่อพนักงาน\nEmployee Signature', alignment: 'center', style: 'thead' }],
			[{ text: '\n \n\n', alignment: 'center' }]
		]
	};
	return {
		width: '20%',
		margin: [10, 0, 0, 0],
		stack: [
			{
				layout: 'itemLayout',
				table: payDateTable
			},
			{ text: '\n' },
			{
				layout: 'itemLayout',
				table: netTable
			},
			{ text: '\n' },
			{
				layout: 'itemLayout',
				table: signTable
			}
		]
	} as Column;
};

const amountUnit = ['', 'บ./ชม.', 'บ./วัน', 'บ./เดือน'];
const periodUnit = ['', 'ชม.', 'วัน', 'เดือน'];

const billingColumn = (data: any) => {
	const { employee, billing, attendance, leave } = data;
	// console.log(billing.employeePayment);
	const incomeTable: Table = {
		headerRows: 0,
		widths: ['*', '*', '*'],
		body: [
			payRow('อัตราเงินเดือน', '', `${employee.salary.toLocaleString()} /เดือน`),
			payRow(
				'วันทำงาน',
				'',
				`${attendance.filter((a: { type: string }) => a.type !== 'absent').length} วัน`
			)
		]
	};
	const incomeTotalTable: Table = {
		headerRows: 0,
		widths: ['*'],
		body: [totalRow(number2CommaDecimal(billing.salary)), totalRow(' ')]
	};
	const deductionTable: Table = {
		headerRows: 0,
		widths: ['*', '*', '*'],
		body: [
			payRow('ลาป่วย', '', `${leave.filter((l: { type: number }) => l.type === 2).length} วัน`),
			payRow('ลากิจ', '', `${leave.filter((l: { type: number }) => l.type === 1).length} วัน`),
			payRow(
				'ขาดงาน',
				'',
				`${attendance.filter((a: { type: string }) => a.type === 'absent').length} วัน`
			),
			payRow('หัก ณ ที่จ่าย 3%', '', '')
		]
	};
	const deductionTotalTable: Table = {
		headerRows: 0,
		widths: ['*'],
		body: [totalRow(' '), totalRow(' '), totalRow(' '), totalRow(number2CommaDecimal(billing.tax3))]
	};
	const otPay = billing.employeePayment
		.filter((p: BillingPrintList) => p.type === 1)
		.reduce((r: any, a: any) => {
			(r[a.paymentEmployee.payment.name] = r[a.paymentEmployee.payment.name] || []).push(a);

			return r;
		}, {});
	// console.log(otPay);
	let otSrc = [];
	for (const [key, value] of Object.entries(otPay)) {
		const pay = (value as any).reduce((r: any, a: any, i: number) => {
			r.period = r.period + a.period;
			return r;
		});
		pay.total = pay.amount * pay.period;
		otSrc.push(pay);
		// console.log(`${key}: ${value}`);
	}
	otSrc.forEach((p: BillingPrintList) => {
		incomeTable.body.push(
			payRow(
				p.paymentEmployee.payment.name,
				`${p.amount || '-'} ${amountUnit[p.payType]}`,
				p.payType === 3 ? '' : `${p.period || '-'} ${periodUnit[p.payType]}`
			)
		);
		incomeTotalTable.body.push(totalRow(p.total ? number2CommaDecimal(p.total) : '-'));
	});
	billing.employeePayment
		.filter((p: BillingPrintList) => p.type === 2)
		.forEach((p: BillingPrintList) => {
			incomeTable.body.push(
				payRow(
					p.paymentEmployee.payment.name,
					`${p.amount || '-'} ${amountUnit[p.payType]}`,
					p.payType === 3 ? '' : `${p.period || '-'} ${periodUnit[p.payType]}`
				)
			);
			incomeTotalTable.body.push(totalRow(p.total ? number2CommaDecimal(p.total) : '-'));
		});
	billing.employeePayment
		.filter((p: BillingPrintList) => p.type === 3)
		.forEach((p: BillingPrintList) => {
			incomeTable.body.push(
				payRow(
					p.paymentEmployee.payment.name,
					`${p.amount || '-'} ${amountUnit[p.payType]}`,
					p.payType === 3 ? '' : `${p.period || '-'} ${periodUnit[p.payType]}`
				)
			);
			incomeTotalTable.body.push(totalRow(p.total ? number2CommaDecimal(p.total) : '-'));
		});
	billing.employeePayment
		.filter((p: BillingPrintList) => p.type === 4)
		.forEach((p: BillingPrintList) => {
			deductionTable.body.push(
				payRow(
					p.paymentEmployee.payment.name,
					`${p.amount || '-'} ${amountUnit[p.payType]}`,
					p.payType === 3 ? '' : `${p.period || '-'} ${periodUnit[p.payType]}`
				)
			);
			deductionTotalTable.body.push(totalRow(p.total ? number2CommaDecimal(p.total) : '-'));
		});
	const billingTable: Table = {
		headerRows: 1,
		widths: ['40%', '10%', '40%', '10%'],

		body: [
			[
				{ text: 'รายได้\nIncome', style: 'thead' },
				{ text: 'จำนวนเงิน\nAmount', style: 'thead' },
				{ text: 'รายการหัก\nDeduction', style: 'thead' },
				{ text: 'จำนวนเงิน\nAmount', style: 'thead' }
			],
			[
				{ table: incomeTable, layout: 'noBorders' },
				{ table: incomeTotalTable, layout: 'noBorders' },
				{ table: deductionTable, layout: 'noBorders' },
				{ table: deductionTotalTable, layout: 'noBorders' }
			],
			[
				{ text: 'รวมรายได้\n( Total Income )', style: 'tfoot' },
				{ text: number2CommaDecimal(billing.income), style: 'tfootlight' },
				{ text: 'รวมรายการหัก\n( Total Deduction )', style: 'tfoot' },
				{ text: number2CommaDecimal(billing.deduction), style: 'tfootlight' }
			]
		]
	};

	return {
		width: '*',
		layout: 'itemLayout',
		table: billingTable
	} as Column;
};

const billingPage = (data: any, pageBreak: boolean) => {
	const { employee, billing } = data;
	const { name, position, bankName, bankAccountNo, bankAccountHolder } = employee;
	if (!billing){
		const page:Content=[
			{text:`ไม่มีข้อมูลใบเสร็จ`,style:'thead',fontSize: 16,},
			{text:`ชื่อพนักงาน: ${name}`,alignment:'center',fontSize: 14},
			{text:`ตำแหน่ง: ${position.name||"-"}`,alignment:'center',fontSize: 14},
		]
		if (pageBreak) page.unshift({ text: '', pageBreak: 'before' });
		return page;
	}

	const header: Column[] = [
		{
			alignment: 'left',
			stack: [
				{
					alignment: 'left',
					image: 'static/favicon.png',
					margin: [10, 0, 10, 0],
					height: 35,
					width: 50
				}
			],
			width: 'auto'
		},
		{
			width: '*',
			text: 'บริษัท ไทยวัฒนา แพ็คกิ้ง เซอร์วิส จำกัด (สำนักงานใหญ่)\n498 หมู่ที่ 2 ถ.ตำหรุ-บางพลี ต.แพรกษาใหม่ อ.เมืองสมุทธปราการ จ.สมุทรปราการ 10280\nเลขประจำตัวผู้เสียภาษีอากร 0-1155-58004-78-8'
		},
		{
			width: '35%',
			text: 'ใบจ่ายเงินเดือน (PAY SLIP)',
			bold: true,
			alignment: 'center',
			fontSize: 10,
			style: 'btext'
		}
	];
	const title: Column[] = [
		{
			width: '*',
			margin: [10, 0, 0, 0],
			columns: [
				{
					width: '20%',
					text: 'ชื่อพนักงาน:\nName',
					style: 'btext'
				},
				{
					margin: [10, 0, 0, 0],
					width: '*',
					text: name
				}
			]
		},
		{
			width: '*',
			columns: [
				{
					width: '20%',
					text: 'แผนก/ฝ่าย:\nDept',
					style: 'btext'
				},
				{
					margin: [10, 0, 0, 0],
					width: '*',
					text: position.name || '-'
				}
			]
		},
		{
			width: '20%',
			text: ''
		}
	];
	const billingDetail: Column[] = [billingColumn(data), summaryColumn(billing)];
	const page: Content = [
		{ columns: header },
		{ text: '\n' },
		{ columns: title },
		{ text: '\n' },
		{ columns: billingDetail },
		{
			text: `\nธนาคาร. ${bankName || '-'} บัญชีเลขที่ ${bankAccountNo || '-'} ชื่อบัญชี ${
				bankAccountHolder || '-'
			}`,
			lineHeight: 0.5
		}
	];
	if (pageBreak) page.unshift({ text: '', pageBreak: 'before' });
	return page;
};

export const billingDoc = async (billings: any[]) => {
	return {
		info: {
			title: `SLIP`,
			subject: `SLIP`,
			creator: 'PRIVA INNOTECH CO., LTD'
		},
		pageMargins: [20, 40, 20, 40],
		pageSize: 'A5',
		pageOrientation: 'landscape',
		content: billings.map((billing, i) => billingPage(billing, i !== 0)),
		styles: {
			text: { color: '#808080' },
			btext: { bold: true },
			bitext: { bold: true, italics: true },
			thead: { bold: true, alignment: 'center' },
			tfoot: { bold: true, alignment: 'right', margin: [0, 0, 5, 0] },
			tfootlight: { alignment: 'right', margin: [0, 0, 5, 0] }
		},
		defaultStyle: {
			font: 'Tahoma',
			fontSize: 7,
			lineHeight: 1.3
		}
	} as TDocumentDefinitions;
};
