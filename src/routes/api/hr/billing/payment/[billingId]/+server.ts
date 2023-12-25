import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

export const POST: RequestHandler = async ({ params, request }: RequestEvent) => {
	const billingId = params.billingId;
	const { paymentId, date, type, amount, payType, period } = await request.json();
	const payment = await db.employeePayment.create({
		data: {
			billingId: parseInt(billingId),
			paymentId: parseInt(paymentId),
			date: new Date(date),
			type: type,
			amount: parseFloat(amount),
			payType: parseInt(payType),
			period: parseFloat(period)
		}
	});
	console.log(payment);

	return json({ message: 'ok' });
};
