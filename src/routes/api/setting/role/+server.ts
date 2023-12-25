import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { Role } from '@prisma/client';

export const GET: RequestHandler = async ({ url, setHeaders }: RequestEvent) => {
	const dataField = url.searchParams.get('dataField');
	let roles: unknown[] = [];

	switch (dataField) {
		case 'dropdown':
			setHeaders({
				'cache-control': 'max-age=60'
			});
			roles = await db.role.findMany({
				select: {
					id: true,
					name: true
				},
				where: { active: true },
				orderBy: { id: 'asc' }
			});
			break;
		default:
			roles = await db.role.findMany({ where: { active: true } });
			break;
	}
	return json({ data: roles });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { name, teamId } = await request.json();
	const isDup = await db.role.findFirst({
		select: { active: true, id: true },
		where: { name }
	});

	if (isDup) {
		throw error(403, 'Duplicate role');
	}

	await db.role.create({
		data: {
			name,
			teamId: parseInt(teamId)
		}
	});

	return json({ message: 'ok' });
};
