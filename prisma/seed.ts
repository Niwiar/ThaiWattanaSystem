import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	const admin = await prisma.user.upsert({
		where: { username: 'admin' },
		update: {},
		create: {
			username: 'admin',
			password: '$2b$10$ScpJ3k59dHUQOS2nWQgngOPtyflVd96sg7YJsHBuSliNpspCHGSK2',
			email: 'admin@example.com',
			permission: '{"hr":"2","production":"2","warehouse":"2","setting":"2","user":"2"}'
		}
	});
	const working = await prisma.working.upsert({
		where: { id: 1 },
		update: {},
		create: {
			workday: '{"1":true,"2":true,"3":true,"4":true,"5":true,"6":false,"7":false}',
			startWorktime: '08:00',
			stopWorktime: '17:00',
			lateTime: '08:15'
		}
	});

	const positions = [
		'พนักงานรายวัน',
		'ฝ่ายผลิต',
		'แม่บ้าน',
		'คนขับรถ 6 ล้อ',
		'คนขับ Folklift',
		'Store & QC'
	];
	for (const position of positions)
		await prisma.position.upsert({
			where: { name: position },
			update: {},
			create: { name: position }
		});

	const payments = [
		{ type: 1, name: 'O.T. 1.5', amount: 75, payType: 1 },
		{ type: 1, name: 'O.T. 2', amount: 100, payType: 1 },
		{ type: 1, name: 'O.T. 3', amount: 150, payType: 1 },
		{ type: 2, name: 'เบี้ยขยัน', amount: 0, payType: 3 },
		{ type: 2, name: 'เบี้ยเลี้ยง', amount: 0, payType: 3 },
		{ type: 2, name: 'ค่าเข้ากะ', amount: 50, payType: 2 },
		{ type: 3, name: 'ค่าข้าว', amount: 30, payType: 2 },
		{ type: 3, name: 'ค่าโทรศัพท์', amount: 0, payType: 3 },
		{ type: 3, name: 'รายรับอื่นๆ', amount: 0, payType: 3 },
		{ type: 4, name: 'ประกันสังคม', amount: 0, payType: 3 },
		{ type: 4, name: 'ค่าห้องพัก', amount: 0, payType: 3 },
		{ type: 4, name: 'เบิกล่วงหน้า', amount: 0, payType: 3 },
		{ type: 4, name: 'อื่นๆ / ภาษี', amount: 0, payType: 3 }
	];

	for (const payment of payments)
		await prisma.payment.upsert({
			where: { name: payment.name },
			update: {},
			create: {
				name: payment.name,
				type: payment.type,
				amount: payment.amount,
				payType: payment.payType
			}
		});
	console.log({ admin, working });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
