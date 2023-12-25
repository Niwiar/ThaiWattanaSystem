/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toObject } from '$src/lib';
import {
	pvDiffDate,
	pvDiffMin,
	pvDiffMonth,
	pvGetDate,
	pvGetDates,
	pvGetDayOfWeek,
	pvGetLastDate,
	pvIsFuture
} from '$src/lib/datetime';
import type { Holiday, Working } from '@prisma/client';
import db from '../prisma';

export const getBusinessDay = (
	month: string,
	workday: any,
	holiday: Holiday[] | null,
	workdate: Date,
	monthType: string
) => {
	return monthType === 'outRange'
		? []
		: monthType === 'start'
		? pvGetDates(workdate, pvGetLastDate(month)).filter(
				(d) =>
					workday[pvGetDayOfWeek(new Date(d))] &&
					holiday?.filter((h) => {
						return pvDiffDate(h.date, new Date(d)) === 0;
					}).length == 0
		  )
		: pvGetDates(new Date(`${month}-1`), pvGetLastDate(month)).filter(
				(d) =>
					workday[pvGetDayOfWeek(new Date(d))] &&
					holiday?.filter((h) => {
						return pvDiffDate(h.date, new Date(d)) === 0;
					}).length == 0
		  );
};

export const getAttendance = async (employeeId: string, month: string, working: Working) => {
	const { lateTime } = working;
	// console.log(new Date(`${month}-1`), pvGetLastDate(month));

	return toObject(
		(
			await db.employeeAttendance.groupBy({
				by: ['date'],
				where: {
					employeeId: parseInt(employeeId),
					createdAt: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
				},
				_min: { id: true, createdAt: true, imageFile: true },
				_max: { id: true, createdAt: true, imageFile: true }
			})
		).map((a) => {
			return {
				...a,
				type: !a._min.createdAt
					? 'absent'
					: pvDiffMin(
							new Date(`${a.date.toDateString()} ${lateTime}`),
							new Date(a._min.createdAt)
					  ) > 0
					? 'late'
					: 'present'
				// isWorkday:
				// 	businessDay?.filter((d) => {
				// 		return pvDiffDate(new Date(d), a.date) === 0;
				// 	}).length !== 0
			};
		})
	);
};

export const getLeaveSummary = async (employeeId: string, month: string) =>
	toObject(
		await db.employeeLeave.groupBy({
			by: ['type'],
			where: {
				employeeId: parseInt(employeeId),
				date: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
			},
			_count: { id: true }
		})
	);

export const getLeave = async (employeeId: string, month: string) =>
	toObject(
		await db.employeeLeave.groupBy({
			by: ['id', 'type', 'date', 'period'],
			where: {
				employeeId: parseInt(employeeId),
				date: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
			}
		})
	);

export const getManyAttendance = (
	employeeId: string,
	month: string,
	employee: any,
	working: Working
) =>
	new Promise(async (resolve) => {
		const monthType = pvIsFuture(new Date(month))
			? 'future'
			: pvDiffMonth(employee?.workdate || new Date(), new Date(month)) < 0
			? 'beforeWork'
			: Math.abs(pvDiffMonth(employee?.workdate || new Date(), new Date(month))) == 0
			? 'start'
			: 'inRange';
		let businessDay: string[] = [],
			attendance: any[] = [];

		const leave = await getLeave(employeeId, month);
		if (monthType === 'inRange' || monthType === 'start') {
			businessDay = getBusinessDay(
				month,
				JSON.parse(working.workday),
				await db.holiday.findMany({
					where: {
						date: { gte: new Date(`${month}-1`), lte: pvGetLastDate(month) }
					}
				}),
				employee?.workdate || new Date(),
				monthType
			);
			attendance = await getAttendance(employeeId, month, working);

			businessDay.map((day) => {
				if (
					!attendance.find((a: { date: string }) => a.date.split('T')[0] === day) &&
					!leave.find((l: { date: string }) => l.date.split('T')[0] === day) &&
					day !== pvGetDate(new Date())
				) {
					attendance.push({
						date: day,
						type: 'absent'
					});
				}
			});
		}
		resolve({
			employee,
			attendance,
			leave,
			monthType
		});
	});
