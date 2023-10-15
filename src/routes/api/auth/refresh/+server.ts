import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';

import jwt from 'jsonwebtoken';
import type { UserInfo } from '$src/app';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const refreshToken = request.headers.get('authorization')?.split(' ')[1];
	if (!refreshToken) throw error(401, 'Unauthorized');

	try {
		const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as UserInfo;
		const tokenData = { id: user.id, username: user.username, permission: user.permission };
		const token = jwt.sign(tokenData, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

		return json({ token, user });
	} catch (err) {
		throw error(403, 'Invalid token');
	}
};
