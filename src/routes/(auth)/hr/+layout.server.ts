import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';
import type { EmployeeList, PositionList } from '$src/lib/types/hr';

export const load: LayoutServerLoad = async ({
	fetch,
	request,
	locals,
	url
}: LayoutServerLoadEvent) => {
	const user = locals.user;
	const permission = JSON.parse(user?.permission ?? '[]');
	if (permission['hr'] === '0') {
		const previousPage = request.headers.get('referer')?.split('/')[3].split('?')[0];
		throw redirect(302, `${previousPage || '/'}?redirectFrom=${url.pathname}`);
	}
	const employeeRes = await fetch('/api/hr/employee?dataField=full');
	const employee = await employeeRes.json();
	const positionRes = await fetch('/api/hr/position?dataField=dropdown');
	const position = await positionRes.json();
	const teamRes = await fetch('/api/hr/team?dataField=dropdown');
	const team = await teamRes.json();
	const roleRes = await fetch('/api/hr/role?dataField=dropdown');
	const role = await roleRes.json();

	return {
		employees: employeeRes.status == 200 ? (employee.data as EmployeeList[]) : [],
		positions: positionRes.status == 200 ? (position.data as PositionList[]) : null,
		teams: teamRes.status == 200 ? (team.data as PositionList[]) : null,
		roles: roleRes.status == 200 ? (role.data as PositionList[]) : null
	};
};
