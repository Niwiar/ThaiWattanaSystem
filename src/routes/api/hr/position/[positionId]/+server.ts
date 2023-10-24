import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type Position } from '@prisma/client';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const positionId = params.positionId;
	console.log(positionId);
	const position = await db.position.findUnique({
		where: { id: parseInt(positionId) }
	});
	if (!position) throw error(404, 'Position not found');

	return json({ position });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const positionId = params.positionId;
	const { name, salary, payType } = (await request.json()) as Position;
	console.log(positionId);
	try {
		await db.position.update({
			data: {
				name,
				salary,
				payType
			},
			where: {
				id: parseInt(positionId)
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					throw error(404, 'Position not found');
				case 'P2002':
					throw error(404, 'Duplicate position name');
			}
		}
	}
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const positionId = params.positionId;
	console.log(positionId);

	await db.position.update({
		data: { active: false },
		where: { id: parseInt(positionId) }
	});

	return json({ message: 'ok' });
};
