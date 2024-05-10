/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fail } from '@sveltejs/kit';

import type { Actions, RequestEvent } from './$types';

import { z } from 'zod';
import db from '$src/lib/server/prisma';

const updateEmployeePayment = async (id: string, amount: FormDataEntryValue) => {
	await db.employeePayment.update({
		data: { amount: parseFloat(amount.toString()) },
		where: { id: parseInt(id) }
	});
};

const printbillingSchema = z.object({
	employeeId: z.string().nonempty({ message: 'กรุณาเลือกพนักงาน' })
});

export const actions: Actions = {
	printBilling: async (event: RequestEvent) => {
		const { request, fetch } = event;
		const formData = Object.fromEntries(await request.formData());
		const printing = printbillingSchema.safeParse(formData);

		if (!printing.success) {
			const warnings = printing.error.errors.map((err) => {
				return {
					field: err.path[0],
					message: err.message
				};
			});
			return fail(400, { name: 'billing-print', warning: true, warnings });
		}

		const res = await fetch('/api/hr/billing/print', {
			method: 'POST',
			body: JSON.stringify(printing.data)
		});
		const data = await res.json();
		if (res.status != 200) return fail(403, { error: true, message: data.message });
		return {
			name: 'billing-print',
			success: true,
			message: '',
			data: data
		};
	},
	editฺBilling: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		console.log('formData', formData);
		for (const [key, value] of Object.entries(formData)) {
			if (key.includes('allowance'))
				await updateEmployeePayment(key.replace('allowance', ''), value);
			else if (key.includes('welfare'))
				await updateEmployeePayment(key.replace('welfare', ''), value);
			else if (key.includes('deduction'))
				await updateEmployeePayment(key.replace('deduction', ''), value);
			else {
				console.log(key,value)
			}
		}
		// await db.billing.update({
		// 	where: { id: parseInt(formData.id.toString()) },
		// 	data: {
		// 		salary: parseFloat(formData.salary.toString()),
		// 		payDate: formData.payDate !== '' ? new Date(formData.payDate.toString()) : null
		// 	}
		// });
		return {
			name: 'billing',
			success: true,
			message: `แก้ไขข้อมูลเงินเดือนพนักงานสำเร็จ`
		};
	},
	paidฺBilling: async (event: RequestEvent) => {
		const { request } = event;
		const formData = Object.fromEntries(await request.formData());
		console.log('formData', formData);
		if(!formData.payDate) return fail(403, { error: true, message: 'กรุณาใส่วันที่จ่ายเงิน' });
		// await db.billing.update({
		// 	where: { id: parseInt(formData.id.toString()) },
		// 	data: {
		// 		payDate: formData.payDate !== '' ? new Date(formData.payDate.toString()) : new Date(),
		// 		paid: true
		// 	}
		// });
		return {
			name: 'billing',
			success: true,
			message: `บันทึกการจ่ายเงินเดือนพนักงานสำเร็จ`
		};
	}
};
