/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import type { PaymentList, PositionList, RoleList, TeamList } from '$src/lib/types/hr';

export const load: PageServerLoad = async ({ fetch }) => {
	const positionRes = await fetch('/api/setting/position');
	const positions = await positionRes.json();
	const paymentRes = await fetch('/api/setting/payment');
	const payments = await paymentRes.json();
	const teamRes = await fetch('/api/setting/team');
	const teams = await teamRes.json();
	const roleRes = await fetch('/api/setting/role');
	const roles = await roleRes.json();
	return {
		positions: positionRes.status == 200 ? (positions.data as PositionList[]) : [],
		teams: teamRes.status == 200 ? (teams.data as TeamList[]) : [],
		roles: roleRes.status == 200 ? (roles.data as RoleList[]) : [],
		payments: paymentRes.status == 200 ? (payments.data as PaymentList[]) : null
	};
};

const positionSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อตำแหน่ง' })
});

const teamSchema = z.object({
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อทีม' })
});

const roleSchema = z.object({
	teamId: z.string().nonempty({ message: 'กรุณาใส่ทีม' }),
	name: z.string().nonempty({ message: 'กรุณาใส่ชื่อหน้าที่' })
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
		const position = positionSchema.safeParse(formData);

		if (!position.success) {
			const warnings = position.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'position', warning: true, warnings });
		}

		const res = await fetch('/api/setting/position', {
			method: 'POST',
			body: JSON.stringify(position.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'position',
			success: true,
			message: `เพิ่มตำแหน่ง ${position.data.name} สำเร็จ`
		};
	},
	editPosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const position = positionSchema.safeParse(formData);
		if (!position.success) {
			const warnings = position.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'position', warning: true, warnings });
		}

		const res = await fetch(`/api/setting/position/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(position.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'position',
			success: true,
			message: `แก้ไขตำแหน่ง ${position.data.name} สำเร็จ`
		};
	},
	deletePosition: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/setting/position/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { name: 'position', success: true, message: `ลบตำแหน่งสำเร็จ` };
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
			return fail(400, { name: 'payment', warning: true, warnings });
		}

		const res = await fetch('/api/setting/payment', {
			method: 'POST',
			body: JSON.stringify(payment.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			name: 'payment',
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
			return fail(400, { name: 'payment', warning: true, warnings });
		}

		const res = await fetch(`/api/setting/payment/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(payment.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data);
		return {
			name: 'payment',
			id: formData.id as string,
			success: true,
			message: `แก้ไขตำแหน่ง ${payment.data.name} สำเร็จ`
		};
	},
	deletePayment: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/setting/payment/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return {
			name: 'payment',
			id: formData.id as string,
			success: true,
			message: `ลบตำแหน่งสำเร็จ`
		};
	},
	createTeam: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const team = teamSchema.safeParse(formData);

		if (!team.success) {
			const warnings = team.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'team', warning: true, warnings });
		}

		const res = await fetch('/api/setting/team', {
			method: 'POST',
			body: JSON.stringify(team.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'team',
			success: true,
			message: `เพิ่มทีม ${team.data.name} สำเร็จ`
		};
	},
	editTeam: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const team = teamSchema.safeParse(formData);
		if (!team.success) {
			const warnings = team.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'team', warning: true, warnings });
		}

		const res = await fetch(`/api/setting/team/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(team.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'team',
			success: true,
			message: `แก้ไขทีม ${team.data.name} สำเร็จ`
		};
	},
	deleteTeam: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/setting/team/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { name: 'team', success: true, message: `ลบทีมสำเร็จ` };
	},
	createRole: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const role = roleSchema.safeParse(formData);
		console.log(formData);

		if (!role.success) {
			const warnings = role.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'role', warning: true, warnings });
		}
		console.log(role.data);

		const res = await fetch('/api/setting/role', {
			method: 'POST',
			body: JSON.stringify(role.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'role',
			success: true,
			message: `เพิ่มหน้าที่ ${role.data.name} สำเร็จ`
		};
	},
	editRole: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const role = roleSchema.safeParse(formData);
		if (!role.success) {
			const warnings = role.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'role', warning: true, warnings });
		}

		const res = await fetch(`/api/setting/role/${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(role.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'role',
			success: true,
			message: `แก้ไขหน้าที่ ${role.data.name} สำเร็จ`
		};
	},
	deleteRole: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());

		const res = await fetch(`/api/setting/role/${formData.id}`, { method: 'DELETE' });
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		console.log(data.employee);
		return { name: 'role', success: true, message: `ลบหน้าที่สำเร็จ` };
	}
};
