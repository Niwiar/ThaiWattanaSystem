import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import { writeFile } from '$lib';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const employeeId = params.employeeId;
	console.log(employeeId);
	const employee = await db.employee.findUnique({
		where: { id: parseInt(employeeId) }
	});
	if (!employee) throw error(404, 'Employee not found');

	return json({ employee });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const employeeId = params.employeeId;
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

	await db.employee.update({
		data: employeeData,
		where: { id: parseInt(employeeId) }
	});
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const employeeId = params.employeeId;

	await db.employee.update({
		data: { active: false },
		where: { id: parseInt(employeeId) }
	});

	// await db.employee.delete({
	// 	where: { id: parseInt(employeeId) }
	// });

	return json({ message: 'ok' });
};
