import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { Position } from '@prisma/client';

export const GET: RequestHandler = async ({ url }: RequestEvent) => {
	const dataField = url.searchParams.get('dataField');
	let positions: unknown[] = [];

	switch (dataField) {
		case 'dropdown':
			positions = await db.position.findMany({
				select: {
					id: true,
					name: true
				},
				where: { active: true },
				orderBy: { id: 'asc' }
			});
			break;
		default:
			positions = await db.position.findMany({ where: { active: true } });
			break;
	}
	return json({ data: positions });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { name, salary, payType } = (await request.json()) as Position;
	const isDup = await db.position.findUnique({
		select: { active: true, id: true },
		where: { name }
	});

	if (isDup) {
		if (isDup.active) throw error(403, 'Duplicate position');
		else {
			await db.position.update({
				data: { salary, payType, active: true },
				where: { id: isDup.id }
			});
			return json({ message: 'ok' });
		}
	}

	await db.position.create({
		data: {
			name,
			salary,
			payType
		}
	});

	return json({ message: 'ok' });
};
