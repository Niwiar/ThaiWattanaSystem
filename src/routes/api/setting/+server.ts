import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { Working } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const workday = await db.working.findFirst({
		orderBy: { updateAt: 'desc' }
	});
	return json({ data: workday });
};

export const POST: RequestHandler = async ({ request, setHeaders }: RequestEvent) => {
	const { workday, startWorktime, stopWorktime, lateTime } = (await request.json()) as Working;
	await db.working.create({
		data: {
			workday: JSON.stringify(workday),
			startWorktime,
			stopWorktime,
			lateTime
		}
	});
	setHeaders({
		'cache-control': 'max-age=60'
	});
	return json({ message: 'ok' });
};
