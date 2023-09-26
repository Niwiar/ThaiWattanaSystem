import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyAuth } from '$lib/server/jwt';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/auth')) {
		const response = await resolve(event);
		if (event.url.pathname.endsWith('/logout')) event.locals.user = null;
		return response;
	}
	event.locals.user = await verifyAuth(event);
	if (event.url.pathname === '/login') {
		if (event.locals.user) throw redirect(302, '/');
		return resolve(event);
	}
	// if (!event.locals.user) {
	// 	const fromUrl = event.url.pathname + event.url.search;
	// 	throw redirect(302, `/login?redirectTo=${fromUrl}`);
	// }
	const response = await resolve(event);

	return response;
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.endsWith('/api/auth/refresh')) {
		const token = event.cookies.get('refreshToken');
		if (token) request.headers.set('authorization', `bearer ${token}`);
	}

	return fetch(request);
};

export const handleError: HandleServerError = async ({ error, event }) => {
	console.log(error);
	console.log(event);

	return { message: 'error' };
};
