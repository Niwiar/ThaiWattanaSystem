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
					imageFile: true
				},
				include: {
					position: { select: { name: true } },
					team: { select: { name: true } },
					role: { select: { name: true } }
				},
				where: { active: true },
				orderBy: { name: 'asc' }
			});
			break;
	}

	return json({ data: toObject(employees) });
};

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { data, imageFile, citizenCardFile, jobApplicationFile, workPermitFile }:any =
		Object.fromEntries(await request.formData());
	
	const body = { ...JSON.parse(data.toString()) };
	const {employeeCode} = body
	const imageFileName = await writeFile(imageFile, `${employeeCode}_img`, 'employee');
	const citizenCardFileName = await writeFile(citizenCardFile, `${employeeCode}_card`, 'employee');
	const jobApplicationFileName = await writeFile(jobApplicationFile, `${employeeCode}_job`, 'employee');
	const workPermitFileName = await writeFile(workPermitFile, `${employeeCode}_permit`, 'employee');
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
