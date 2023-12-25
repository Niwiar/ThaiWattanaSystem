import type { RequestEvent } from '@sveltejs/kit';
import { ACCESS_TOKEN_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { UserInfo } from '../../app';

export const verifyAuth = async (event: RequestEvent) => {
	const { cookies } = event;
	const token = cookies.get('token');
	if (!token) return await refreshAccessToken(event);

	let userInfo: UserInfo | null = null;
	jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err) {
			const refreshUser = await refreshAccessToken(event);
			return (userInfo = refreshUser);
		}
		return (userInfo = user as UserInfo);
	});
	return userInfo;
};

export const refreshAccessToken = async (event: RequestEvent) => {
	const { fetch } = event;
	const res = await fetch('/api/auth/refresh', {
		method: 'post'
	});
	if (res.status != 200) return null;
	const data = await res.json();
	setToken(event, data.token);
	return data.user;
};

export const setToken = (event: RequestEvent, token: string) => {
	const { cookies } = event;
	cookies.set('token', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 30,
		secure: false
	});
};

export const setRefreshToken = (event: RequestEvent, refreshToken: string) => {
	const { cookies } = event;
	cookies.set('refreshToken', refreshToken, {
		httpOnly: true,
		path: '/',
		maxAge: 60 * 60 * 24,
		sameSite: 'strict',
		secure: false
	});
};
