/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';

export const load: PageServerLoad = async ({ fetch }) => {
	const positionRes = await fetch('/api/position');
	const positions = await positionRes.json();
	return { positions: positionRes.status == 200 ? positions.data : null };
};

const positionSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	salary: z.number({ required_error: 'กรุณาใส่เงินเดือน' }),
	payType: z.number({ required_error: 'กรุณาใส่ประเภทการจ่ายเงินเดือน' })
});

export const actions: Actions = {
	createPosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const position = positionSchema.safeParse({
			name: formData.name,
			salary: parseFloat(formData.salary as string),
			payType: parseFloat(formData.payType as string)
		});

		if (!position.success) {
			const warnings = position.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch('/api/position', {
			method: 'POST',
			body: JSON.stringify(position.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			type: 'position',
			success: true,
			message: `เพิ่มตำแหน่ง ${position.data.name} สำเร็จ`
		};
	},
	editPosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const position = positionSchema.safeParse({
			name: formData.name,
			salary: parseFloat(formData.salary as string),
			payType: parseFloat(formData.payType as string)
		});
		console.log(formData);
		if (!position.success) {
			const warnings = position.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch(`/api/position/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(position.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data);
		return {
			type: 'position',
			success: true,
			message: `แก้ไขตำแหน่ง ${position.data.name} สำเร็จ`
		};
	},
	deletePosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/position/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { type: 'position', success: true, message: `ลบตำแหน่งสำเร็จ` };
	}
};
