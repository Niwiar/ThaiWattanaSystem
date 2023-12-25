export type AttendanceCheck = {
	employeeCode: string;
	createdAt: string;
	buffer: Buffer;
};

export type AttendanceInsert = {
	employeeId: number;
	createdAt: Date;
	date: Date;
	imageFile: null | string;
};
