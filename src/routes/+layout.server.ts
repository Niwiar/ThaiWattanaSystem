import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }: LayoutServerLoadEvent) => {
	const redirectFrom = url.searchParams.get('redirectFrom');
	if (redirectFrom) {
		return {
			alert: `You don't have permission for ${redirectFrom.split('/')[1]}`,
			user: locals.user
		};
	}
	return { user: locals.user };
};
