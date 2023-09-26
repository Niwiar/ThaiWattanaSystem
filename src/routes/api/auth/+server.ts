import { json, error } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';

import type { User } from '@prisma/client';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { toObject } from '$lib';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const body: User = await request.json();
	const user = await db.user.findFirst({
		select: { id: true, password: true, permission: true },
		where: {
			username: body.username
		}
	});

	if (!user) {
		throw error(403, 'Invalid username or password');
	}
	const isAuth = await bcrypt.compare(body.password, user.password);
	if (!isAuth) {
		throw error(403, 'Invalid username or password');
	}
	const { id, permission } = toObject(user);

	const tokenData = { id, username: body.username, permission };
	const token = jwt.sign(tokenData, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
	const refreshToken = jwt.sign(tokenData, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

	return json({ token, refreshToken });
};
