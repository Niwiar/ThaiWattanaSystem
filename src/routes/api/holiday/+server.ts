import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { Holiday } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const holidays = await db.holiday.findMany({
		orderBy: { date: 'desc' }
	});

	return json({ data: holidays });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { name, date } = (await request.json()) as Holiday;

	await db.holiday.create({
		data: {
			name,
			date: new Date(date)
		}
	});

	return json({ message: 'ok' });
};
