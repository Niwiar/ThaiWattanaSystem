import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { getManyAttendance } from '$server/controller/attendance.controller';
import db from '$src/lib/server/prisma';
import { pvLastdayInMonth } from '$src/lib/datetime';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const { month } = params;
	const max = pvLastdayInMonth(month.split('-')[1], month.split('-')[0]);
	const employees = await db.employee.findMany({
		select: {
			id: true,
			imageFile: true,
			name: true,
			workdate: true,
			position: { select: { name: true } }
		}
	});
	const working = await db.working.findFirst({ orderBy: { updateAt: 'desc' } });
	if (!working) {
		throw error(400, { message: 'ไม่มีการตั้งค่าวันทำงาน' });
	}
	const attendanceArr: unknown[] = [];
	employees.forEach(async (employee) => {
		if (employee) {
			attendanceArr.push(getManyAttendance(employee?.id.toString(), month, employee, working));
		}
	});
	const attendances = await Promise.all(attendanceArr);
	// console.log(attendances);
	return json({ data: { max, attendances } });
};
