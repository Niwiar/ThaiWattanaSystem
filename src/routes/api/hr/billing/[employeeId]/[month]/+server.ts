/* eslint-disable @typescript-eslint/no-explicit-any */
import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { getBilling } from '$server/controller/billing.controller';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const { employeeId, month } = params;
		const employee = await db.employee.findUnique({
			select: { salary: true, workdate: true },
			where: { id: parseInt(employeeId) }
		});
		const working = await db.working.findFirst({ orderBy: { updateAt: 'desc' } });
		if (!working) {
			throw error(400, { message: 'ไม่มีการตั้งค่าวันทำงาน' });
		}
		const data = await getBilling(employeeId, month, employee, working);

		// console.log(info.data.billing);
		return json({ data });
	} catch (err) {
		console.log(err);
		throw error(500, {
			message: 'เกิดข้อผิดพลาด'
		});
	}
};
