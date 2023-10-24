import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type Role } from '@prisma/client';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const { roleId } = params;
	console.log(roleId);
	const role = await db.role.findUnique({
		where: { id: parseInt(roleId) }
	});
	if (!role) throw error(404, 'Role not found');

	return json({ role });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const { roleId } = params;
	const { name } = (await request.json()) as Role;
	try {
		await db.role.update({
			data: {
				name
			},
			where: {
				id: parseInt(roleId)
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					throw error(404, 'Role not found');
				case 'P2002':
					throw error(404, 'Duplicate role name');
			}
		}
	}
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const { roleId } = params;
	console.log(roleId);

	await db.role.update({
		data: { active: false },
		where: { id: parseInt(roleId) }
	});

	return json({ message: 'ok' });
};
