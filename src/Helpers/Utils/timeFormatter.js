module.exports.read24hrFormat = (text) => {
	let j, k, ms;
	j = k = ms = 0;

	if (!text) return 0;
	const result = text.split(/:/);

	if (result.length === 3) result.push('00');

	for (let i = result.length - 1; i >= 0; i--) {
		k = Math.abs(parseInt(result[i]) * 1000 * Math.pow(60, j < 3 ? j : 2));
		j++;
		ms += k;
	}
	if (isFinite(ms)) {
		return ms;
	} else {
		throw new TypeError('Final value is greater than Number can hold.');
	}
};

module.exports.getReadableTime = (ms) => {
	if (!ms || ms && !isFinite(ms)) {throw new TypeError('You need to pass a total number of milliseconds! (That number cannot be greater than Number limits)');}
	if (typeof ms !== 'number') {throw new TypeError(`You need to pass a number! Instead received: ${typeof ms}`);}
	const t = this.getTimeObject(ms);
	const reply = [];
	if (t.years) 	reply.push(`${t.years} yrs`);
	if (t.months) reply.push(`${t.months} mo`);
	if (t.days) reply.push(`${t.days} d`);
	if (t.hours) reply.push(`${t.hours} hrs`);
	if (t.minutes) reply.push(`${t.minutes} min`);
	if (t.seconds) reply.push(`${t.seconds} sec`);
	return reply.length > 0 ? reply.join(', ') : '0sec';
};

module.exports.getTimeObject = (ms) => {
	if (!ms || typeof ms !== 'number' || !isFinite(ms)) throw new TypeError('Final value is greater than Number can hold or you provided invalid argument.');
	const result = {
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: Math.floor(ms),
	};

	while (result.milliseconds >= 1000) {
		if (result.milliseconds >= 3.154e+10) {
			result.years++;
			result.milliseconds -= 3.154e+10;
		}
		if (result.milliseconds >= 2.592e+9) {
			result.months++;
			result.milliseconds -= 2.592e+9;
		}
		if (result.milliseconds >= 8.64e+7) {
			result.days++;
			result.milliseconds -= 8.64e+7;
		}
		if (result.milliseconds >= 3.6e+6) {
			result.hours++;
			result.milliseconds -= 3.6e+6;
		}
		if (result.milliseconds >= 60000) {
			result.minutes++;
			result.milliseconds -= 60000;
		}
		if (result.milliseconds >= 1000) {
			result.seconds++;
			result.milliseconds -= 1000;
		}
	}

	if (result.seconds >= 60) {
		result.minutes += Math.floor(result.seconds / 60);
		result.seconds = result.seconds - (Math.floor(result.seconds / 60) * 60);
	}
	if (result.minutes >= 60) {
		result.hours += Math.floor(result.minutes / 60);
		result.minutes = result.minutes - (Math.floor(result.minutes / 60) * 60);
	}
	if (result.hours >= 24) {
		result.days += Math.floor(result.hours / 24);
		result.hours = result.hours - (Math.floor(result.hours / 24) * 24);
	}
	if (result.days >= 30) {
		result.months += Math.floor(result.days / 30);
		result.days = result.days - (Math.floor(result.days / 30) * 30);
	}
	if (result.months >= 12) {
		result.years += Math.floor(result.months / 12);
		result.months = result.months - (Math.floor(result.months / 12) * 12);
	}
	return result;
};

module.exports.getTotalTime = (timeFormat) => {
	if (!timeFormat.endsWith('d') && !timeFormat.endsWith('h') && !timeFormat.endsWith('m') && !timeFormat.endsWith('s')) {
		return { error: 'time:INCORRECT_DELIMITERS' };
	}
	if (isNaN(timeFormat.slice(0, -1))) return { error: 'time:INVALID_TIME' };

	const time = require('ms')(timeFormat);

	if (time >= 864000000) return { error: 'time:MAX_TIME' };

	return { success: time };
};

module.exports.timeformat = async (timeInSeconds) => {
    const days = Math.floor((timeInSeconds % 31536000) / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return (
      (days > 0 ? `${days} days, ` : "") +
      (hours > 0 ? `${hours} hours, ` : "") +
      (minutes > 0 ? `${minutes} minutes, ` : "") +
      (seconds > 0 ? `${seconds} seconds` : "")
    );
};