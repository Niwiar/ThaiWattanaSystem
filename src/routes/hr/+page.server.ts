/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import { imageFileSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch }) => {
	const employeeRes = await fetch('/api/employee?dataField=full');
	const positionRes = await fetch('/api/position?dataField=dropdown');
	const holidayRes = await fetch('/api/holiday');
	const employee = await employeeRes.json();
	const position = await positionRes.json();
	const holidays = await holidayRes.json();

	return {
		employees: employeeRes.status == 200 ? employee.data : null,
		positions: positionRes.status == 200 ? position.data : null,
		holidays: holidayRes.status == 200 ? holidays.data : null
	};
};

const employeeSchema = z.object({
	firstname: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	lastname: z.string().optional(),
	birthdate: z.string().nonempty({ message: 'กรุณาใส่วันเกิด' }),
	gender: z.enum(['ชาย', 'หญิง', 'LGBTQ+', 'ไม่ระบุ'], {
		errorMap: () => {
			return { message: 'กรุณาเลือกเพศ' };
		}
	}),
	address: z.string().optional(),
	tel: z.string().optional(),
	nationality: z.string().optional(),
	citizenId: z.string().optional(),
	positionId: z.string().nonempty({ message: 'กรุณาเลือกตำแหน่งงาน' }),
	imageFile: imageFileSchema,
	citizenCardFile: imageFileSchema,
	jobApplicationFile: imageFileSchema,
	workPermitFile: imageFileSchema
});

export const actions: Actions = {
	getEmployeeAttendance: async (event: RequestEvent) => {
		const { request, fetch, params } = event;

		return;
	},
	createEmployee: async (event: RequestEvent) => {
		const { request, fetch, params } = event;
		console.log(params);
		const formData = Object.fromEntries(await request.formData());
		const employee = employeeSchema.safeParse(formData);

		if (!employee.success) {
			const warnings = employee.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const { imageFile, citizenCardFile, jobApplicationFile, workPermitFile, ...newBody } =
			employee.data;
		const body = new FormData();
		body.append('data', JSON.stringify(newBody));
		body.append('imageFile', imageFile as Blob);
		body.append('citizenCardFile', citizenCardFile as Blob);
		body.append('jobApplicationFile', jobApplicationFile as Blob);
		body.append('workPermitFile', workPermitFile as Blob);

		const res = await fetch('/api/employee', { method: 'POST', body });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			type: 'employee',
			success: true,
			message: `เพิ่มข้อมูลพนักงาน ${employee.data.firstname} สำเร็จ`
		};
	},
	editEmployee: async (event: RequestEvent) => {
		const { request, fetch, params } = event;
		console.log(params);
		const formData = Object.fromEntries(await request.formData());
		const employee = employeeSchema.safeParse(formData);

		if (!employee.success) {
			const warnings = employee.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const { imageFile, citizenCardFile, jobApplicationFile, workPermitFile, ...newBody } =
			employee.data;
		const body = new FormData();
		body.append('data', JSON.stringify(newBody));
		body.append('imageFile', imageFile as Blob);
		body.append('citizenCardFile', citizenCardFile as Blob);
		body.append('jobApplicationFile', jobApplicationFile as Blob);
		body.append('workPermitFile', workPermitFile as Blob);

		const res = await fetch(`/api/employee/${formData.id}`, { method: 'PUT', body });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			type: 'employee',
			success: true,
			message: `แก้ไขข้อมูลพนักงาน ${employee.data.firstname} สำเร็จ`
		};
	},
	deleteEmployee: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/employee/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { type: 'employee', success: true, message: `ลบข้อมูลพนักงานสำเร็จ` };
	}
};
