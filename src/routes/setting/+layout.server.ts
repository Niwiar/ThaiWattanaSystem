import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async ({ request, locals, url }: LayoutServerLoadEvent) => {
	const user = locals.user;
	const permission = JSON.parse(user?.permission ?? '[]');
	if (permission['setting'] === '0') {
		const previousPage = request.headers.get('referer')?.split('/')[3].split('?')[0];
		throw redirect(302, `${previousPage || '/'}?redirectFrom=${url.pathname}`);
	}
};
