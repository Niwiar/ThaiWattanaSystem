/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionFailure, fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import { imageFileSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch }) => {};

const employeeSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	employeeCode: z.string().nonempty({ message: 'กรุณาใส่รหัสพนักงาน' }),
	salary: z.string().nonempty({ message: 'กรุณากำหนดเงินเดือน' }),
	payType: z.string(),
	leaveBusiness: z.string().nonempty({ message: 'กรุณากำหนดวันลา' }),
	leaveSick: z.string().nonempty({ message: 'กรุณากำหนดวันลา' }),
	workdate: z.string().nonempty({ message: 'กรุณาใส่วันที่เริ่มงาน' }),
	birthdate: z.string().nonempty({ message: 'กรุณาใส่วันเกิด' }),
	gender: z.enum(['ชาย', 'หญิง', 'LGBTQ+', 'ไม่ระบุ'], {
		errorMap: () => ({ message: 'กรุณาเลือกเพศ' })
	}),
	address: z.string().optional(),
	tel: z.string().optional(),
	nationality: z.string().optional(),
	socialServiceId: z.string().optional(),
	citizenId: z.string().optional(),
	positionId: z.string().nonempty({ message: 'กรุณาเลือกตำแหน่งงาน' }),
	teamId: z.string().nonempty({ message: 'กรุณาเลือกทีม' }),
	roleId: z.string().nonempty({ message: 'กรุณาเลือกหน้าที่' }),
	imageFile: imageFileSchema,
	citizenCardFile: imageFileSchema,
	jobApplicationFile: imageFileSchema,
	workPermitFile: imageFileSchema
});

export const actions: Actions = {
	createEmployee: async (event: RequestEvent) => {
		const { request, fetch, params } = event;
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
			return fail(400, { name: 'employee', warning: true, warnings });
		}

		const { imageFile, citizenCardFile, jobApplicationFile, workPermitFile, ...newBody } =
			employee.data;
		const body = new FormData();
		body.append('data', JSON.stringify(newBody));
		body.append('imageFile', imageFile as Blob);
		body.append('citizenCardFile', citizenCardFile as Blob);
		body.append('jobApplicationFile', jobApplicationFile as Blob);
		body.append('workPermitFile', workPermitFile as Blob);

		const res = await fetch('/api/hr/employee', { method: 'POST', body: body });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'employee',
			success: true,
			message: `เพิ่มข้อมูลพนักงาน ${employee.data.name} สำเร็จ`
		};
	},
	editEmployee: async (event: RequestEvent) => {
		const { request, fetch, params } = event;
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
			return fail(400, { name: 'employee', warning: true, warnings });
		}

		const { imageFile, citizenCardFile, jobApplicationFile, workPermitFile, ...newBody } =
			employee.data;
		const body = new FormData();
		body.append('data', JSON.stringify(newBody));
		body.append('imageFile', imageFile as Blob);
		body.append('citizenCardFile', citizenCardFile as Blob);
		body.append('jobApplicationFile', jobApplicationFile as Blob);
		body.append('workPermitFile', workPermitFile as Blob);

		const res = await fetch(`/api/hr/employee/${formData.id}`, { method: 'PUT', body: body });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'employee',
			success: true,
			message: `แก้ไขข้อมูลพนักงาน ${employee.data.name} สำเร็จ`
		};
	},
	deleteEmployee: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/hr/employee/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return { name: 'employee', success: true, message: `ลบข้อมูลพนักงานสำเร็จ` };
	}
};
