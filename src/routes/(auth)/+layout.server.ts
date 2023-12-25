import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, fetch }: LayoutServerLoadEvent) => {
	const redirectFrom = url.searchParams.get('redirectFrom');
	if (redirectFrom) {
		return {
			alert: `You don't have permission for ${redirectFrom.split('/')[1]}`,
			user: locals.user
		};
	}
	const dataFetch = async (url: string) => {
		const res = await fetch(url);
		const result = await res.json();
		return res.status == 200 ? result.data : null;
	};
	// const holidayRes = await fetch('/api/holiday');
	// const holidays = await holidayRes.json();
	// const settingRes = await fetch('/api/setting');
	// const setting = await settingRes.json();
	// console.log(holidays.data);
	return {
		user: locals.user,
		setting: await dataFetch('/api/setting'),
		holidays: await dataFetch('/api/holiday')
	};
};
