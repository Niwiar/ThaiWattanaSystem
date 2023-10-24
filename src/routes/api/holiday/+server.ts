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

export const POST: RequestHandler = async ({ request, setHeaders }: RequestEvent) => {
	const { name, date } = (await request.json()) as Holiday;

	await db.holiday.create({
		data: {
			name,
			date: new Date(date)
		}
	});
	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json({ message: 'ok' });
};
