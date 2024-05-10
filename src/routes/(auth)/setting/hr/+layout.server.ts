import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';
import type {
	EmployeeList,
	PaymentList,
	PositionList,
	RoleList,
	TeamList
} from '$src/lib/types/hr';

export const load: LayoutServerLoad = async ({ fetch }: LayoutServerLoadEvent) => {
	const employeeRes = await fetch('/api/hr/employee?dataField=full');
	const employee = await employeeRes.json();
	const positionRes = await fetch('/api/setting/position');
	const positions = await positionRes.json();
	const paymentRes = await fetch('/api/setting/payment');
	const payments = await paymentRes.json();
	const teamRes = await fetch('/api/setting/team');
	const teams = await teamRes.json();
	const roleRes = await fetch('/api/setting/role');
	const roles = await roleRes.json();

	return {
		employees: employeeRes.status == 200 ? (employee.data as EmployeeList[]) : [],
		positions: positionRes.status == 200 ? (positions.data as PositionList[]) : [],
		teams: teamRes.status == 200 ? (teams.data as TeamList[]) : [],
		roles: roleRes.status == 200 ? (roles.data as RoleList[]) : [],
		payments: paymentRes.status == 200 ? (payments.data as PaymentList[]) : null
	};
};
