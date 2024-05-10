/* eslint-disable @typescript-eslint/no-explicit-any */
import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { getBilling } from '$server/controller/billing.controller';

export const GET: RequestHandler = async ({ params,url }: RequestEvent) => {
	try {
		const type = url.searchParams.get('summaryType')
		let data:any={}
		const { employeeId, month } = params;
		const employee = await db.employee.findUnique({
			select: { salary: true, workdate: true },
			where: { id: parseInt(employeeId) }
		});
		const working = await db.working.findFirst({ orderBy: { updateAt: 'desc' } });
		if (!working) {
			throw error(400, { message: 'ไม่มีการตั้งค่าวันทำงาน' });
		}
		if (type !=='year') {
			data = await getBilling(employeeId, month, employee, working);
		} else {
			let year = month.split('-')[0]
			let months = Array(12).fill('').map((val,i)=>`${year}-${(i+1).toString().padStart(2,'0')}`)
			let billArr:any[]=[]
			data.attendance=[]
			data.leave=[]
			months.forEach(async (selectedMonth) => {
				billArr.push(getBilling(employeeId, selectedMonth, employee, working));
			});
			const monthsBilling = await Promise.all(billArr);
			let employeePayment:any[]=[]
			monthsBilling.forEach((bill)=>{
				data.attendance=[...data.attendance,...bill.attendance]
				data.leave=[...data.leave,...bill.leave]
				employeePayment=[...employeePayment,...bill?.billing?.employeePayment||[]]
			})
			let currBill= monthsBilling.filter(monthBilling=>monthBilling?.billing?.month===month)[0]||null
			data.billing = currBill?.billing || {employeePayment:[]}
			data.monthType = currBill?.billing?.monthType
			data.billing.employeePayment = employeePayment
		}
		return json({ data });
	} catch (err) {
		console.log(err);
		throw error(500, {
			message: 'เกิดข้อผิดพลาด'
		});
	}
};
