import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type Role } from '@prisma/client';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const { teamId } = params;
	console.log(teamId);
	const roles = await db.role.findMany({
		where: { teamId: parseInt(teamId) }
	});
	if (!roles) throw error(404, 'Role not found');

	return json({ data: roles });
};
