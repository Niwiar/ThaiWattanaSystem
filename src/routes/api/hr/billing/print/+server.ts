/* eslint-disable @typescript-eslint/no-explicit-any */
import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { createPDF } from '$server/pdf-creator';
import { billingDoc, getBillingPrint } from '$server/controller/billing.controller';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	try {
		const { employeeId, month } = await request.json();
		const employees = await db.employee.findMany({
			select: {
				id: true,
				name: true,
				salary: true,
				workdate: true,
				position: { select: { name: true } },
				bankName: true,
				bankAccountNo: true,
				bankAccountHolder: true
			},
			where: { id: { in: employeeId } }
		});
		const working = await db.working.findFirst({ orderBy: { updateAt: 'desc' } });
		if (!working) {
			throw error(400, { message: 'ไม่มีการตั้งค่าวันทำงาน' });
		}
		const billArr: any[] = [];
		employees.forEach(async (employee) => {
			if (employee) {
				billArr.push(getBillingPrint(employee?.id.toString(), month, employee, working));
			}
		});
		const billings = await Promise.all(billArr);
		const filepath = await createPDF(`billing_${month}`, await billingDoc(billings));
		return json({ data: filepath });
	} catch (err) {
		console.log(err);
		throw error(500, {
			message: 'เกิดข้อผิดพลาด'
		});
	}
};
