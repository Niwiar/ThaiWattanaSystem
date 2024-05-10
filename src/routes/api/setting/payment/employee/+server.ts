import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import db from '$server/prisma';

import type { PaymentEmployee } from '@prisma/client';

export const PUT: RequestHandler = async ({ request, params }) => {
	const { id, amount, active } = (await request.json()) as PaymentEmployee;
	await db.paymentEmployee.update({
		data: { amount, active },
		where: { id: id }
	});
	return json({ message: 'ok' });
};
