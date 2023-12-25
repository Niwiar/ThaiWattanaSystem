import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

export const POST: RequestHandler = async ({ params, request }: RequestEvent) => {
	const { employeeId } = params;
	const { date, type, period } = await request.json();
	const payment = await db.employeeLeave.create({
		data: {
			employeeId: parseInt(employeeId),
			date: new Date(date),
			type: parseInt(type),
			period: parseFloat(period)
		}
	});
	console.log(payment);

	return json({ message: 'ok' });
};
