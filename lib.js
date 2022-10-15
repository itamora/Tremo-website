function range(start, end, step) {
	if (start < 0) {
		start = 0;
	};
	let array = [];
	for (let i = start; i < end; i += step) {
		array.push(i);
	};
	return array;
};

function calcDay(date, month, fullYear) {
	let y = parseInt(`${fullYear}`.substring(`${fullYear}`.length - 2));
	let c = parseInt(`${fullYear}`.substring(0, `${fullYear}`.length - 2));
	let m = month;
	let d = date;
	switch (month) {
		case 0:
			m = 13;
			break;
		case 1:
			m = 14;
			break;
		default:
			m++;
			break;
	};
	return WEEK[(y + Math.trunc(y / 4) + Math.trunc(c / 4) - 2 * c + Math.trunc(26 * (m + 1) / 10) + d - 1) % 7]; // Thank Zeller.
};

function fullDate(date) {
	if (date < 10) {return `0${date}`;};
	return date;
};

function fullMonth(month) {
	if (month < 9) {return `0${month + 1}`;};
	return month + 1;
};

// with love.