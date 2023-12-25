/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

import { z } from 'zod';
import { imageFileSchema } from '$lib/schema';
import type { PaymentList } from '$src/lib/types/hr';
import db from '$src/lib/server/prisma';

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
	teamId: z.string().optional(),
	roleId: z.string().optional(),
	bankName: z.string().optional(),
	bankAccountNo: z.string().optional(),
	bankAccountHolder: z.string().optional(),
	imageFile: imageFileSchema,
	citizenCardFile: imageFileSchema,
	jobApplicationFile: imageFileSchema,
	workPermitFile: imageFileSchema
});

const leaveSchema = z.object({
	type: z.string().nonempty({ message: 'กรุณาเลือกประเภทการลา' }),
	period: z.string().nonempty({ message: 'กรุณาเลือกช่วงเวลา' }),
	date: z.string().nonempty({ message: 'กรุณากำหนดวันลา' })
});

const checkinSchema = z.object({
	checkin: z.string().nonempty({ message: 'กรุณาเลือกประเภทการลา' }),
	checkout: z.string().nonempty({ message: 'กรุณาเลือกช่วงเวลา' }),
	date: z.string().nonempty({ message: 'กรุณากำหนดวันเวลาเข้างาน' })
});

const otSchema = z.object({
	billingId: z.string(),
	otId: z.string().nonempty({ message: 'กรุณาเลือกประเภทการทำงานล่วงเวลา' }),
	time: z.string().nonempty({ message: 'กรุณาใส่เวลาการทำงาน' }),
	date: z.string().nonempty({ message: 'กรุณาใส่วันที่ทำงาน' }),
	amount: z.string().nonempty({ message: 'กรุณาใส่จำนวนเงิน' }),
	payType: z.string().nonempty({ message: 'กรุณาใส่ชนิดการจ่ายเงิน' })
});

export const load: PageServerLoad = async ({ fetch }) => {
	const paymentRes = await fetch('/api/setting/payment');
	const payments = await paymentRes.json();
	return {
		ot:
			paymentRes.status == 200 ? (payments.data as PaymentList[]).filter((e) => e.type === 1) : null
	};
};

export const actions: Actions = {
	addCheckIn: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		const checkint = checkinSchema.safeParse(formData);
		if (!checkint.success) {
			const warnings = checkint.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'attendance', warning: true, warnings });
		}
		const { date, checkin, checkout } = checkint.data;
		const checkIn = await db.employeeAttendance.create({
			data: {
				employeeId: parseInt(formData.id.toString()),
				date: new Date(date),
				createdAt: new Date(`${date} ${checkin}`)
			}
		});
		const checkOut = await db.employeeAttendance.create({
			data: {
				employeeId: parseInt(formData.id.toString()),
				date: new Date(date),
				createdAt: new Date(`${date} ${checkout}`)
			}
		});
		console.log(checkIn, checkOut);

		return {
			name: 'attendance',
			success: true,
			message: `เพิ่มข้อมูลสำเร็จ`
		};
	},
	createAttendance: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		if (formData.issueType === '1') {
			const leave = leaveSchema.safeParse(formData);
			if (!leave.success) {
				const warnings = leave.error.errors.map((err) => {
					return {
						field: err.path[0],
						message: err.message
					};
				});
				console.log(warnings);
				return fail(400, { name: 'attendance', warning: true, warnings });
			}
			const { date, type, period } = leave.data;
			const payment = await db.employeeLeave.create({
				data: {
					employeeId: parseInt(formData.id.toString()),
					date: new Date(date),
					type: parseInt(type),
					period: parseFloat(period)
				}
			});
			console.log(payment);
		} else {
			const ot = otSchema.safeParse(formData);
			if (!ot.success) {
				const warnings = ot.error.errors.map((err) => {
					return {
						field: err.path[0],
						message: err.message
					};
				});
				console.log(warnings);
				return fail(400, { name: 'attendance', warning: true, warnings });
			}
			const { date, amount, billingId, otId, payType, time } = ot.data;
			const payment = await db.employeePayment.create({
				data: {
					billingId: parseInt(billingId),
					paymentId: parseInt(otId),
					date: new Date(date),
					type: 1, // OT
					amount: parseFloat(amount),
					payType: parseInt(payType),
					period: parseFloat(time) / 60
				}
			});
			console.log(payment);
		}

		return {
			name: 'attendance',
			success: true,
			message: `เพิ่มข้อมูลสำเร็จ`
		};
	},
	editLeave: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		const leave = leaveSchema.safeParse(formData);
		if (!leave.success) {
			const warnings = leave.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'attendance', warning: true, warnings });
		}
		const { date, type, period } = leave.data;
		await db.employeeLeave.update({
			data: {
				date: new Date(date),
				type: parseInt(type),
				period: parseFloat(period)
			},
			where: { id: parseInt(formData.id.toString()) }
		});

		return {
			name: 'attendance',
			success: true,
			message: `แก้ไขวันลาสำเร็จ`
		};
	},
	deleteLeave: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		await db.employeeLeave.delete({
			where: { id: parseInt(formData.id.toString()) }
		});

		return {
			name: 'attendance',
			success: true,
			message: `ลบวันลาสำเร็จ`
		};
	},
	editOT: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		const ot = otSchema.safeParse(formData);
		if (!ot.success) {
			const warnings = ot.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			console.log(warnings);
			return fail(400, { name: 'attendance', warning: true, warnings });
		}
		const { date, amount, otId, payType, time } = ot.data;
		await db.employeePayment.update({
			data: {
				paymentId: parseInt(otId),
				date: new Date(date),
				type: 1, // OT
				amount: parseFloat(amount),
				payType: parseInt(payType),
				period: parseFloat(time) / 60
			},
			where: { id: parseInt(formData.id.toString()) }
		});

		return {
			name: 'attendance',
			success: true,
			message: `แก้ไขการทำงานล่วงเวลาสำเร็จ`
		};
	},
	deleteOT: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		await db.employeePayment.delete({
			where: { id: parseInt(formData.id.toString()) }
		});

		return {
			name: 'attendance',
			success: true,
			message: `ลบการทำงานล่วงเวลาสำเร็จ`
		};
	},
	createEmployee: async (event: RequestEvent) => {
		const { request, fetch } = event;
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
		const { request, fetch } = event;
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
