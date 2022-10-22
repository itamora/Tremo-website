function range(start, end, step) {
	if (start < 0) {
		start = 0;
	};
	var array = [];
	for (let i = start; i < end; i += step) {
		array.push(i);
	};
	return array;
};

function ToHex(rgba) {
	var hex = rgba.split(/, /);
	for (let i = 0; i < 4; i++) {
		switch (i) {
			case 3:
				hex[i] = hex[i] * 255;
				break;
		};
		hex[i] = parseInt(hex[i]).toString(16);
		switch (hex[i].length) {
			case 1:
				hex[i] = 0 + hex[i];
				break;
		};
	};
	return "#" + hex.join("");
};

function calcDay(date, month, fullYear) {
	var y = parseInt(`${fullYear}`.substring(`${fullYear}`.length - 2));
	var c = parseInt(`${fullYear}`.substring(0, `${fullYear}`.length - 2));
	var m = month;
	var d = date;
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