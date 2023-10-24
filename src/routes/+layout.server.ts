import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async ({ locals }: LayoutServerLoadEvent) => {
	return {
		user: locals.user
	};
};
