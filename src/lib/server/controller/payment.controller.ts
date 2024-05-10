import db from '../prisma';

export const createPaymentEmployee = async (
	employeeId: number,
	payment: any[],
	currentPayment: any[]
) => {
	const unsyncPayment = payment.filter((p) => currentPayment.every((cp) => cp.paymentId !== p.id));
	await db.paymentEmployee.createMany({
		data: unsyncPayment.map((up) => ({
			paymentId: up.id,
			employeeId: employeeId,
			amount: up.amount
		}))
	});
	return await db.paymentEmployee.findMany({
		select: {
			id: true,
			paymentId: true,
			amount: true,
			active: true,
			payment: { select: { name: true, payType: true, type: true } }
		},
		where: { payment: { active: true }, employeeId: employeeId },
		orderBy: { id: 'asc' }
	});
};
