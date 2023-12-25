import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { writeFileBuffer } from '$src/lib';
import type { AttendanceCheck, AttendanceInsert } from '$src/lib/types/attendance';
import db from '$src/lib/server/prisma';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { employeeCode, createdAt, buffer } = (await request.json()) as AttendanceCheck;
	console.log(createdAt);
	const date = new Date(createdAt);
	console.log(employeeCode, date.toLocaleString());
	const employee = await db.employee.findUnique({
		select: { id: true },
		where: { employeeCode: employeeCode }
	});
	const data: AttendanceInsert = {
		employeeId: parseInt(employee?.id.toString() || '0'),
		createdAt: new Date(createdAt),
		date: new Date(createdAt),
		imageFile: null
	};
	if (buffer) {
		data['imageFile'] = await writeFileBuffer(buffer, 'img', 'attendance');
	}

	const attendance = await db.employeeAttendance.create({ data });
	console.log(attendance);
	return json({ message: 'ok' });
};
