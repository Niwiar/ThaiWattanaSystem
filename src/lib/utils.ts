export const number2CommaDecimal = (n: number) =>
	n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
