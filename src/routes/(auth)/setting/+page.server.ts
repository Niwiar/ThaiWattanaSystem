/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, RequestEvent } from './$types';

import { z } from 'zod';
import { jsonSchema } from '$src/lib/schema';

const settingSchema = z.object({
	workday: jsonSchema,
	startWorktime: z.string().nonempty({ message: 'กรุณาใส่เวลาเริ่มงาน' }),
	stopWorktime: z.string().nonempty({ message: 'กรุณาใส่เวลาเลิกงาน' }),
	lateTime: z.string().nonempty({ message: 'กรุณาใส่เวลามาสาย' })
});

const holidaySchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อวันหยุด' }),
	date: z.string().nonempty({ message: 'กรุณาใส่วันที่' })
});

export const actions: Actions = {
	createSetting: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		console.log(formData);
		const workday = {
			1: formData.d1 === 'on' ? true : false,
			2: formData.d2 === 'on' ? true : false,
			3: formData.d3 === 'on' ? true : false,
			4: formData.d4 === 'on' ? true : false,
			5: formData.d5 === 'on' ? true : false,
			6: formData.d6 === 'on' ? true : false,
			7: formData.d7 === 'on' ? true : false
		};
		const setting = settingSchema.safeParse({
			...formData,
			workday
		});

		if (!setting.success) {
			const warnings = setting.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch('/api/setting', {
			method: 'POST',
			body: JSON.stringify(setting.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			type: 'setting',
			success: true,
			message: `ตั้งค่าการทำงานสำเร็จ`
		};
	},
	createHoliday: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const holiday = holidaySchema.safeParse(formData);

		if (!holiday.success) {
			const warnings = holiday.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { type: 'holiday', warning: true, warnings });
		}

		const res = await fetch('/api/holiday', {
			method: 'POST',
			body: JSON.stringify(holiday.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			type: 'holiday',
			success: true,
			message: `เพิ่มวันหยุด ${holiday.data.name} สำเร็จ`
		};
	},
	editHoliday: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const holiday = holidaySchema.safeParse(formData);
		if (!holiday.success) {
			const warnings = holiday.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { type: 'holiday', warning: true, warnings });
		}
		const res = await fetch(`/api/holiday/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(holiday.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data);
		return {
			type: 'holiday',
			success: true,
			message: `แก้ไขวันหยุด ${holiday.data.name} สำเร็จ`
		};
	},
	deleteHoliday: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/holiday/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { type: 'holiday', success: true, message: `ลบวันหยุดสำเร็จ` };
	}
};
