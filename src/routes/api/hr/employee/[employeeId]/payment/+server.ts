import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const employeeId = params.employeeId;
	const paymentEmployee = await db.paymentEmployee.findMany({
        select: { id: true, amount: true, payment: { select: { name: true, payType: true, type: true } } },
		where: { employeeId: parseInt(employeeId), active: true}
	});
	if (!paymentEmployee) throw error(404, 'Employee not found');

	return json({ data:paymentEmployee });
};