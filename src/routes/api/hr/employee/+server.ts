import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';

import { toObject, writeFile } from '$lib';

export const GET: RequestHandler = async ({ url }: RequestEvent) => {
	const dataField = url.searchParams.get('dataField');
	let employees: unknown[];

	switch (dataField) {
		case 'full':
			employees = await db.employee.findMany({
				where: { active: true },
				orderBy: { name: 'asc' },
				include: {
					position: { select: { name: true } },
					team: { select: { name: true } },
					role: { select: { name: true } }
				}
			});
			break;
		default:
			employees = await db.employee.findMany({
				select: {
					id: true,
					employeeCode: true,
					name: true,
					team: { select: { name: true } },
					role: { select: { name: true } },
					imageFile: true
				},
				where: { active: true },
				orderBy: { name: 'asc' }
			});
			break;
	}

	return json({ data: toObject(employees) });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { data, imageFile, citizenCardFile, jobApplicationFile, workPermitFile } =
		Object.fromEntries(await request.formData());

	const imageFileName = await writeFile(imageFile, 'img', 'employee');
	const citizenCardFileName = await writeFile(citizenCardFile, 'card', 'employee');
	const jobApplicationFileName = await writeFile(jobApplicationFile, 'job', 'employee');
	const workPermitFileName = await writeFile(workPermitFile, 'permit', 'employee');
	const body = { ...JSON.parse(data.toString()) };
	const employeeData = {
		...body,
		birthdate: new Date(body.birthdate),
		workdate: new Date(body.workdate),
		positionId: parseInt(body.positionId),
		teamId: parseInt(body.teamId),
		roleId: parseInt(body.roleId),
		salary: parseInt(body.salary),
		payType: parseInt(body.payType),
		leaveBusiness: parseInt(body.leaveBusiness),
		leaveSick: parseInt(body.leaveSick)
	};

	if (imageFileName) employeeData.imageFile = imageFileName;
	if (citizenCardFileName) employeeData.citizenCardFile = citizenCardFileName;
	if (jobApplicationFileName) employeeData.jobApplicationFile = jobApplicationFileName;
	if (workPermitFileName) employeeData.workPermitFile = workPermitFileName;
	await db.employee.create({ data: employeeData });

	return json({ message: 'ok' });
};
