import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type Role } from '@prisma/client';

export const GET: RequestHandler = async ({ params, url }: RequestEvent) => {
	const dataField = url.searchParams.get('dataField');
	let roles: unknown[] = [];
	const { teamId } = params;

	switch (dataField) {
		case 'dropdown':
			roles = await db.role.findMany({
				select: {
					id: true,
					name: true
				},
				where: { teamId: parseInt(teamId), active: true },
				orderBy: { id: 'asc' }
			});
			break;
		default:
			roles = await db.role.findMany({ where: { teamId: parseInt(teamId), active: true } });
			break;
	}
	if (!roles) throw error(404, 'Role not found');

	return json({ data: roles });
};
