import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import bcrypt from 'bcrypt';

import type { User } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const users = await db.user.findMany({ where: { active: true } });
	return json({ data: users });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { username, email, password, permission } = (await request.json()) as User;
	const isDup = await db.user.findFirst({
		where: {
			OR: [{ username: username }, { email: email }]
		}
	});

	if (isDup) throw error(403, 'Duplicate username or email');

	const hashpass = await bcrypt.hash(password, 10);

	const user = await db.user.create({
		data: {
			username,
			password: hashpass,
			email,
			permission: JSON.stringify(permission)
		}
	});
	console.log(user);

	return json({ message: 'ok' });
};
