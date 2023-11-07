import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

const checkBilling = async () => {};

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const { employeeId, month } = params;
	const employee = await db.employee.findUnique({
		where: { id: parseInt(employeeId) }
	});
	if (!employee) throw error(404, 'Employee not found');

	return json({ employee });
};
