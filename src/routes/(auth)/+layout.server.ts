import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, fetch }: LayoutServerLoadEvent) => {
	const redirectFrom = url.searchParams.get('redirectFrom');
	if (redirectFrom) {
		return {
			alert: `You don't have permission for ${redirectFrom.split('/')[1]}`,
			user: locals.user
		};
	}
	const holidayRes = await fetch('/api/holiday');
	const holidays = await holidayRes.json();
	const settingRes = await fetch('/api/setting');
	const setting = await settingRes.json();
	// console.log(holidays.data);
	return {
		user: locals.user,
		setting: settingRes.status == 200 ? setting.data : null,
		holidays: holidayRes.status == 200 ? holidays.data : null
	};
};
