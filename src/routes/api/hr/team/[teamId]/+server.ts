import { error, json } from '@sveltejs/kit';

import db from '$server/prisma';
import { Prisma, type Team } from '@prisma/client';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const { teamId } = params;
	console.log(teamId);
	const team = await db.team.findUnique({
		where: { id: parseInt(teamId) }
	});
	if (!team) throw error(404, 'Team not found');

	return json({ team });
};

export const PUT: RequestHandler = async ({ request, params }: RequestEvent) => {
	const { teamId } = params;
	const { name } = (await request.json()) as Team;
	try {
		await db.team.update({
			data: {
				name
			},
			where: {
				id: parseInt(teamId)
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					throw error(404, 'Team not found');
				case 'P2002':
					throw error(404, 'Duplicate team name');
			}
		}
	}
	return json({ message: 'ok' });
};

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	const { teamId } = params;
	console.log(teamId);

	await db.team.update({
		data: {
			active: false,
			role: {
				updateMany: {
					data: { active: false },
					where: { teamId: parseInt(teamId) }
				}
			}
		},
		where: { id: parseInt(teamId) }
	});

	// await db.employee.updateMany({
	// 	data: { teamId:null,roleId: null },
	// 	where: { roleId: parseInt(teamId) }
	// });
	// await db.team.delete({
	// 	include: {
	// 		role: { where: { teamId: parseInt(teamId) } }
	// 	},
	// 	where: { id: parseInt(teamId) }
	// });

	return json({ message: 'ok' });
};
