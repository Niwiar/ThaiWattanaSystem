import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { Prisma, type User } from '@prisma/client';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const userId = params.userId;
	console.log(userId);
	const user = await db.user.findUnique({
		where: { id: parseInt(userId) }
	});
	if (!user) throw error(404, 'user not found');

	return json({ user });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const userId = params.userId;
	const { username, email, permission } = (await request.json()) as User;
	try {
		await db.user.update({
			data: {
				username,
				email,
				permission: JSON.stringify(permission)
			},
			where: {
				id: parseInt(userId)
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					throw error(404, 'User not found');
				case 'P2002':
					throw error(404, 'Duplicate user name');
			}
		}
	}
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const userId = params.userId;
	console.log(userId);

	return json({ message: 'ok' });
};
