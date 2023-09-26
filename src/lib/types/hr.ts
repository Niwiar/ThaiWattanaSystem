export type EmployeeList = {
	id: number;
	imageFile: string;
	firstname: string;
	lastname: string;
	tel: string;
	position: {
		name: string;
	};
};

export type PositionList = {
	id: number;
	name: string;
	salary: number;
	payType: number;
	payTypeText: string;
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
