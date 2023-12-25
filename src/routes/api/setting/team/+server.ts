import { error, json } from '@sveltejs/kit';

import db from '$server/prisma';

import type { Position } from '@prisma/client';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, setHeaders }: RequestEvent) => {
	const dataField = url.searchParams.get('dataField');
	let teams: unknown[] = [];

	switch (dataField) {
		case 'dropdown':
			setHeaders({
				'cache-control': 'max-age=60'
			});
			teams = await db.team.findMany({
				select: {
					id: true,
					name: true
				},
				where: { active: true },
				orderBy: { id: 'asc' }
			});
			break;
		default:
			teams = await db.team.findMany({ where: { active: true } });
			break;
	}
	return json({ data: teams });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { name } = (await request.json()) as Position;
	const isDup = await db.team.findUnique({
		select: { active: true, id: true },
		where: { name }
	});

	if (isDup) {
		throw error(403, 'Duplicate team');
	}

	await db.team.create({
		data: {
			name
		}
	});

	return json({ message: 'ok' });
};
