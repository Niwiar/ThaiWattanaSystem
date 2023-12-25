import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type Payment } from '@prisma/client';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const paymentId = params.paymentId;
	console.log(paymentId);
	const position = await db.position.findUnique({
		where: { id: parseInt(paymentId) }
	});
	if (!position) throw error(404, 'Position not found');

	return json({ position });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const paymentId = params.paymentId;
	const { name, type, amount, payType } = (await request.json()) as Payment;
	console.log(paymentId);
	try {
		await db.payment.update({
			data: {
				type,
				amount,
				name,
				payType
			},
			where: {
				id: parseInt(paymentId)
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					throw error(404, 'Payment not found');
				case 'P2002':
					throw error(404, 'Duplicate payment name');
			}
		}
	}
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const paymentId = params.paymentId;
	console.log(paymentId);

	await db.payment.update({
		data: { active: false },
		where: { id: parseInt(paymentId) }
	});

	return json({ message: 'ok' });
};
