import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { Payment } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const payments = await db.payment.findMany({ where: { active: true } });

	return json({ data: payments });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { type, name, amount, payType } = (await request.json()) as Payment;
	const isDup = await db.payment.findUnique({
		select: { active: true, id: true },
		where: { name }
	});

	console.log(isDup);
	if (isDup) {
		if (isDup.active) throw error(403, 'Duplicate payment');
		else {
			await db.payment.update({
				data: { type, amount, payType, active: true },
				where: { id: isDup.id }
			});
			return json({ message: 'ok' });
		}
	}

	await db.payment.create({
		data: {
			name,
			type,
			amount,
			payType
		}
	});

	return json({ message: 'ok' });
};
