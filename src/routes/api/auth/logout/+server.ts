import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }: RequestEvent) => {
	cookies.delete('token', { path: '/' });
	cookies.delete('refreshToken', { path: '/' });
	return json({ success: 'ok' });
};
