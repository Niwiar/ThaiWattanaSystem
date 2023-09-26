/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import { jsonSchema } from '$src/lib/schema';

export const load: PageServerLoad = async ({ fetch }) => {
	const userRes = await fetch('/api/user');
	const users = await userRes.json();
	return { users: userRes.status == 200 ? users.data : null };
};

const userSchema = z.object({
	username: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	email: z.string().nonempty({ message: 'กรุณาใส่อีเมล' }).email('อีเมลไม่ถูกต้อง'),
	password: z.string().nonempty({ message: 'กรุณาใส่รหัสผ่าน' }),
	permission: jsonSchema
});

const userNoPwSchema = z.object({
	username: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	email: z.string().nonempty({ message: 'กรุณาใส่อีเมล' }).email('อีเมลไม่ถูกต้อง'),
	permission: jsonSchema
});
const passwordSchema = z.object({
	password: z.string().nonempty({ message: 'กรุณาใส่รหัสผ่าน' })
});

export const actions: Actions = {
	createUser: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const { hr, production, warehouse, setting } = formData;
		const permission = {
			hr: hr.toString(),
			production: production.toString(),
			warehouse: warehouse.toString(),
			setting: setting.toString()
		};
		const user = userSchema.safeParse({ ...formData, permission });

		if (!user.success) {
			const warnings = user.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify(user.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			type: 'user',
			success: true,
			message: `เพิ่มผู้ใช้ ${user.data.username} สำเร็จ`
		};
	},
	editUser: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const { hr, production, warehouse, setting } = formData;
		const permission = {
			hr: hr.toString(),
			production: production.toString(),
			warehouse: warehouse.toString(),
			setting: setting.toString()
		};
		const user = userNoPwSchema.safeParse({ ...formData, permission });

		if (!user.success) {
			const warnings = user.error.errors.map((err) => {
				return { field: err.path[0], message: err.message };
			});
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch(`/api/user/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(user.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return { type: 'user', success: true, message: `แก้ไขผู้ใช้ ${user.data.username} สำเร็จ` };
	},
	changePassword: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const user = passwordSchema.safeParse(formData);

		if (!user.success) {
			const warnings = user.error.errors.map((err) => {
				return { field: err.path[0], message: err.message };
			});
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch(`/api/user/${formData.id}/password`, {
			method: 'PUT',
			body: JSON.stringify(user.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return { type: 'user', success: true, message: `เปลี่ยนรหัสผ่านสำเร็จ` };
	},
	deleteUser: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/user/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return { type: 'position', success: true, message: `ลบผู้ใช้สำเร็จ` };
	}
};
