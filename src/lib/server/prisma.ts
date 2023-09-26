import { PrismaClient } from '@prisma/client';

const db = new PrismaClient().$extends({
	result: {
		employee: {
			fullname: {
				needs: { firstname: true, lastname: true },
				compute(employee) {
					return;
					`${employee.firstname} ${employee.lastname}`;
				}
			}
		}
	}
});

export default db;
