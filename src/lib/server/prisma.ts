import { PrismaClient } from '@prisma/client';

const db = new PrismaClient().$extends({
	result: {
		billing: {
			tax3: {
				needs: { salary: true },
				compute(billing) {
					return (billing.salary || 0) * 0.03;
				}
			},
			summary: {
				needs: { income: true, deduction: true },
				compute(billing) {
					return (billing.income || 0) - (billing.deduction || 0);
				}
			}
		},
		employeePayment: {
			total: {
				needs: { amount: true, period: true },
				compute(billing) {
					return (billing.amount || 0) * (billing.period || 0);
				}
			}
		}
	}
});

export default db;
