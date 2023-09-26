import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

import db from '$server/prisma';
import type { Employee, Prisma } from '@prisma/client';
import { writeFile } from '$src/lib';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const employeeId = params.employeeId;
	console.log(employeeId);
	const employee = await db.employee.findUnique({
		where: { id: parseInt(employeeId) }
	});
	if (!employee) throw error(404, 'Employee not found');

	return json({ employee });
};

export const PUT: RequestHandler = async ({ request }: RequestEvent) => {
	const { data, imageFile, citizenCardFile, jobApplicationFile, workPermitFile } =
		Object.fromEntries(await request.formData());

	const imageFileName = await writeFile(imageFile, 'img', 'employee');
	const citizenCardFileName = await writeFile(citizenCardFile, 'card', 'employee');
	const jobApplicationFileName = await writeFile(jobApplicationFile, 'job', 'employee');
	const workPermitFileName = await writeFile(workPermitFile, 'permit', 'employee');
	const employeeData: Prisma.EmployeeCreateInput = { ...(JSON.parse(data.toString()) as Employee) };
	console.log(employeeData);

	const employee = await db.employee.create({
		data: {
			...employeeData,
			imageFile: imageFileName,
			citizenCardFile: citizenCardFileName,
			jobApplicationFile: jobApplicationFileName,
			workPermitFile: workPermitFileName
		}
	});
	console.log(employee);
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const employeeId = params.employeeId;
	console.log(employeeId);

	return json({ message: 'ok' });
};
