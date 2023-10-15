/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import type { PaymentList, PositionList } from '$src/lib/types/hr';

export const load: PageServerLoad = async ({ fetch }) => {
	const positionRes = await fetch('/api/position');
	const paymentRes = await fetch('/api/payment');
	const positions = await positionRes.json();
	const payments = await paymentRes.json();
	return {
		positions: positionRes.status == 200 ? (positions.data as PositionList[]) : null,
		payments: paymentRes.status == 200 ? (payments.data as PaymentList[]) : null
	};
};

const positionSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	salary: z.number({ required_error: 'กรุณาใส่เงินเดือน' }),
	payType: z.number({ required_error: 'กรุณาใส่ประเภทการจ่ายเงินเดือน' })
});

const paymentSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อ' }),
	type: z.number({ required_error: 'กรุณาใส่ประเภทการหัก/การจ่าย' }),
	amount: z.number({ required_error: 'กรุณาใส่จำนวนเงิน' }),
	payType: z.number({ required_error: 'กรุณาใส่ประเภทการจ่ายเงินเดือน' })
});

export const actions: Actions = {
	createPosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const position = positionSchema.safeParse({
			name: formData.name,
			salary: parseFloat(formData.salary as string),
			payType: parseInt(formData.payType as string)
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
	},
	createPayment: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const payment = paymentSchema.safeParse({
			name: formData.name,
			amount: parseFloat(formData.amount as string),
			payType: parseInt(formData.payType as string),
			type: parseInt(formData.type as string)
		});

		if (!payment.success) {
			const warnings = payment.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch('/api/payment', {
			method: 'POST',
			body: JSON.stringify(payment.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			type: 'payment',
			success: true,
			message: `เพิ่มตำแหน่ง ${payment.data.name} สำเร็จ`
		};
	},
	editPayment: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const payment = paymentSchema.safeParse({
			name: formData.name,
			amount: parseFloat(formData.amount as string),
			payType: parseInt(formData.payType as string),
			type: parseInt(formData.type as string)
		});
		console.log(formData);
		if (!payment.success) {
			const warnings = payment.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { warning: true, warnings });
		}

		const res = await fetch(`/api/payment/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(payment.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data);
		return {
			type: 'payment',
			id: formData.id as string,
			success: true,
			message: `แก้ไขตำแหน่ง ${payment.data.name} สำเร็จ`
		};
	},
	deletePayment: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/payment/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			type: 'payment',
			id: formData.id as string,
			success: true,
			message: `ลบตำแหน่งสำเร็จ`
		};
	}
};
