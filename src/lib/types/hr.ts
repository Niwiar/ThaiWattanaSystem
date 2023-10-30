export type EmployeeList = {
	id: number;
	imageFile: string;
	employeeCode: string;
	name: string;
	tel: string;
	birthdate: string;
	workdate: string;
	team: {
		name: string;
	};
	role: {
		name: string;
	};
	position: {
		name: string;
	};
};

export type PositionList = {
	id: number;
	name: string;
};

export type TeamList = {
	id: number;
	name: string;
};

export type RoleList = {
	id: number;
	name: string;
};

export type UserList = {
	id: number;
	username: string;
	password: string;
	email: number;
	permission: string;
};

export type PaymentList = {
	id: number;
	type?: number;
	name: string;
	amount: number;
	payType: string;
};
