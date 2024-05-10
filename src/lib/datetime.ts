type CheckDate = string | Date;

export const pvToDate = (date?: CheckDate) => new Date(date ?? '');

export const pvGetDate = (date: Date) => {
	const DD = date.toLocaleString('default', { day: '2-digit' });
	const MM = date.toLocaleString('default', { month: '2-digit' });
	const YYYY = date.getFullYear();
	return `${YYYY}-${MM}-${DD}`;
};

export const pvGetDateDMY = (date: Date) => {
	const DD = date.toLocaleString('default', { day: '2-digit' });
	const MM = date.toLocaleString('default', { month: '2-digit' });
	const YYYY = date.getFullYear();
	return `${DD}/${MM}/${YYYY}`;
};

export const pvGetMonth = (date: Date) => {
	let MM: number | string = date.getMonth() + 1;
	const YYYY = date.getFullYear();
	if (MM < 10) {
		MM = '0' + MM;
	}
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

export const pvGetHHMM = (date: Date) => {
	const hh = date.toLocaleString('default', {
		hour: '2-digit',
		hour12: false
	});
	const mm = date.toLocaleString('default', { minute: '2-digit' });
	return `${hh}:${mm}`;
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

export const pvLastdayInMonth = (month: string, year: string) =>
	new Date(parseInt(year), parseInt(month), 0).getDate();

export const pvDiffMonth = (before: Date, after: Date): number => {
	const date1 = new Date(before);
	const date2 = new Date(after);
	const diffTime = date2.getTime() - date1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
	return diffDays;
};

export const pvDiffDate = (before: Date, after: Date): number => {
	const date1 = new Date(before);
	const date2 = new Date(after);
	const diffTime = date2.getTime() - date1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
};

export const pvDiffMin = (before: Date, after: Date): number => {
	const date1 = new Date(before);
	const date2 = new Date(after);
	const diffTime = date2.getTime() - date1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60));
	return diffDays;
};

export const pvGetLastDate = (month: string) => {
	const max = pvLastdayInMonth(month.split('-')[1], month.split('-')[0]);
	return pvGetMonth(new Date()) !== month ? new Date(`${month}-${max}`) : new Date();
};

export const pvIsFuture = (date: Date) => date > new Date(pvGetDate(new Date()));
