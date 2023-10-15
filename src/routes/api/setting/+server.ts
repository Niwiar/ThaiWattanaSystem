import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import type { SettingWorking } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const holidays = await db.settingWorking.findFirst({
		orderBy: { updateAt: 'desc' }
	});

	return json({ data: holidays });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { workday, startWorktime, stopWorktime, leaveBusiness, leaveSick } =
		(await request.json()) as SettingWorking;
	await db.settingWorking.create({
		data: {
			workday: JSON.stringify(workday),
			startWorktime,
			stopWorktime,
			leaveBusiness,
			leaveSick
		}
	});

	return json({ message: 'ok' });
};
