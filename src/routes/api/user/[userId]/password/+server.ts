import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const userId = params.userId;
	const { password } = (await request.json()) as User;

	const hashpass = await bcrypt.hash(password, 10);
	await db.user.update({
		data: {
			password: hashpass
		},
		where: {
			id: parseInt(userId)
		}
	});
	return json({ message: 'ok' });
};
