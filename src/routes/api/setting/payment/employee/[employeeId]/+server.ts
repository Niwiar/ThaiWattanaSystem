import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import db from '$server/prisma';

import { createPaymentEmployee } from '$src/lib/server/controller/payment.controller';

export const GET: RequestHandler = async ({ params }) => {
	const employeeId = parseInt(params.employeeId);
	const payment = await db.payment.findMany({ where: { active: true } });
	let paymentEmployee = await db.paymentEmployee.findMany({
		select: {
			id: true,
			paymentId: true,
			amount: true,
			active: true,
			payment: { select: { name: true, payType: true, type: true } }
		},
		where: { payment: { active: true }, employeeId: employeeId },
		orderBy: { id: 'asc' }
	});

	if (payment.length !== paymentEmployee.length)
		paymentEmployee = await createPaymentEmployee(employeeId, payment, paymentEmployee);

	return json({ data: paymentEmployee });
};
