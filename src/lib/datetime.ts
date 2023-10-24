type CheckDate = string | Date;

export const pvToDate = (date?: CheckDate) => new Date(date ?? '');

export const pvGetDate = (date: Date) => {
	const DD = date.toLocaleString('default', { day: '2-digit' });
	const MM = date.toLocaleString('default', { month: '2-digit' });
	const YYYY = date.getFullYear();
	return `${YYYY}-${MM}-${DD}`;
};

export const pvGetMonth = (date: Date) => {
	const MM = date.toLocaleString('default', { month: '2-digit' });
	const YYYY = date.getFullYear();
	return `${YYYY}-${MM}`;
};

export const pvGetTime = (date: Date) => {
	const hh = date.toLocaleString('default', {
		hour: '2-digit',
		hour12: false
	});
	const mm = date.toLocaleString('default', { minute: '2-digit' });
	const ss = date.toLocaleString('default', { second: '2-digit' });
	return `${hh}:${mm}:${ss}`;
};

export const pvGetDatetime = (date: Date) => `${pvGetDate(date)} ${pvGetTime(date)}`;

export const pvGetDates = (startDate: Date, endDate: Date): string[] => {
	const dateArray: string[] = [];
	const tempDate = startDate;
	while (tempDate <= endDate) {
		dateArray.push(pvGetDate(tempDate));
		tempDate.setDate(tempDate.getDate() + 1);
	}
	return dateArray;
};

export const pvGetWeek = (checkDate: CheckDate): string[] => {
	const tempDate = new Date(checkDate);
	const Week: string[] = new Array(7);
	tempDate.setDate(tempDate.getDate() - tempDate.getDay() + 1);
	for (let i = 0; i < 7; i++) {
		const Dow = tempDate.getDay();
		Week[Dow == 0 ? 6 : Dow - 1] = pvGetDate(tempDate);
		tempDate.setDate(tempDate.getDate() + 1);
	}
	return Week;
};

export const pvGetDayOfWeek = (checkDate: CheckDate) => new Date(checkDate).getDay();

export const pvLastdayInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();
