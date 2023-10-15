import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import type { Holiday } from '@prisma/client';

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const holidayId = params.holidayId;
	const { name, date } = (await request.json()) as Holiday;
	await db.holiday.update({
		data: {
			name,
			date: new Date(date)
		},
		where: {
			id: parseInt(holidayId)
		}
	});
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const holidayId = params.holidayId;
	console.log(holidayId);

	await db.holiday.delete({
		where: { id: parseInt(holidayId) }
	});

	return json({ message: 'ok' });
};
