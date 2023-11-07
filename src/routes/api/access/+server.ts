import { json, error } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }: RequestEvent) => {
	console.log('GET');
	const query = url.searchParams;
	console.log(query);
	return json({ message: 'ok' });
};
export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	console.log('POST');
	const body = await request.json();
	console.log(body);
	return json({ message: 'ok' });
};

export const PUT: RequestHandler = async ({ request }: RequestEvent) => {
	console.log('PUT');
	const body = await request.json();
	console.log(body);
	return json({ message: 'ok' });
};
